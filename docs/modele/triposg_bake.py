# Wypalanie tekstury z malunku na bryle TripoSG (bez tekstury).
# 1) czyszczenie odpryskow, 2) dopasowanie kamery malunku (sylwetka), 3) UV (xatlas),
# 4) rzut malunku z kamery i jej lustrzanych odbic (X, Z) z kontrola widocznosci, 5) reszta z najblizszego widocznego punktu.
import sys, json, struct, numpy as np, trimesh, xatlas
from PIL import Image, ImageDraw
from scipy.spatial import cKDTree
from scipy import ndimage

def load(path):
    s = trimesh.load(path, force='mesh', process=False)
    m = trimesh.Trimesh(s.vertices, s.faces, process=True)
    return m

def clean(m, house):
    parts = m.split(only_watertight=False)
    if len(parts) > 1:
        ext = m.extents.max()
        keep = [p for p in parts if len(p.faces) >= max(40, .004 * len(m.faces)) or p.extents.max() > .06 * ext]
        m = trimesh.util.concatenate(keep)
    v = m.vertices.copy()
    v[:, 1] -= v[:, 1].min()
    c = (v[:, [0, 2]].max(0) + v[:, [0, 2]].min(0)) / 2
    v[:, 0] -= c[0]; v[:, 2] -= c[1]
    m = trimesh.Trimesh(v, m.faces, process=False)
    if house:  # spod domu (podloga z bryly) usuniety: widac podloge gry
        n = m.face_normals; y = m.vertices[m.faces][:, :, 1].max(1)
        bad = (n[:, 1] < -.6) & (y < .03 * m.extents[1])
        m.update_faces(~bad); m.remove_unreferenced_vertices()
    return m

def rot(yaw, pitch):
    a, b = np.radians(yaw), np.radians(pitch)
    Ry = np.array([[np.cos(a), 0, np.sin(a)], [0, 1, 0], [-np.sin(a), 0, np.cos(a)]])
    Rx = np.array([[1, 0, 0], [0, np.cos(b), -np.sin(b)], [0, np.sin(b), np.cos(b)]])
    return Rx @ Ry

def sil(V, F, R, S=128):
    p = V @ R.T; xy = np.c_[p[:, 0], -p[:, 1]]
    mn, mx = xy.min(0), xy.max(0); sc = (S - 8) / (mx - mn).max(); xy = (xy - mn) * sc + 4
    im = Image.new('L', (S, S), 0); d = ImageDraw.Draw(im)
    for f in F: d.polygon([tuple(xy[i]) for i in f], fill=255)
    return np.array(im) > 0

def norm_mask(m, S=128):
    ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    crop = Image.fromarray((m[y0:y1 + 1, x0:x1 + 1] * 255).astype(np.uint8))
    w, h = crop.size; sc = (S - 8) / max(w, h); crop = crop.resize((max(1, round(w * sc)), max(1, round(h * sc))))
    out = Image.new('L', (S, S), 0); out.paste(crop, (4, 4)); return np.array(out) > 127

def fit(m, mask):
    sm = m.simplify_quadric_decimation(face_count=1500) if len(m.faces) > 2000 else m
    V, F = sm.vertices, sm.faces; tgt = norm_mask(mask)
    best = (-1, 0, 0)
    def score(y, p):
        s = norm_mask(sil(V, F, rot(y, p))); return (s & tgt).sum() / max(1, (s | tgt).sum())
    for y in range(-90, 91, 6):
        for p in range(0, 61, 6):
            sc = score(y, p)
            if sc > best[0]: best = (sc, y, p)
    _, y0, p0 = best
    for y in np.arange(y0 - 5, y0 + 5.1, 1.5):
        for p in np.arange(max(0, p0 - 5), p0 + 5.1, 1.5):
            sc = score(y, p)
            if sc > best[0]: best = (sc, y, p)
    return best

def project_setup(m, mask, R):
    p = m.vertices @ R.T; xy = np.c_[p[:, 0], -p[:, 1]]
    ys, xs = np.nonzero(mask)
    # skala z pola sylwetki, przesuniecie ze srodka ciezkosci
    S = sil(m.vertices, m.faces, R, 256); a_sil = S.sum()
    mn, mx = xy.min(0), xy.max(0); sc256 = (256 - 8) / (mx - mn).max()
    area_world = a_sil / sc256 ** 2
    s = np.sqrt(len(xs) / area_world)
    yy, xx = np.nonzero(S); cw = np.array([xx.mean(), yy.mean()]) / sc256 + mn - 4 / sc256
    cm = np.array([xs.mean(), ys.mean()])
    t = cm - cw * s
    return s, t

def render_ids(P2, Z, F, W, H):
    order = np.argsort(Z[F].mean(1))  # od najdalszych (mniejsze z) do najblizszych
    im = Image.new('I', (W, H), -1); d = ImageDraw.Draw(im)
    for fi in order:
        d.polygon([tuple(P2[i]) for i in F[fi]], fill=int(fi))
    return np.array(im, dtype=np.int64)

def bary(P, A, B, C):
    v0, v1, v2 = B - A, C - A, P - A
    d00 = (v0 * v0).sum(-1); d01 = (v0 * v1).sum(-1); d11 = (v1 * v1).sum(-1); d20 = (v2 * v0).sum(-1); d21 = (v2 * v1).sum(-1)
    den = d00 * d11 - d01 * d01; den[np.abs(den) < 1e-12] = 1e-12
    v = (d11 * d20 - d01 * d21) / den; w = (d00 * d21 - d01 * d20) / den
    return 1 - v - w, v, w

def bake(name, glb, img, out, house=False, res=1024, erase=None):
    m = clean(load(glb), house)
    if len(m.faces) > 16000: m = m.simplify_quadric_decimation(face_count=15000)
    pim = Image.open(img).convert('RGBA'); paint = np.array(pim).astype(np.float32)
    if erase:  # zamalowanie napisu: piksele jasne w prostokacie dostaja kolor deski
        x0, y0, x1, y1 = erase; reg = paint[y0:y1, x0:x1, :3]; lum = reg.mean(-1)
        board = np.median(reg[lum < np.percentile(lum, 55)], axis=0)
        msk = lum > np.percentile(lum, 55) - 10
        msk = ndimage.binary_dilation(msk, iterations=3)
        noise = (np.random.RandomState(3).rand(*reg.shape[:2], 1) - .5) * 14
        reg[msk] = (board + noise)[msk]; paint[y0:y1, x0:x1, :3] = reg
    H, W = paint.shape[:2]; alpha = paint[:, :, 3] > 128
    sc, yaw, pitch = fit(m, alpha)
    R = rot(yaw, pitch); s, t = project_setup(m, alpha, R)
    # UV
    vmap, idx, uv = xatlas.parametrize(m.vertices, m.faces)
    V = m.vertices[vmap]; F = idx.astype(np.int64)
    tm = trimesh.Trimesh(V, F, process=False); FN = tm.face_normals; VN = tm.vertex_normals
    # mapa trojkatow w UV
    T = res; uvp = uv * (T - 1)
    im = Image.new('I', (T, T), -1); d = ImageDraw.Draw(im)
    for fi, f in enumerate(F): d.polygon([(uvp[i, 0], (T - 1) - uvp[i, 1]) for i in f], fill=fi)
    fid = np.array(im, dtype=np.int64); ys, xs = np.nonzero(fid >= 0); ff = fid[ys, xs]
    Pt = np.c_[xs, (T - 1) - ys].astype(np.float64)
    A, B, C = uvp[F[ff, 0]], uvp[F[ff, 1]], uvp[F[ff, 2]]
    u, v, w = bary(Pt, A, B, C); u, v, w = [np.clip(x, -.2, 1.2) for x in (u, v, w)]
    P3 = V[F[ff, 0]] * u[:, None] + V[F[ff, 1]] * v[:, None] + V[F[ff, 2]] * w[:, None]
    N3 = FN[ff]
    # bufor glebokosci z kamery malunku
    pv = V @ R.T; P2 = np.c_[pv[:, 0], -pv[:, 1]] * s + t; Z = pv[:, 2]
    ids = render_ids(P2, Z, F, W, H)
    ext = m.extents.max(); eps = .02 * ext
    col = np.zeros((len(ff), 3), np.float32); score = np.full(len(ff), -1.0)
    for mir in [(1, 1), (-1, 1), (1, -1), (-1, -1)]:
        Q = P3 * np.array([mir[0], 1, mir[1]]); NQ = N3 * np.array([mir[0], 1, mir[1]])
        q = Q @ R.T; px = q[:, 0] * s + t[0]; py = -q[:, 1] * s + t[1]
        ix = np.clip(np.round(px).astype(int), 0, W - 1); iy = np.clip(np.round(py).astype(int), 0, H - 1)
        inb = (px >= 0) & (px < W) & (py >= 0) & (py < H)
        f2 = ids[iy, ix]; ok = inb & (f2 >= 0) & alpha[iy, ix]
        # glebokosc trojkata f2 w pikselu
        g = np.where(ok)[0]; zz = np.full(len(ff), -1e9)
        if len(g):
            fa = F[f2[g]]; a2, b2, c2 = P2[fa[:, 0]], P2[fa[:, 1]], P2[fa[:, 2]]
            uu, vv, ww = bary(np.c_[px[g], py[g]], a2, b2, c2)
            zz[g] = Z[fa[:, 0]] * uu + Z[fa[:, 1]] * vv + Z[fa[:, 2]] * ww
        vis = ok & (np.abs(zz - q[:, 2]) < eps)
        facing = (NQ @ R.T)[:, 2]
        sc_ = np.where(vis & (facing > .05), facing - (0 if mir == (1, 1) else .35), -1)
        better = sc_ > score
        col[better] = paint[iy[better], ix[better], :3]; score[better] = sc_[better]
    good = score > -1
    if (~good).any() and good.any():
        tr = cKDTree(P3[good]); _, nn = tr.query(P3[~good], k=4)
        col[~good] = col[good][nn].mean(1)
    tex = np.zeros((T, T, 3), np.float32); has = np.zeros((T, T), bool)
    tex[ys, xs] = col; has[ys, xs] = True
    di, inds = ndimage.distance_transform_edt(~has, return_indices=True)
    tex = tex[inds[0], inds[1]]
    Image.fromarray(np.clip(tex, 0, 255).astype(np.uint8)).save(out + '.webp', quality=88, method=6)
    # GLB: POSITION, NORMAL, TEXCOORD_0, indices
    pos = V.astype(np.float32); nor = VN.astype(np.float32); tc = np.c_[uv[:, 0], 1 - uv[:, 1]].astype(np.float32)
    ind = F.astype(np.uint32 if len(V) > 65535 else np.uint16).ravel()
    blobs = [pos.tobytes(), nor.tobytes(), tc.tobytes(), ind.tobytes()]
    offs = []; b = b''
    for x in blobs:
        offs.append(len(b)); b += x + b'\0' * ((4 - len(x) % 4) % 4)
    js = {'asset': {'version': '2.0'}, 'scenes': [{'nodes': [0]}], 'scene': 0, 'nodes': [{'mesh': 0}],
          'meshes': [{'primitives': [{'attributes': {'POSITION': 0, 'NORMAL': 1, 'TEXCOORD_0': 2}, 'indices': 3}]}],
          'buffers': [{'byteLength': len(b)}],
          'bufferViews': [{'buffer': 0, 'byteOffset': offs[i], 'byteLength': len(blobs[i])} for i in range(4)],
          'accessors': [
              {'bufferView': 0, 'componentType': 5126, 'count': len(pos), 'type': 'VEC3', 'min': pos.min(0).tolist(), 'max': pos.max(0).tolist()},
              {'bufferView': 1, 'componentType': 5126, 'count': len(pos), 'type': 'VEC3'},
              {'bufferView': 2, 'componentType': 5126, 'count': len(pos), 'type': 'VEC2'},
              {'bufferView': 3, 'componentType': 5125 if ind.dtype == np.uint32 else 5123, 'count': len(ind), 'type': 'SCALAR'}]}
    jb = json.dumps(js).encode(); jb += b' ' * ((4 - len(jb) % 4) % 4)
    glbb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(jb) + 8 + len(b)) + struct.pack('<II', len(jb), 0x4E4F534A) + jb + struct.pack('<II', len(b), 0x004E4942) + b
    open(out + '.glb', 'wb').write(glbb)
    return dict(name=name, iou=round(float(sc), 3), yaw=float(yaw), pitch=float(pitch), faces=len(F), verts=len(V), seen=round(float(good.mean()), 3), ext=[round(float(x), 3) for x in m.extents])

if __name__ == '__main__':
    name, glb, img, out, house, res = sys.argv[1:7]
    erase = json.loads(sys.argv[7]) if len(sys.argv) > 7 else None
    print(json.dumps(bake(name, glb, img, out, house == '1', int(res), erase)))

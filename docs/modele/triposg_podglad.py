import sys, numpy as np, trimesh
from PIL import Image, ImageDraw
sys.path.insert(0, '/tmp/m3')
from bake import rot

import json, struct
def readglb(p):
    b = open(p, 'rb').read(); jl = struct.unpack('<I', b[12:16])[0]; js = json.loads(b[20:20 + jl]); bin_ = b[20 + jl + 8:]
    def acc(i):
        a = js['accessors'][i]; bv = js['bufferViews'][a['bufferView']]; n = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3}[a['type']]
        dt = {5126: np.float32, 5125: np.uint32, 5123: np.uint16}[a['componentType']]
        return np.frombuffer(bin_, dt, a['count'] * n, bv.get('byteOffset', 0)).reshape(-1, n) if n > 1 else np.frombuffer(bin_, dt, a['count'], bv.get('byteOffset', 0))
    pr = js['meshes'][0]['primitives'][0]
    return acc(pr['attributes']['POSITION']), acc(pr['indices']).reshape(-1, 3).astype(np.int64), acc(pr['attributes']['TEXCOORD_0'])
def view(glb, tex, yaw, pitch, S=360):
    V, F, uv = readglb(glb)
    T = np.array(Image.open(tex).convert('RGB')).astype(np.float32); th, tw = T.shape[:2]
    cu = uv[F].mean(1); c = T[np.clip(((cu[:, 1]) * (th - 1)).astype(int), 0, th - 1), np.clip((cu[:, 0] * (tw - 1)).astype(int), 0, tw - 1)]
    R = rot(yaw, pitch); p = V @ R.T; xy = np.c_[p[:, 0], -p[:, 1]]
    mn, mx = xy.min(0), xy.max(0); sc = (S - 20) / (mx - mn).max(); xy = (xy - mn) * sc + 10
    n = trimesh.Trimesh(V, F, process=False).face_normals @ R.T
    sh = np.clip(.55 + .45 * np.abs(n @ np.array([.3, .5, .8]) / np.linalg.norm([.3, .5, .8])), 0, 1)
    im = Image.new('RGB', (S, S), (40, 40, 46)); d = ImageDraw.Draw(im)
    for fi in np.argsort(p[F][:, :, 2].mean(1)):
        if n[fi, 2] < -0.0 and False: continue
        d.polygon([tuple(xy[i]) for i in F[fi]], fill=tuple(int(x) for x in c[fi] * sh[fi]))
    return im

if __name__ == '__main__':
    out = sys.argv[1]; items = sys.argv[2:]
    ims = []
    for base in items:
        row = [view(base + '.glb', base + '.webp', y, p) for y, p in [(0, 50), (35, 30), (180, 50), (-90, 20)]]
        ims.append(row)
    S = 360; W = Image.new('RGB', (S * 4, S * len(ims)))
    for r, row in enumerate(ims):
        for c, im in enumerate(row): W.paste(im, (c * S, r * S))
    W.save(out)

# Real-ESRGAN (SRVGGNetCompact, realesr-general-x4v3) w czystym numpy, bez PyTorch.
# Wczytanie wag BEZ wykonywania kodu z pliku: czytnik pickle z biala lista (tylko slownik i tensory float32);
# kazda inna klasa -> blad. Bezszwowosc tekstur: zawijanie brzegow przed powiekszeniem.
import zipfile, pickle, collections, numpy as np, sys, time
from PIL import Image

class _Storage:
    pass

def load(path):
    z = zipfile.ZipFile(path)
    pre = z.namelist()[0].split('/')[0]
    def rebuild(st, off, size, stride, *rest):
        size = tuple(size); stride = tuple(stride)
        n = int(np.prod(size)) if size else 1
        a = st[off:]
        if not size:
            return a[:1].copy()
        return np.lib.stride_tricks.as_strided(a, shape=size, strides=[s * 4 for s in stride]).copy()
    ALLOWED = {('collections', 'OrderedDict'): collections.OrderedDict,
               ('torch._utils', '_rebuild_tensor_v2'): rebuild,
               ('torch', 'FloatStorage'): _Storage}
    class U(pickle.Unpickler):
        def find_class(self, mod, name):
            if (mod, name) in ALLOWED:
                return ALLOWED[(mod, name)]
            raise pickle.UnpicklingError('niedozwolona klasa w pliku wag: %s.%s' % (mod, name))
        def persistent_load(self, pid):
            if not (isinstance(pid, tuple) and pid[0] == 'storage' and pid[1] is _Storage):
                raise pickle.UnpicklingError('niedozwolony typ danych w pliku wag')
            key = str(pid[2])
            if not key.isdigit():
                raise pickle.UnpicklingError('zly klucz danych')
            return np.frombuffer(z.read(pre + '/data/' + key), dtype='<f4')
    d = U(z.open(pre + '/data.pkl')).load()
    d = d.get('params', d)
    return {k: np.ascontiguousarray(v, dtype=np.float32) for k, v in d.items()}

def conv(x, w, b):
    C, H, W = x.shape; O = w.shape[0]
    xp = np.pad(x, ((0, 0), (1, 1), (1, 1)))
    s = xp.strides
    win = np.lib.stride_tricks.as_strided(xp, shape=(C, 3, 3, H, W), strides=(s[0], s[1], s[2], s[1], s[2]))
    return (w.reshape(O, -1) @ win.reshape(C * 9, H * W)).reshape(O, H, W) + b[:, None, None]

def net(P, x):
    i = 0; h = x
    while True:
        h = conv(h, P['body.%d.weight' % i], P['body.%d.bias' % i]); i += 1
        k = 'body.%d.weight' % i
        if k in P and P[k].ndim == 1:
            a = P[k]; h = np.where(h > 0, h, h * a[:, None, None]); i += 1
        else:
            break
    C, H, W = h.shape; r = 4
    h = h.reshape(3, r, r, H, W).transpose(0, 3, 1, 4, 2).reshape(3, H * r, W * r)
    return h + np.repeat(np.repeat(x, 4, 1), 4, 2)

def upscale(img, P, tile=192, m=40):
    a = np.asarray(img.convert('RGB'), dtype=np.float32).transpose(2, 0, 1) / 255.
    C, H, W = a.shape
    ap = np.pad(a, ((0, 0), (m, m), (m, m)), mode='wrap')
    out = np.zeros((3, H * 4, W * 4), np.float32)
    for y in range(0, H, tile):
        for x in range(0, W, tile):
            th, tw = min(tile, H - y), min(tile, W - x)
            t = np.ascontiguousarray(ap[:, y:y + th + 2 * m, x:x + tw + 2 * m])
            o = net(P, t)
            out[:, y * 4:(y + th) * 4, x * 4:(x + tw) * 4] = o[:, m * 4:(m + th) * 4, m * 4:(m + tw) * 4]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8).transpose(1, 2, 0))

if __name__ == '__main__':
    # uzycie: python3 -I esr.py WAGI.pth WEJSCIE OBRAZ_WYJSCIOWY [bok_wyniku_px]
    P = load(sys.argv[1])
    im = Image.open(sys.argv[2]); t = time.time()
    o = upscale(im, P)
    print('czas', round(time.time() - t, 1), 's', o.size)
    if len(sys.argv) > 4:
        n = int(sys.argv[4]); o = o.resize((n, n), Image.LANCZOS)
    o.save(sys.argv[3])

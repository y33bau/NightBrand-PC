import json,sys,time,os
sys.path.insert(0,'/home/claude/upscale-kod');import esr
from PIL import Image
d=json.load(open('/home/claude/upscale/mapa.json'));A='/home/claude/nightbrand/assets/';P=esr.load('/home/claude/upscale/wagi/realesr-general-wdn-x4v3.pth')
for k in sorted(d):
    if not k.startswith('cc0_'):continue
    o='/home/claude/upscale/out/'+k+'.png'
    if os.path.exists(o):continue
    im=Image.open(A+d[k]);mode=im.mode;t=time.time()
    if im.size[0]>1024:print(k,'pomijam',im.size,flush=True);continue
    r=esr.upscale(im.convert('RGB'),P).resize((im.size[0]*2,im.size[1]*2),Image.LANCZOS)
    if mode=='RGBA':r.putalpha(im.getchannel('A').resize(r.size,Image.LANCZOS))
    r.save(o);print(k,im.size,'->',r.size,round(time.time()-t),'s',flush=True)
print('KONIEC',flush=True)

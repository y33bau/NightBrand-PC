import json,os,subprocess,io,sys
from PIL import Image
U='/home/claude/upscale/';G='/home/claude/nightbrand';S='/home/claude/nightbrand-backup/zrodlo/main/';T='/home/claude/nightbrand-tools/'
SKIP={'cc0_water','cc0_lava','cc0_abyss'}
os.makedirs(U+'webp',exist_ok=True);hd={};tot=0
for f in sorted(os.listdir(U+'out')):
    k=f[:-4]
    if k in SKIP:continue
    im=Image.open(U+'out/'+f);p=U+'webp/'+k+'.webp';im.save(p,'WEBP',quality=86,method=6)
    url=subprocess.run([sys.executable,T+'wydaj.py','dodaj',G,p,'leniwy'],capture_output=True,text=True,check=True).stdout.strip()
    hd[k]=url;tot+=os.path.getsize(p);print(k,round(os.path.getsize(p)/1e6,2),'MB',flush=True)
mb=str(round(tot/1e6))
def rep(path,a,b):
    t=open(path,encoding='utf8').read();assert t.count(a)==1,(path,a);open(path,'w',encoding='utf8',newline='').write(t.replace(a,b))
rep(S+'09_audio_ustawienia_grafika.js','const HD_TEX={/*HD_TEX*/}','const HD_TEX='+json.dumps(hd,separators=(',',':')))
t=open(S+'01_start_jezyk.js',encoding='utf8').read();open(S+'01_start_jezyk.js','w',encoding='utf8',newline='').write(t.replace('@MB@',mb))
rep(G+'/index.html','(ok. @MB@ MB)','(ok. %s MB)'%mb)
print('RAZEM',len(hd),'tekstur',mb,'MB')

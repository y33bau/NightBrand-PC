"""NightBrand: przenosi zasoby z listy F (pobierane w tle przy pierwszej wizycie) do L (pobierane przy pierwszym uzyciu,
potem trzymane w cache). Uzycie: python3 leniwe.py KATALOG_GRY  (wybiera: grafiki tylko rozdz. II-V wg SPRITE_GROUPS
oraz muzyke c2-c5 wg AUDIO). Na koncu uruchom wydaj.py wersja."""
import sys,os,re,json
R=sys.argv[1].rstrip('/');A=R+'/assets/'
src=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','zrodlo','main','00_grupy_sprite.js')
g=json.loads(re.search(r'SPRITE_GROUPS\s*=\s*(\{.*\})',open(src).read(),re.S).group(1).rstrip(';'))
js={f:open(A+f,encoding='utf8',errors='ignore').read() for f in os.listdir(A) if f.endswith('.js')}
sd=next(t for t in js.values() if 'const SPRITE_DATA=' in t)
key={u:k for k,u in re.findall(r'"([A-Za-z0-9_]+)":"(assets/[0-9a-f]{64}\.\w+)"',sd)}
mus=set()
for t in js.values():
    for k,u in re.findall(r'"(c[2-5])":"(assets/[0-9a-f]{64}\.mp3)"',t):mus.add(u)
sw=open(R+'/sw.js',encoding='utf8').read()
mF=re.search(r'F=\[(.*?)\]',sw,re.S);F=re.findall(r'"([^"]+)"',mF.group(1))
mL=re.search(r'L=\[(.*?)\]',sw,re.S);L=re.findall(r'"([^"]+)"',mL.group(1))
mv=[u for u in F if u in mus or (u in key and g.get(key[u]) and all(x in('r2','r3','r4','r5') for x in g[key[u]]))]
F2=[u for u in F if u not in mv];L2=L+[u for u in mv if u not in L]
sw=sw[:mF.start(1)]+','.join('"%s"'%u for u in F2)+sw[mF.end(1):]
mL=re.search(r'L=\[(.*?)\]',sw,re.S);sw=sw[:mL.start(1)]+','.join('"%s"'%u for u in L2)+sw[mL.end(1):]
open(R+'/sw.js','w',encoding='utf8').write(sw)
sz=lambda l:round(sum(os.path.getsize(R+'/'+u) for u in l if os.path.exists(R+'/'+u))/1e6,1)
print('przeniesiono',len(mv),'plikow,',sz(mv),'MB; instalacja teraz',sz(F2),'MB (bylo',sz(F),'MB)')

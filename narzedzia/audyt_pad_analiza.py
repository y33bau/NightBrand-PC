import json
from PIL import Image,ImageChops
rec=json.load(open('/tmp/aud/rec.json'))
bad=[];ok=0;off=[]
for r in rec:
    if 'a' not in r: off.append((r['label'],r['txt']));continue
    a=Image.open(r['a']).convert('RGB');b=Image.open(r['b']).convert('RGB')
    d=ImageChops.difference(a,b).convert('L').point(lambda v:255 if v>24 else 0)
    ch=sum(1 for v in d.getdata() if v)/ (a.size[0]*a.size[1])
    r['ch']=ch
    if ch<0.02: bad.append((r['label'],r['txt'],round(ch*100,2),r['a']))
    else: ok+=1
print('OK',ok,'BRAK/SLABE',len(bad),'POZA EKRANEM',len(off))
for x in bad: print('  ',x)

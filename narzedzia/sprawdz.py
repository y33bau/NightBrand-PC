#!/usr/bin/env python3
"""NightBrand: kontrola spojnosci buildu. Uzycie: python3 sprawdz.py [katalog_gry]
Sprawdza: hash w nazwach plikow, manifest vs dysk, sw.js vs manifest, sieroty, limit rozmiaru, skladnie JS, pokrycie tlumaczen EN.
Kod wyjscia 1 = jest BLAD (nie publikowac)."""
import sys,os,re,json,hashlib,glob,subprocess
R=sys.argv[1] if len(sys.argv)>1 else '.'
A=R+'/assets/';err=[];warn=[];info=[]
def rd(p,m='r'):return open(p,m,**({'encoding':'utf8'} if m=='r' else {})).read()
man=json.load(open(A+'manifest.json',encoding='utf8'));files={os.path.basename(f['url']):f for f in man['files']}
disk={n for n in os.listdir(A) if n!='manifest.json'}
# 1) hash w nazwie = hash tresci (wyjatki: pliki o nazwie nie-hashowej)
for n in sorted(disk):
    stem=n.split('.')[0]
    if re.fullmatch(r'[0-9a-f]{64}',stem):
        h=hashlib.sha256(open(A+n,'rb').read()).hexdigest()
        if h!=stem:err.append('nazwa pliku != hash tresci: '+n)
    else:info.append('plik bez hasha w nazwie: '+n)
# 2) manifest vs dysk
for n,f in files.items():
    if n not in disk:err.append('w manifescie, brak na dysku: '+n);continue
    b=open(A+n,'rb').read()
    if len(b)!=f['bytes']:err.append('manifest: zly rozmiar '+n)
    if f.get('sha256') and f['sha256']!=hashlib.sha256(b).hexdigest():err.append('manifest: zly sha256 '+n)
for n in sorted(disk-set(files)):info.append('na dysku, poza manifestem: '+n)
for k in('styles','scripts'):
    for u in man[k]:
        if os.path.basename(u) not in disk:err.append('manifest.%s wskazuje brakujacy plik %s'%(k,u))
# 3) sw.js
sw=rd(R+'/sw.js');m=re.search(r"const C='(nightbrand-codex-\d{8}-\d+)'",sw)
if not m:err.append('sw.js: brak stalej cache C w formacie nightbrand-codex-RRRRMMDD-NNN')
else:info.append('cache: '+m.group(1))
swa=set(os.path.basename(x) for x in re.findall(r'assets/[^"\']+',sw))
for n in sorted(swa-disk-{'manifest.json'}):err.append('sw.js wymienia brakujacy plik: '+n)
for n in sorted(set(files)-swa):warn.append('plik w manifescie, ale nie w sw.js (nie bedzie offline): '+n)
for n in sorted(swa-set(files)):info.append('sw.js ma plik spoza manifestu: '+n)
for x in re.findall(r'"([^"/][^"]*\.(?:png|html|txt|webmanifest))"',sw[:sw.index('];')]):
    if not os.path.exists(R+'/'+x):err.append('sw.js wymienia brakujacy plik: '+x)
# 4) sieroty (plik zasobu nie wspomniany w zadnym kodzie)
code=rd(R+'/index.html')+sw
for n in disk:
    if n.endswith(('.js','.css')):code+=rd(A+n)
for n in sorted(files):
    if n.endswith(('.js','.css')):continue
    if n not in code and n.split('.')[0] not in code:warn.append('sierota (nikt nie wspomina): '+n)
# 5) rozmiar
tot=sum(f['bytes'] for f in files.values())/1e6
(err if tot>150 else warn if tot>120 else info).append('rozmiar zasobow: %.1f MB (limit 150, cel 100-120)'%tot)
# 6) skladnia JS
for n in sorted(disk):
    if n.endswith('.js'):
        r=subprocess.run(['node','--check',A+n],capture_output=True,text=True)
        if r.returncode:err.append('blad skladni '+n+': '+r.stderr.strip().split('\n')[0])
r=subprocess.run(['node','--check',R+'/sw.js'],capture_output=True,text=True)
if r.returncode:err.append('blad skladni sw.js')
# 7) tlumaczenia: teksty z index.html z polskimi znakami bez wpisu w I18N_DOM
try:
    main=[n for n in disk if n.endswith('.js') and 'I18N_DOM' in rd(A+n)][0];s=rd(A+main)
    i=s.index('const I18N_DOM=EN?{')+len('const I18N_DOM=EN?');d=0;j=i
    while True:
        c=s[j]
        if c=='"':
            j+=1
            while s[j]!='"':j+=2 if s[j]=='\\' else 1
        elif c=='{':d+=1
        elif c=='}':
            d-=1
            if d==0:break
        j+=1
    D=json.loads(s[i:j+1])
    h=re.sub(r'<script.*?</script>|<style.*?</style>','',rd(R+'/index.html'),flags=re.S)
    texts={re.sub(r'\s+',' ',t).strip() for t in re.findall(r'>([^<>]+)<',h)}
    miss=sorted(t for t in texts if re.search('[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]',t) and t not in D)
    (warn if miss else info).append('teksty PL w index.html bez wpisu EN: %d%s'%(len(miss),(' np. '+' | '.join(miss[:6])) if miss else ''))
except Exception as e:warn.append('pominieto kontrole tlumaczen: '+str(e)[:80])
for t,l in(('BLAD',err),('UWAGA',warn),('info',info)):
    for x in l:print('%-5s %s'%(t,x))
print('\nWYNIK:','BLAD (%d)'%len(err) if err else 'OK',' | uwagi: %d'%len(warn))
sys.exit(1 if err else 0)

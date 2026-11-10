import re,os,json,subprocess,sys
sys.argv=['x'];exec(open('wyciag.py').read().split("rows=[];bad=[]")[0])
def evalnode(expr,en=None):
    code='const EN=%s;const o=(%s);console.log(JSON.stringify(o))'%('true' if en else 'false',expr)
    open('/tmp/e.js','w').write(code)
    return json.loads(subprocess.check_output(['node','/tmp/e.js']))
def flat(o,path=''):
    if isinstance(o,str):yield path,o
    elif isinstance(o,list):
        for i,v in enumerate(o):yield from flat(v,f'{path}[{i}]')
    elif isinstance(o,dict):
        for k,v in o.items():yield from flat(v,f'{path}.{k}' if path else str(k))
def between(s,start):
    # return text of balanced literal starting at start (brace/bracket)
    d=0;k=start
    while True:
        c=s[k]
        if c in '\'"`':k=lit(s,k)[2];continue
        if c in '([{':d+=1
        elif c in ')]}':
            d-=1
            if d==0:return s[start:k+1],k+1
        k+=1
tables=[]  # (file,line,name,[(path,pl,en)])
def load(f):return open(f'{SRC}/{f}',encoding='utf8').read()
def line(s,pos):return s.count('\n',0,pos)+1
# 1) ternary data objects EN?{..}:{..}
for f,pat in [('15_etapy.js',r'EN\?\{krew'),('22_postac_zapis_ustawienia.js',r'EN\?\[\'\',\'Bronze'),('22_postac_zapis_ustawienia.js',r'const BEAST_D=EN\?\{'),('23_instrukcja_sterowanie.js',r'const N=EN\?\{up')]:
    s=load(f);m=re.search(pat,s)
    a=s.index('EN?',m.start())+3;ex1,k=between(s,a)
    if s[k]=='[':k=between(s,k)[1]
    assert s[k]==':',(f,pat)
    ex2,_=between(s,k+1)
    en=dict(flat(evalnode(ex1,1)));pl=dict(flat(evalnode(ex2,0)))
    name=re.search(r'(?:const |,)\s*([A-Z_]+)=EN\?$',s[max(0,m.start()-30):m.end()-1]) 
    tables.append((f,line(s,m.start()),name.group(1) if name else 'ftInfo/etykiety',[(p,pl.get(p,''),en.get(p,'')) for p in pl]))
# 2) parallel tables
def table(f,name,kind):
    s=load(f);m=re.search(r'const '+name+r'=',s);a=m.end()
    ex,_=between(s,a);o=evalnode(ex)
    rows=[]
    if kind=='fab':
        for k,(pl,en) in o.items():
            for i,(p,e) in enumerate(zip(pl,en)):rows.append((f'{k}#{i+1}',p,e))
            if len(pl)!=len(en):rows.append((f'{k}#UWAGA-rozna-liczba-akapitow','PL:%d'%len(pl),'EN:%d'%len(en)))
    elif kind=='who':
        for k,(p,e) in o.items():rows.append((k,p,e))
    elif kind=='bt':
        for k,v in o.items():rows.append((k+'.imie',v[0],v[2]));rows.append((k+'.przydomek',v[1],v[3]))
    elif kind=='nm':
        for ch,l in o.items():
            for r in l:rows.append((f'{ch}:{r[0]}.nazwa',r[1],r[2]));rows.append((f'{ch}:{r[0]}.opis',r[3],r[4]))
    tables.append((f,line(s,m.start()),name,rows))
table('20_fabula.js','FABULA_TXT','fab');table('20_fabula.js','BOSS_WHO','who');table('13_wrogowie.js','BOSS_TITLES','bt');table('13_wrogowie.js','NAMED','nm');table('15_etapy.js','NOTES','nm')
for t in tables:print(t[0],t[1],t[2],len(t[3]))
json.dump(tables,open('tables.json','w'),ensure_ascii=False)

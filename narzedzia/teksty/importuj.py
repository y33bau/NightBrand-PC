import json,re,sys
exec(open('wyciag_p.py').read().split("rows=[];bad=[]")[0])
SRC='/home/claude/nightbrand-backup/zrodlo/main'
M=json.load(open('map.json'));C=json.load(open('changes.json'))
def split_tpl(v):
    # -> list of (kind,text): 'T' text, 'X' raw ${...}
    out=[];i=0;buf=''
    while i<len(v):
        if v.startswith('${',i):
            d=1;k=i+2
            while k<len(v) and d:
                c=v[k]
                if c in '\'"`':
                    r=lit(v,k)
                    if r: k=r[2];continue
                d+=(c=='{')-(c=='}');k+=1
            if buf:out.append(('T',buf));buf=''
            out.append(('X',v[i:k]));i=k;continue
        buf+=v[i];i+=1
    if buf:out.append(('T',buf))
    return out
def dec(txt,q):
    if q=='`':return ''.join(t.replace('\\n','\n') if k=='T' else t for k,t in split_tpl(txt))
    return txt.replace('\\n','\n')
def enc(v,q):
    def esc(t):
        t=t.replace('\\','\\\\').replace(q,'\\'+q).replace('\n','\\n').replace('\r','\\r')
        return t
    if q=='`':return '`'+''.join(esc(t).replace('${','\\${') if k=='T' else t for k,t in split_tpl(v))+'`'
    return q+esc(v)+q
def region(s,pat):
    m=re.search(pat,s);assert m,pat
    a=m.end()
    # find first bracket after
    while s[a] not in '{[':a+=1
    d=0;k=a
    while True:
        c=s[k]
        if c in '\'"`':k=lit(s,k)[2];continue
        if c in '([{':d+=1
        elif c in ')]}':
            d-=1
            if d==0:break
        k+=1
    # for ternary EN?{..}:{..} include alternative too
    e=k+1
    if s[e]==':' :
        a2=e+1
        while s[a2] not in '{[':a2+=1
        d=0;k=a2
        while True:
            c=s[k]
            if c in '\'"`':k=lit(s,k)[2];continue
            if c in '([{':d+=1
            elif c in ')]}':
                d-=1
                if d==0:break
            k+=1
        e=k+1
    lits=[];k=m.start()
    while k<e:
        c=s[k]
        if c in '\'"`':
            r=lit(s,k);lits.append((r[0],k,r[2]));k=r[2];continue
        k+=1
    return lits
TABS={'FABULA_TXT':('20_fabula.js',r'const FABULA_TXT='),'BOSS_WHO':('20_fabula.js',r'const BOSS_WHO='),
 'BOSS_TITLES':('13_wrogowie.js',r'const BOSS_TITLES='),'NAMED':('13_wrogowie.js',r'const NAMED='),
 'NOTES':('15_etapy.js',r'const NOTES='),'BEAST_D':('22_postac_zapis_ustawienia.js',r'const BEAST_D=EN\?'),
 'I18N_DOM':('01_start_jezyk.js',r'const I18N_DOM=EN\?')}
FT=[('15_etapy.js',r'EN\?\{krew'),('22_postac_zapis_ustawienia.js',r"EN\?\['','Bronze"),('23_instrukcja_sterowanie.js',r'const N=EN\?\{up')]
src={}
def S(f):
    if f not in src:src[f]=open(f'{SRC}/{f}',encoding='utf8').read()
    return src[f]
edits={}  # f -> list (a,b,new)
problems=[];dom_pl=[]
for i,(o,n) in C.items():
    r=M[i]
    for si,side in ((0,'pl'),(1,'en')):
        if o[si]==n[si]:continue
        if r is not None:
            key='pa' if (side=='en')!=bool(r.get('T')) else 'pb'
            (a,b),=r[key];f=r['f'];s=S(f);q=s[a]
            old=lit(s,a)[0]
            if old!=dec(o[si],q):problems.append((i,side,'old-mismatch'));continue
            edits.setdefault(f,[]).append((a,b,enc(dec(n[si],q),q),i))
            continue
        tn=i.split(':')[0].split('#')[0]
        if tn=='ftInfo/etykiety':cands_src=[(f,region(S(f),p)) for f,p in FT]
        else:f,p=TABS[tn];cands_src=[(f,region(S(f),p))]
        oldv=o[si].replace('\\n','\n')
        cand=[(f,a,b) for f,L in cands_src for v,a,b in L if v==oldv]
        if tn=='I18N_DOM':
            # keys are PL, values EN: pick by position (key followed by ':')
            f,L=cands_src[0];s=S(f)
            if side=='pl':cand=[(f,a,b) for f,a,b in cand if s[b]==':']
            else:cand=[(f,a,b) for f,a,b in cand if s[a-1]==':']
            if side=='pl':dom_pl.append((o[0],n[0]))
        if len(cand)!=1:problems.append((i,side,'cands=%d'%len(cand),oldv[:60]));continue
        f,a,b=cand[0];q=S(f)[a]
        edits.setdefault(f,[]).append((a,b,enc(n[si].replace('\\n','\n'),q),i))
print('problems',len(problems));[print(' ',p) for p in problems]
print('edits',sum(len(v) for v in edits.values()))
json.dump(dict(problems=problems,dom_pl=dom_pl),open('imp_report.json','w'),ensure_ascii=False,indent=1)
if '--zapisz' in sys.argv and not problems:
    for f,L in edits.items():
        L.sort(key=lambda x:-x[0])
        for x,y in zip(L,L[1:]):assert y[1]<=x[0],('overlap',f,x[3],y[3])
        s=S(f)
        for a,b,new,_ in L:s=s[:a]+new+s[b:]
        open(f'{SRC}/{f}','w',encoding='utf8').write(s)
    print('zapisano',list(edits))

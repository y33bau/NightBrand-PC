import re,os,sys,json,subprocess
SRC='/home/claude/nightbrand-backup/zrodlo/main'
def lit(s,i):
    # parse a JS string/template literal starting at s[i]; return (value,raw,end) or None
    q=s[i]
    if q not in '\'"`':return None
    j=i+1;out=[]
    while j<len(s):
        c=s[j]
        if c=='\\':
            n=s[j+1]
            m={'n':'\n','t':'\t','\\':'\\',"'":"'",'"':'"','`':'`','$':'$'}
            if n=='u':out.append(chr(int(s[j+2:j+6],16)));j+=6;continue
            if n=='x':out.append(chr(int(s[j+2:j+4],16)));j+=4;continue
            out.append(m.get(n,n));j+=2;continue
        if c==q:return ''.join(out),s[i:j+1],j+1
        if q=='`' and c=='$' and s[j+1]=='{':
            d=1;k=j+2
            while k<len(s) and d:
                d+= (s[k]=='{')-(s[k]=='}');k+=1
            out.append(s[j:k]);j=k;continue
        out.append(c);j+=1
    return None
def operand(s,i):
    vals=[];k=i
    while True:
        while s[k]==' ':k+=1
        if s[k]=='(':  # parenthesised literal expression
            r=operand(s,k+1)
            if r and s[r[1]:r[1]+1]==')':vals.append(r[0]);k=r[1]+1
            else:return None
        else:
            r=lit(s,k)
            if not r:return None
            vals.append(r[0]);k=r[2]
        while s[k]==' ':k+=1
        if s[k]=='+':k+=1;continue
        return ''.join(vals),k

def skip_str(s,k):
    r=lit(s,k);return r[2]
def scan(s,i,stop_colon):
    """scan expression from i until top-level ':' (if stop_colon) or a terminator; returns (parts,end)"""
    d=0;k=i;parts=[];cur=''  # cur: text of non-literal expression being accumulated
    q=0
    while k<len(s):
        c=s[k]
        if c in '\'"`':
            r=lit(s,k);parts.append(('L',r[0]));k=r[2];continue
        if c in '([{':pass
        elif c in ')]}':
            if d==0:break
            d-=1
        elif c=='?' and d==0 and not s.startswith('?.',k):q+=1
        elif c==':' and d==0:
            if q:q-=1
            elif stop_colon:break
        elif (c in ',;') and d==0:break
        elif c=='+' and d==0:
            parts.append(('+',''));k+=1;continue
        elif c==' ' and d==0:k+=1;continue
        # expression char
        j=k
        while j<len(s):
            cj=s[j]
            if cj in '\'"`' :break
            if cj in '([{':
                dd=1;j+=1
                while j<len(s) and dd:
                    if s[j] in '\'"`':j=skip_str(s,j);continue
                    dd+=(s[j] in '([{')-(s[j] in ')]}');j+=1
                continue
            if cj in ')]},;+ ' :break
            if cj==':' or cj=='?':break
            j+=1
        if j==k:j=k+1
        parts.append(('E',s[k:j]));k=j
    return parts,k
def render(parts):
    out=[];ex=0
    for t,v in parts:
        if t=='L':out.append(v)
        elif t=='E':out.append('{{'+v+'}}');ex+=1
    return ''.join(out),ex
rows=[];bad=[]
for f in sorted(os.listdir(SRC)):
    if not f.endswith('.js'):continue
    s=open(f'{SRC}/{f}',encoding='utf8').read()
    for m in re.finditer(r'(?<![\w$.])EN\?',s):
        ln=s.count('\n',0,m.start())+1
        try:
            p1,k=scan(s,m.end(),True)
            if k>=len(s) or s[k]!=':':bad.append((f,ln,s[m.start():m.start()+90]));continue
            p2,k2=scan(s,k+1,False)
        except Exception as e:
            bad.append((f,ln,s[m.start():m.start()+90]));continue
        en,e1=render(p1);pl,e2=render(p2)
        if not en and not pl:bad.append((f,ln,s[m.start():m.start()+90]));continue
        if not any(t=='L' for t,v in p1) or not any(t=='L' for t,v in p2):bad.append((f,ln,s[m.start():m.start()+90]));continue
        ctx=re.search(r'([A-Za-z_]\w*|\d+)\s*:\s*[\[\(]*$',s[max(0,m.start()-60):m.start()])
        c2=re.findall(r'(?:const|let|var)\s+([A-Z_][A-Z0-9_]*)\s*=',s[max(0,m.start()-4000):m.start()])
        rows.append(dict(f=f,l=ln,ctx=(ctx.group(1) if ctx else ''),blk=(c2[-1] if c2 else ''),en=en,pl=pl,ex=e1+e2))
# I18N_DOM
js=open(f'{SRC}/01_start_jezyk.js',encoding='utf8').read()
m=re.search(r'const I18N_DOM=EN\?',js);a=m.end()
depth=0;k=a
while True:
    if js[k]=='{':depth+=1
    elif js[k]=='}':
        depth-=1
        if depth==0:break
    elif js[k] in '"\'`':
        r=lit(js,k);k=r[2]-1
    k+=1
obj=js[a:k+1]
open('/tmp/dom.js','w').write('console.log(JSON.stringify('+obj+'))')
dom=json.loads(subprocess.check_output(['node','/tmp/dom.js']))
json.dump(dict(rows=rows,dom=dom,bad=bad),open('/home/claude/out/wyciag.json','w'),ensure_ascii=False)
print(len(rows),len(dom),len(bad),bad[:20])

# copy game, patch main JS (tag canvases in procFrame + window.__t hook), fix hashes in manifest/sw/index
import sys,os,shutil,hashlib,json,re
src,dst=sys.argv[1],sys.argv[2]
if os.path.exists(dst): shutil.rmtree(dst)
shutil.copytree(src,dst,ignore=shutil.ignore_patterns('.git'))
A=dst+'/assets'
main=[f for f in os.listdir(A) if f.endswith('.js') and '============ WORLDS' in open(A+'/'+f,errors='ignore').read()][0]
s=open(A+'/'+main).read()
a="function procFrame(img,x,y,size,h,kind,lift=0){"
assert s.count(a)==1; s=s.replace(a,a+"window.__curKey=(img&&img.nbKey)||'?';")
b="requestAnimationFrame(frame);\n})();"
if b in s: s=s.replace(b,"window.__t=s=>eval(s);"+b)
h=hashlib.sha256(s.encode()).hexdigest(); new=h+'.js'
os.remove(A+'/'+main); open(A+'/'+new,'w').write(s)
oh=main[:-3]
for f in [A+'/manifest.json',dst+'/sw.js',dst+'/index.html']+[A+'/'+x for x in os.listdir(A) if x.endswith('.js')]:
  t=open(f,errors='ignore').read()
  if oh in t: open(f,'w').write(t.replace(oh,h))
m=json.load(open(A+'/manifest.json'))
for e in m['files']:
  if e['sha256']==h: e['bytes']=len(s.encode())
json.dump(m,open(A+'/manifest.json','w'))
print('patched',main,'->',new)

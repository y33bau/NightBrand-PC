from parse import parse
import collections
B='/home/claude/nightbrand-backup/teksty/'
o,oo=parse(B+'NIGHTBRAND_teksty_PL_EN_561_oryginal.txt');r,ro=parse(B+'NIGHTBRAND_teksty_PL_EN_redakcja.txt')
print(len(o),len(r),oo==ro)
ch=[k for k in oo if o[k]!=r[k]]
print(len(ch))
c=collections.Counter(k.split(':')[0].split('#')[0] for k in ch);print(c)
import json;json.dump({k:[o[k],r[k]] for k in ch},open('changes.json','w'),ensure_ascii=False,indent=0)
# entries with code
print([k for k in ch if '{{' in o[k][0]+o[k][1]+r[k][0]+r[k][1]])
print([k for k in ch if '${' in o[k][0]+o[k][1]+r[k][0]+r[k][1]])

import re
def parse(p):
    L=open(p,encoding='utf8').read().split('\n');d={};order=[]
    i=0
    while i<len(L):
        m=re.match(r'^\[(.+?)\](  \(.*\))?$',L[i])
        if m and i+2<len(L) and L[i+1].startswith('PL: ') and L[i+2].startswith('EN: '):
            k=m.group(1);assert k not in d,k
            d[k]=(L[i+1][4:],L[i+2][4:]);order.append(k);i+=3;continue
        i+=1
    return d,order

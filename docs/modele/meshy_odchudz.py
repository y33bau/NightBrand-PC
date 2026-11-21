# NightBrand: odchudzanie modeli z Meshy do gry.
# Wejscie: .glb z Meshy (1 siatka, POSITION/NORMAL/TEXCOORD_0, tekstury 4K: kolor, metal/szorstkosc, normalna).
# Wyjscie: NAZWA.glb (sama geometria: pozycje, normalne, UV, indeksy; Y w gore, spod na 0, srodek w x/z = 0)
#          NAZWA_k.webp (kolor 1024) i NAZWA_n.webp (mapa normalnych 1024).
# Uzycie: python3 meshy_odchudz.py WEJSCIE.glb KATALOG_WYJSCIA NAZWA
import os,sys,json,struct,io,os
import numpy as np
from PIL import Image
src,out,name=sys.argv[1:4];os.makedirs(out,exist_ok=True)
b=open(src,'rb').read();assert b[:4]==b'glTF'
o=12;J=None;B=None
while o<len(b):
    l,t=struct.unpack('<II',b[o:o+8])
    if t==0x4E4F534A:J=json.loads(b[o+8:o+8+l])
    elif t==0x004E4942:B=b[o+8:o+8+l]
    o+=8+l
CT={5126:np.float32,5125:np.uint32,5123:np.uint16,5121:np.uint8};N={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def acc(i):
    a=J['accessors'][i];v=J['bufferViews'][a['bufferView']];dt=np.dtype(CT[a['componentType']]);n=N[a['type']]
    off=v.get('byteOffset',0)+a.get('byteOffset',0);st=v.get('byteStride',dt.itemsize*n)
    raw=np.frombuffer(B,dtype=np.uint8,count=st*(a['count']-1)+dt.itemsize*n,offset=off)
    arr=np.lib.stride_tricks.as_strided(raw,shape=(a['count'],dt.itemsize*n),strides=(st,1)).copy().view(dt).reshape(a['count'],n)
    return arr
pr=J['meshes'][0]['primitives'][0];A=pr['attributes']
P=acc(A['POSITION']).astype(np.float32);Nn=acc(A['NORMAL']).astype(np.float32);UV=acc(A['TEXCOORD_0']).astype(np.float32)
I=acc(pr['indices']).reshape(-1).astype(np.uint32)
# transformacja wezla (jesli jest)
nd=[n for n in J['nodes'] if 'mesh' in n][0]
if 'matrix' in nd:
    M=np.array(nd['matrix'],dtype=np.float64).reshape(4,4).T
    P=(np.c_[P,np.ones(len(P))]@M.T)[:,:3].astype(np.float32);R=M[:3,:3];Nn=(Nn@R.T);Nn/=np.linalg.norm(Nn,axis=1,keepdims=True)+1e-9
else:
    if 'scale' in nd:P=P*np.array(nd['scale'],dtype=np.float32)
    if 'rotation' in nd:
        x,y,z,w=nd['rotation'];R=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]],dtype=np.float32)
        P=P@R.T;Nn=Nn@R.T
    if 'translation' in nd:P=P+np.array(nd['translation'],dtype=np.float32)
# spod na 0, srodek x/z na 0
mn,mx=P.min(0),P.max(0);P[:,0]-=(mn[0]+mx[0])/2;P[:,2]-=(mn[2]+mx[2])/2;P[:,1]-=mn[1]
# tekstury
mat=J['materials'][pr.get('material',0)]
def img(texinfo,size,fn,q):
    if not texinfo:return None
    im=J['images'][J['textures'][texinfo['index']]['source']];v=J['bufferViews'][im['bufferView']]
    data=B[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];pic=Image.open(io.BytesIO(data)).convert('RGB').resize((size,size),Image.LANCZOS)
    pic.save(os.path.join(out,fn),quality=q,method=6);return fn
k=img(mat.get('pbrMetallicRoughness',{}).get('baseColorTexture'),int(os.environ.get('NB_TEX','1024')),name+'_k.webp',86)
n=img(mat.get('normalTexture'),1024,name+'_n.webp',88)
# zapis glb (sama geometria)
blob=b'';views=[];accs=[]
def add(arr,target,typ,ctype,minmax=False):
    global blob
    while len(blob)%4:blob+=b'\0'
    data=arr.tobytes();views.append({'buffer':0,'byteOffset':len(blob),'byteLength':len(data),'target':target});blob+=data
    a={'bufferView':len(views)-1,'componentType':ctype,'count':int(arr.shape[0]),'type':typ}
    if minmax:a['min']=arr.min(0).tolist();a['max']=arr.max(0).tolist()
    accs.append(a);return len(accs)-1
ip=add(P,34962,'VEC3',5126,True);inn=add(Nn.astype(np.float32),34962,'VEC3',5126);iu=add(UV,34962,'VEC2',5126)
ii=add(I.astype(np.uint32 if len(P)>65535 else np.uint16).reshape(-1,1),34963,'SCALAR',5125 if len(P)>65535 else 5123)
while len(blob)%4:blob+=b'\0'
G={'asset':{'version':'2.0','generator':'NightBrand meshy_odchudz'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],
 'meshes':[{'primitives':[{'attributes':{'POSITION':ip,'NORMAL':inn,'TEXCOORD_0':iu},'indices':ii}]}],'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accs}
js=json.dumps(G,separators=(',',':')).encode();js+=b' '*((4-len(js)%4)%4)
glb=b'glTF'+struct.pack('<II',2,12+8+len(js)+8+len(blob))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(blob),0x004E4942)+blob
open(os.path.join(out,name+'.glb'),'wb').write(glb)
ext=P.max(0)-P.min(0)
print(json.dumps({'nazwa':name,'tris':len(I)//3,'verts':len(P),'rozmiar_xyz':[round(float(x),3) for x in ext],'glb':len(glb),'kolor':k,'normalna':n}))

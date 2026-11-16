"""NightBrand: szlif gotowych atlasow bohaterow (16.11.2026), bez nowych rysunkow.
Uzycie: python3 szlif.py KATALOG_GRY KATALOG_WYJSCIA   -> pliki webp + lista.json dla narzedzia/podmien_obrazy.py + kontrola_szlif.png
Co robi z kazdym atlasem klasy (alfa bez zmian, twarda 0/255):
 - wyrazistosc: kontrast detali w duzym promieniu + wyostrzenie drobne (rozmycie liczone tylko z pikseli postaci, bez ciemnej obwodki od tla),
 - jasnosc: gamma dobrana tak, by srednia jasnosc arkusza spoczynku klasy trafila w CEL (moby maja ok. 60-80),
 - kolor: nasycenie klasy; Zabojczyni dodatkowo rozdzielenie czerwieni, metalu i skory.
Ustawienia klas w KLASY. Uruchamiac RAZ na swiezych atlasach z fabryki (drugie uruchomienie przeostrzy)."""
import sys,os,re,json,glob
import numpy as np
from PIL import Image,ImageFilter

KLASY={  # cel = srednia jasnosc, det = kontrast detali, ostr = wyostrzenie, nas = nasycenie
 'knight':dict(cel=76,det=.62,ostr=.75,nas=1.08),
 'zab':   dict(cel=80,det=.70,ostr=.80,nas=1.06,rozdziel=1),
 'kat':   dict(cel=76,det=.55,ostr=.70,nas=1.10),
 'dzw':   dict(cel=76,det=.55,ostr=.70,nas=1.05),
 'mil':   dict(cel=78,det=.55,ostr=.70,nas=1.05),
}
POMIN={'kat_fx','mil_fx'}  # arkusze efektow, nie postaci
LUM=np.array([.299,.587,.114])

def rozmycie(rgb,a,r):
    """rozmycie liczone tylko z pikseli postaci (wazone alfa)"""
    blur=lambda x:np.asarray(Image.fromarray((np.clip(x,0,1)*255+.5).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)),dtype=np.float32)/255
    ba=np.maximum(blur(a),1/255)
    return np.clip(blur(rgb*a[...,None])/ba[...,None],0,1)

def wyrazistosc(rgb,a,k):
    out=rgb+k['det']*(rgb-rozmycie(rgb,a,6))
    out=out+k['ostr']*(out-rozmycie(out,a,1.1))
    return np.clip(out,0,1)

def kolor(rgb,k,gamma):
    rgb=np.power(np.clip(rgb,0,1),gamma)
    l=(rgb@LUM)[...,None];mx=rgb.max(-1,keepdims=True);mn=rgb.min(-1,keepdims=True);sat=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-4),0)
    nas=np.full_like(l,k['nas'])
    if k.get('rozdziel'):
        R,G,B=rgb[...,0:1],rgb[...,1:2],rgb[...,2:3]
        czerw=(R>G*1.55)&(R>B*1.55)&(R>.22)               # szal, wstazki
        metal=(sat<.30)&(l>.16)                           # ostrza, okucia
        nas=np.where(czerw,k['nas']*1.25,nas)
        rgb=np.where(czerw,rgb*1.12,rgb)
        rgb=np.where(metal,(l+(rgb-l)*.6)*np.array([1.06,1.10,1.17]),rgb)   # chlodniejsza, jasniejsza stal
        nas=np.where(metal,1.0,nas)
        l=(rgb@LUM)[...,None]
    rgb=l+(rgb-l)*nas
    return np.clip((rgb-.015)*1.05,0,1)

def przerob(im,k,gamma):
    p=np.asarray(im.convert('RGBA'),dtype=np.float32)/255;a=(p[...,3]>.5).astype(np.float32)
    rgb=kolor(wyrazistosc(p[...,:3],a,k),k,gamma)*a[...,None]
    return Image.fromarray((np.dstack([rgb,a])*255+.5).astype(np.uint8),'RGBA')

def jasnosc(im):
    p=np.asarray(im.convert('RGBA'),dtype=np.float32);m=p[...,3]>127
    return float((p[...,:3][m]@LUM).mean())

def main():
    gra,out=sys.argv[1].rstrip('/'),sys.argv[2];os.makedirs(out,exist_ok=True)
    mapa={}
    for f in glob.glob(gra+'/assets/*.js')+[gra+'/index.html']:
        for key,url in re.findall(r'"((?:knight|zab|kat|dzw|mil)_[a-z0-9_]+)":"(assets/[a-z]+/[0-9a-f]{64}\.webp)"',open(f,encoding='utf8',errors='ignore').read()):
            if key not in POMIN:mapa[key]=url
    lista=[];kontrola=[]
    for pre,k in KLASY.items():
        klucze=sorted(x for x in mapa if x.startswith(pre+'_'))
        if pre+'_d' not in mapa:print('BRAK',pre);continue
        wz=Image.open(gra+'/'+mapa[pre+'_d'])
        lo,hi=.4,1.2   # gamma dobierana polowieniem na arkuszu spoczynku
        for _ in range(12):
            g=(lo+hi)/2
            if jasnosc(przerob(wz,k,g))>k['cel']:lo=g
            else:hi=g
        print(pre,'gamma %.3f'%g,'jasnosc %.0f -> %.0f'%(jasnosc(wz),jasnosc(przerob(wz,k,g))),len(klucze),'arkuszy')
        for key in klucze:
            src=Image.open(gra+'/'+mapa[key]);nowy=przerob(src,k,g);dst=out+'/'+key+'.webp'
            nowy.save(dst,'WEBP',quality=90,method=6,alpha_quality=100,exact=False)
            lista.append({'f':mapa[key],'src':dst})
            if key==pre+'_d':kontrola.append((src.convert('RGBA').crop((0,0,256,256)),Image.open(dst).convert('RGBA').crop((0,0,256,256))))
    json.dump(lista,open(out+'/lista.json','w'),indent=0)
    W=Image.new('RGBA',(512*len(kontrola),256),(46,50,44,255))
    for i,(a,b) in enumerate(kontrola):W.alpha_composite(a,(i*512,0));W.alpha_composite(b,(i*512+256,0))
    W.convert('RGB').save(out+'/kontrola_szlif.png');print(len(lista),'plikow')
if __name__=="__main__":main()

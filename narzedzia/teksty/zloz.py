import json,re,sys,os
sys.argv=['x'];exec(open('wyciag.py').read().split("rows=[];bad=[]")[0])
d=json.load(open('wyciag.json'));tables=json.load(open('tables.json'))
rows=d['rows'];dom=d['dom']
# T() calls
for f in ('11_dwoch_graczy_gracz.js','26_start_petla.js'):
    s=open(f'{SRC}/{f}',encoding='utf8').read()
    for m in re.finditer(r'(?<![\w$.])T\(',s):
        try:
            p1,k=scan(s,m.end(),True)
            if s[k]!=':' and s[k]!=',':
                pass
            # args separated by ',' : scan stops at ',' (terminator)
            if s[k]!=',':continue
            p2,k2=scan(s,k+1,False)
        except Exception:continue
        if s[k2]!=')':continue
        a,e1=render(p1);b,e2=render(p2)
        if not any(t=='L' for t,v in p1) or not any(t=='L' for t,v in p2):continue
        rows.append(dict(f=f,l=s.count('\n',0,m.start())+1,ctx='',blk='',pl=a,en=b,ex=e1+e2))
rows.append(dict(f='22_postac_zapis_ustawienia.js',l=93,ctx='gaze',blk='',pl='darmowy przerzut / darmowe przerzuty',en='free reroll / free rerolls',ex=0))
TITLES={'01_start_jezyk.js':'Start i wybór języka','02_swiaty.js':'Światy','07_swiatla_uklad_map.js':'Układ map','09_audio_ustawienia_grafika.js':'Audio, ustawienia, grafika','10_stan_gry.js':'Stan gry, komunikaty','11_dwoch_graczy_gracz.js':'Gracz, nazwy wrogów, przyczyny śmierci','12_walka.js':'Walka, komunikaty, karty','13_wrogowie.js':'Wrogowie, bossowie, elity','14_umiejetnosci.js':'Umiejętności i ich opisy','15_etapy.js':'Etapy nocy, zdarzenia, notatki','16_krypta.js':'Krypta','17_render.js':'Render','19_hud.js':'HUD','20_fabula.js':'FABUŁA (intra, wstępy aktów, dialogi, kwestie bossów)','21_muzyka.js':'Muzyka','22_postac_zapis_ustawienia.js':'Postać, menu, bestiariusz, wyzwania, ulepszenia, zakończenia','23_instrukcja_sterowanie.js':'Instrukcja i sterowanie','24_pad_samouczek_bledy.js':'Pad, samouczek, błędy','25_grafika_wydajnosc.js':'Grafika i wydajność','26_start_petla.js':'Ekran startowy, HUD, menu pauzy, opcje','03_three_teren.js':'Teren'}
out=[]
w=out.append
w('NIGHTBRAND / PIĘTNO NOCY — WSZYSTKIE TEKSTY GRY (PL + EN)')
w('Wersja gry 561, wyciąg z 10.11.2026.\n')
w('JAK CZYTAĆ I REDAGOWAĆ')
w('• Każdy wpis to: [ID], potem linia PL: i linia EN:. Redagujesz tekst po „PL:” i „EN:”. NIE ruszaj ID w nawiasach kwadratowych.')
w('• ID = plik źródłowy:numer wiersza#numer na wierszu, np. [20_fabula.js:5#1]. Dzięki temu poprawki da się wgrać z powrotem do gry.')
w('• Znaczniki {{...}} (np. {{nd.n}}, {{NAMED_ASH}}) oraz ${...} to wstawki z kodu (imię, liczba, czas). Zostaw je dokładnie tak, jak są, w sensownym miejscu zdania.')
w('• \\n w tekście = nowa linia. Znaki HTML (<b>, <br>) zostają.')
w('• Teksty w grze to Polski (PL) i angielski (EN); część wpisów jest tylko w jednym zdaniu, część to akapity. Kolejność w sekcji fabuły = kolejność wyświetlania.')
w('• Nazwy angielskie powinny trzymać się słownika SLOWNIK_EN.md (np. Pani Lasu = The Lady of the Forest).\n')
w('SPIS TREŚCI')
sec=['A. FABUŁA: wstępy, akty, kwestie bossów, notatki, elity z imieniem','B. TEKSTY W KODZIE (komunikaty, karty, umiejętności, menu, bestiariusz…) wg plików','C. NAPISY INTERFEJSU z index.html (przyciski, menu, etykiety)']
for x in sec:w('  '+x)
w('')
# A
w('='*90);w('A. FABUŁA');w('='*90)
def entry(id,pl,en,note=''):
    w(f'[{id}]'+(f'  ({note})' if note else ''));w('PL: '+pl.replace('\n','\\n'));w('EN: '+en.replace('\n','\\n'));w('')
# STORY_INTRO: group by ctx
fab=[r for r in rows if r['f']=='20_fabula.js']
n=0;last=None
lastc=''
for r in fab:
    if r['ctx']:lastc=r['ctx']
    elif r['blk']!='STORY_INTRO':lastc=''
    r['ctx']=r['ctx'] or lastc
    key=(r['blk'],r['ctx'])
    if key!=last:
        w('-'*70);w(f"## {r['blk'] or 'FABUŁA'} / {r['ctx'] or '—'}");w('-'*70);last=key
    n+=1;entry(f"{r['f']}:{r['l']}#{n}",r['pl'],r['en'])
for t in tables:
    if t[0] in('20_fabula.js',) or t[2] in ('NAMED','NOTES'):
        pass
w('-'*70);w('## Teksty fabularne z tabel (FABULA_TXT: kolejne akapity każdego aktu i innych scen)');w('-'*70)
for t in tables:
    if t[2]=='FABULA_TXT':
        for p,pl,en in t[3]:entry('FABULA_TXT:'+p,pl,en)
for name,title in (('BOSS_WHO','Kto mówi (imiona bossów w kwestiach)'),('BOSS_TITLES','Plansze wejścia bossów (imię + przydomek)'),('NAMED','Elity z imieniem (nazwa + opis do bestiariusza)'),('NOTES','Notatki znajdowane w grze')):
    w('-'*70);w('## '+title);w('-'*70)
    for t in tables:
        if t[2]==name:
            for p,pl,en in t[3]:entry(f'{name}:{p}',pl,en)
# B
w('='*90);w('B. TEKSTY W KODZIE (wg plików)');w('='*90)
from collections import OrderedDict
byf=OrderedDict()
for r in sorted(rows,key=lambda r:(r['f'],r['l'])):
    if r['f']=='20_fabula.js':continue
    byf.setdefault(r['f'],[]).append(r)
for f,rs in byf.items():
    w('-'*70);w(f'## {f} — {TITLES.get(f,f)}');w('-'*70)
    cnt={}
    for r in rs:
        cnt[r['l']]=cnt.get(r['l'],0)+1
        entry(f"{f}:{r['l']}#{cnt[r['l']]}",r['pl'],r['en'])
    for t in tables:
        if t[0]==f and t[2] not in ('FABULA_TXT','BOSS_WHO','BOSS_TITLES','NAMED','NOTES'):
            w(f'## tabela {t[2]} ({f}:{t[1]})\n')
            for p,pl,en in t[3]:entry(f'{t[2]}:{p}',pl,en)
for t in tables:
    if t[0] not in byf and t[2] not in ('FABULA_TXT','BOSS_WHO','BOSS_TITLES','NAMED','NOTES'):
        w(f'## tabela {t[2]} ({t[0]}:{t[1]})\n')
        for p,pl,en in t[3]:entry(f'{t[2]}:{p}',pl,en)
# C
w('='*90);w('C. NAPISY INTERFEJSU z index.html (I18N_DOM) — PL jest w index.html, EN w tabeli tłumaczeń');w('='*90)
for i,(pl,en) in enumerate(dom.items(),1):entry(f'I18N_DOM#{i}',pl,en)
open('NIGHTBRAND_teksty_PL_EN.txt','w',encoding='utf8').write('\n'.join(out)+'\n')
print(len(out),os.path.getsize('NIGHTBRAND_teksty_PL_EN.txt'),len(rows))

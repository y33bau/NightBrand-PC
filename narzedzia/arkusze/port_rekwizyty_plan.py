import json
from collections import deque
m=json.load(open('port_mapa.json'));GW,GH=m['GW'],m['GH'];mp=m['map']
P=[ # k,x,y,solid,flip
('lodz',8,38,0,0),('lodz',54,36,0,1),('lodz',38,5,0,1),
('pale',10,44,0,0),('pale',54,43,0,1),('pale',22,8,0,0),
('malze',20,39,0,0),('malze',45,39,0,1),('malze',42,8,0,1),
('skrzynia',8,23,1,0),('skrzynia',54,23,1,1),
('kotwica',55,28,1,0),
('beczka_ryby',9,19,1,0),('beczka_ryby',45,14,1,1),
('wiecierz',56,14,1,0),('wiecierz',11,40,1,1),
('wrak',6,31,1,0),('wrak',59,21,1,1),
('pacholek',15,35,1,0),('pacholek',48,35,1,1),
('siec',13,38,0,0),('siec',50,39,0,1),('siec',17,12,0,0),
('ikra',44,31,0,0),('ikra',19,32,0,1),
('deski',13,46,0,0),('deski',50,46,0,1)]
WALK={40,42,43,47}
def reach(block):
    sx,sy=map(int,m['start']);seen={(sx,sy)};q=deque([(sx,sy)])
    while q:
        x,y=q.popleft()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            X,Y=x+dx,y+dy
            if 0<=X<GW and 0<=Y<GH and (X,Y) not in seen and mp[Y*GW+X] in WALK and (X,Y) not in block:seen.add((X,Y));q.append((X,Y))
    return seen
r0=reach(set());blk=set();bad=[]
for k,x,y,s,f in P:
    t=mp[y*GW+x]
    if s and t not in WALK:bad.append((k,x,y,'nie na ladzie',t))
    if not s and k in('siec','ikra','deski') and t not in WALK:bad.append((k,x,y,'nie na ladzie',t))
    if k in('lodz','pale','malze') and t!=45:bad.append((k,x,y,'nie w wodzie',t))
    if s:blk.add((x,y))
r1=reach(blk)
print('osiagalne przed',len(r0),'po',len(r1),'utracone',sorted(r0-r1-blk))
print('bledy',bad)
json.dump(P,open('rek_plan.json','w'))

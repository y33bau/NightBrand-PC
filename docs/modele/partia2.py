# NightBrand: partia 2 modeli (dolaczana do potok.py przez exec)
def bw(F,gx,gy,L,D,H,yaw=0,z0=0.,bev=.01,depth_off=0.):
    # prostopadloscian stojacy na ziemi; (gx,gy) = srodek podstawy na malunku; L,D,H w ulamkach szerokosci malunku
    c=F.g(gx,gy);c.y+=F.L(depth_off)
    return box((F.L(L),F.L(D),F.L(H)),loc=(c.x,c.y,F.L(z0+H/2)),rot=(0,0,math.radians(yaw)),bevel=F.L(bev))
def rubble(F,gx,gy,rx,ry,h,seed=1):
    m=sphere((F.L(rx),F.L(ry),F.L(h)),loc=F.g(gx,gy),seg=32,ring=16);remesh(m,F.L(.015))
    displace(m,tex('v%d'%seed,'VORONOI',noise_scale=F.L(.05)),F.L(.025));displace(m,tex('c%d'%seed,'CLOUDS',noise_scale=F.L(.08)),F.L(.02));obj_apply(m);return m
def m_sarkofag2(F):
    plat=rubble(F,.5,.73,.45,.33,.035,1)
    body=bw(F,.46,.6,.6,.3,.24,yaw=-24,z0=.03,bev=.008);lid=bw(F,.46,.6,.64,.34,.06,yaw=-24,z0=.27,bev=.01)
    eff=sphere((F.L(.2),F.L(.08),F.L(.035)),loc=(0,0,0),seg=24,ring=12);c=F.g(.46,.6);eff.location=(c.x,c.y,F.L(.33));eff.rotation_euler=(0,0,math.radians(-24))
    o=join([plat,body,lid,eff],'sarkofag2');ground(o);shade(o,True,30);return o
def m_sarkofag3(F):
    base=bw(F,.48,.72,.92,.36,.06,yaw=-22,bev=.01)
    body=bw(F,.48,.72,.86,.3,.22,yaw=-22,z0=.06,bev=.008);lid=bw(F,.48,.72,.9,.34,.05,yaw=-22,z0=.28,bev=.01)
    eff=sphere((F.L(.3),F.L(.09),F.L(.05)),seg=24,ring=12);c=F.g(.48,.72);eff.location=(c.x,c.y,F.L(.34));eff.rotation_euler=(0,0,math.radians(-22));bpy.context.view_layer.objects.active=eff;bpy.ops.object.transform_apply(location=True,rotation=True)
    o=join([base,body,lid,eff],'sarkofag3');shade(o,True,30);return o
def m_kowadlo(F):
    base=bw(F,.52,.8,.6,.36,.13,yaw=-18,bev=.01);step=bw(F,.52,.77,.46,.26,.05,yaw=-18,z0=.13,bev=.008)
    waist=bw(F,.54,.74,.22,.17,.13,yaw=-18,z0=.18,bev=.006);top=bw(F,.56,.72,.56,.22,.11,yaw=-18,z0=.31,bev=.008)
    c=F.g(.56,.72);a=math.radians(-18);d=Vector((math.cos(a),math.sin(a),0))
    horn=cyl(F.L(.09),F.L(.3),loc=(c.x-d.x*F.L(.42),c.y-d.y*F.L(.42),F.L(.37)),rot=(0,math.radians(-90),a),verts=16,r2=F.L(.008))
    o=join([base,step,waist,top,horn],'kowadlo');shade(o,True,30);return o
def m_wozek(F):
    a=-22;body=bw(F,.52,.66,.62,.38,.26,yaw=a,z0=.1,bev=.008)
    bm=bmesh.new();bm.from_mesh(body.data)
    for v in bm.verts:
        if v.co.z>F.L(.2):v.co.x=v.co.x*1.12;v.co.y=(v.co.y-F.g(.52,.66).y)*1.12+F.g(.52,.66).y
    bm.to_mesh(body.data);bm.free()
    coal=sphere((F.L(.3),F.L(.17),F.L(.08)),seg=24,ring=12);c=F.g(.52,.66);coal.location=(c.x,c.y,F.L(.36));coal.rotation_euler=(0,0,math.radians(a));displace(coal,tex('v','VORONOI',noise_scale=F.L(.04)),F.L(.04))
    whs=[]
    ar=math.radians(a);ax=Vector((math.cos(ar),math.sin(ar),0));ay=Vector((-math.sin(ar),math.cos(ar),0))
    for sx in (-1,1):
        for sy in (-1,1):
            p=c+ax*sx*F.L(.2)+ay*sy*F.L(.2);w=cyl(F.L(.1),F.L(.04),loc=(p.x,p.y,F.L(.1)),rot=(math.radians(90),0,ar),verts=20);whs.append(w)
    o=join([body,coal]+whs,'wozek');ground(o);shade(o,True,30);return o
def m_skrzynia(F):
    b=bw(F,.5,.8,.9,.42,.32,yaw=8,bev=.012)
    c=F.g(.5,.8);lid=cyl(F.L(.21),F.L(.9),loc=(c.x,c.y,F.L(.32)),rot=(0,math.radians(90),math.radians(8)),verts=24);bpy.context.view_layer.objects.active=lid;bpy.ops.object.transform_apply(location=True,rotation=True)
    bm=bmesh.new();bm.from_mesh(lid.data);bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=(0,0,F.L(.32)),plane_no=(0,0,1),clear_inner=True);bm.to_mesh(lid.data);bm.free()
    for v in lid.data.vertices:v.co.z=F.L(.32)+(v.co.z-F.L(.32))*.75
    o=join([b,lid],'skrzynia');shade(o,True,30);return o
def m_nagrobek(F):
    base=bw(F,.5,.86,.64,.3,.1,bev=.012)
    slab=bw(F,.5,.82,.5,.13,.5,z0=.1,bev=.015,depth_off=.03)
    c=F.g(.5,.82);top=cyl(F.L(.25),F.L(.13),loc=(c.x,c.y+F.L(.03),F.L(.6)),rot=(math.radians(90),0,0),verts=32);bpy.context.view_layer.objects.active=top;bpy.ops.object.transform_apply(location=True,rotation=True)
    bm=bmesh.new();bm.from_mesh(top.data);bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=(0,0,F.L(.6)),plane_no=(0,0,1),clear_inner=True);bm.to_mesh(top.data);bm.free()
    for v in top.data.vertices:v.co.z=F.L(.6)+(v.co.z-F.L(.6))*.55
    o=join([base,slab,top],'nagrobek');displace(o,tex('c','CLOUDS',noise_scale=F.L(.06)),F.L(.006));obj_apply(o);shade(o,True,30);return o
def m_krzyz(F):
    m=rubble(F,.5,.8,.3,.2,.06,2)
    sk=[sphere((F.L(.06),F.L(.06),F.L(.055)),loc=F.g(gx,gy)+Vector((0,0,F.L(.06))),seg=16,ring=10) for gx,gy in ((.38,.76),(.65,.82))]
    p0=F.g(.5,.7)+Vector((0,F.L(.02),0));p1=F.at(.53,.22,p0.y);v=segment(p0,p1,F.L(.035),6)
    a0=F.at(.31,.38,p0.y);a1=F.at(.73,.47,p0.y);arm=segment(a0,a1,F.L(.03),6)
    o=join([m,v,arm]+sk,'krzyz');ground(o);shade(o,True,35);return o
def m_dyby(F):
    parts=[]
    for gx in (.27,.67):parts.append(bw(F,gx,.82,.08,.1,.72,yaw=-10,bev=.006))
    parts.append(bw(F,.47,.82,.36,.05,.55,yaw=-10,z0=.04,bev=.004))
    parts.append(bw(F,.47,.8,.6,.12,.14,yaw=-10,z0=.6,bev=.008))
    for gx in (.27,.67):parts.append(bw(F,gx,.86,.12,.42,.05,yaw=-10,bev=.006))
    o=join(parts,'dyby');shade(o,True,30);return o
def m_namiot(F):
    R=F.L(.42);H=R*1.9;c=F.g(.47,.82)
    t=lathe([(0,0),(R,0),(R*.98,H*.04),(R*.55,H*.45),(R*.2,H*.8),(R*.05,H*.97),(0,H)],40);ridges(t,13,.035)
    t.location=(c.x,c.y,0);bpy.context.view_layer.objects.active=t;bpy.ops.object.transform_apply(location=True)
    poles=[segment(Vector((c.x,c.y,H*.8)),Vector((c.x+math.cos(a)*R*.25,c.y+math.sin(a)*R*.25,H*1.18)),F.L(.012),6) for a in (0.4,1.6,2.6,3.7,5.0)]
    o=join([t]+poles,'namiot');shade(o,True,40);return o
def m_misa(F):
    R=F.L(.33)
    o=lathe([(0,0),(R,0),(R,.09),(R*.92,.13),(R*.55,.15),(R*.45,.2),(R*.42,.46),(R*.55,.5),(R*.95,.6),(R*1.18,.74),(R*1.22,.86),(R*1.2,.9),(R*1.02,.9),(R*.9,.82),(0,.8)],40)
    for v in o.data.vertices:v.co.z*=R*2.4
    displace(o,tex('c','CLOUDS',noise_scale=R*.2),R*.012);obj_apply(o);shade(o,True,35);return o
def m_lawa(F):
    seat=bw(F,.5,.62,.94,.26,.09,yaw=-6,z0=.2,bev=.01)
    legs=[bw(F,gx,.66,.14,.22,.2,yaw=-6,bev=.008) for gx in (.13,.86)]
    mid=bw(F,.5,.64,.6,.08,.07,yaw=-6,z0=.13,bev=.006)
    o=join([seat,mid]+legs,'lawa');shade(o,True,30);return o
MODELE.update({'sarkofag2':('p2_sarcophagus',m_sarkofag2),'sarkofag3':('p3_sarcophagus',m_sarkofag3),'kowadlo':('p2_anvil',m_kowadlo),'wozek':('p2_mine_cart',m_wozek),
 'skrzynia':('p5_chest',m_skrzynia),'nagrobek':('p1_tombstone',m_nagrobek),'krzyz':('p1_grave_cross',m_krzyz),'namiot':('p4_cz_tent',m_namiot),'misa':('p3_offering_bowl',m_misa),'lawa':('p5_bench_b',m_lawa)})

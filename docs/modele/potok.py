# NightBrand: modele rekwizytow w Blenderze (bpy). Uzycie: python potok.py -- NAZWA [NAZWA...]
# Ramka: x w prawo, -y = poludnie (do kamery), z w gore. Kamera gry patrzy z poludnia pod katem PITCH.
# Kazdy model jest skalowany tak, by jego obrys z kamery mial szerokosc 1 i proporcje obrysu malunku.
# Malunek nakleja gra w czasie dzialania (rzut z kamery), wiec .glb ma tylko ksztalt, normalne i cienie (kolory wierzcholkow).
import bpy,bmesh,math,sys,os,json,random
from mathutils import Vector,Matrix
from PIL import Image
import numpy as np
ARGS=sys.argv[sys.argv.index('--')+1:]
OUT='/tmp/blend/out/';os.makedirs(OUT,exist_ok=True)
P=math.radians(45);UP=Vector((0,math.sin(P),math.cos(P)))
IDX={x['klucze'][0]:x['plik'] for x in json.load(open('/home/claude/nightbrand-pc/docs/INDEKS_ASSETOW.json'))['pliki'] if x.get('klucze')}
def sprite(key):
    im=Image.open('/home/claude/nightbrand-pc/gra/'+IDX[key]).convert('RGBA');a=np.array(im)[...,3]>128
    ys,xs=np.where(a);W,H=im.size
    return im,(xs.min()/W,ys.min()/H,(xs.max()+1)/W,(ys.max()+1)/H)
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
class Frame:
    # wspolrzedne malunku (ulamki obrazka, y od gory) -> punkt w ramce modelu na zadanej glebokosci (y, polnoc +)
    def __init__(s,box):s.b=box;s.A=(box[3]-box[1])/(box[2]-box[0])
    def u(s,gx):return (gx-s.b[0])/(s.b[2]-s.b[0])-.5
    def v(s,gy):return (s.b[3]-gy)/(s.b[3]-s.b[1])*s.A
    def L(s,d):return d/(s.b[2]-s.b[0])
    def g(s,gx,gy):return Vector((s.u(gx),s.v(gy)/math.sin(P),0))
    def hit(s,o,gx,gy):
        from mathutils.bvhtree import BVHTree
        bpy.context.view_layer.update();t=BVHTree.FromObject(o,bpy.context.evaluated_depsgraph_get())
        a=s.at(gx,gy,-5);b=s.at(gx,gy,5);loc,_,_,_=t.ray_cast(a,(b-a).normalized())
        return loc if loc else s.at(gx,gy,0)
    def at(s,gx,gy,depth=0.):sv=s.v(gy);return Vector((s.u(gx),depth,(sv-depth*math.sin(P))/math.cos(P)))
def obj_apply(o):
    bpy.context.view_layer.objects.active=o
    for m in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=m.name)
def join(objs,name):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:o.select_set(True);obj_apply(o)
    bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();o=bpy.context.object;o.name=name
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);return o
def screen_box(o):
    vs=[o.matrix_world@v.co for v in o.data.vertices];xs=[v.x for v in vs];ss=[v.dot(UP) for v in vs]
    return min(xs),max(xs),min(ss),max(ss)
def fit(o,A,yz=False):
    # szerokosc obrysu 1, wysokosc obrysu = A (skala z), srodek w x=0, spod na z=0
    x0,x1,s0,s1=screen_box(o);k=1/(x1-x0)
    for v in o.data.vertices:v.co*=k
    x0,x1,s0,s1=screen_box(o);kz=1.
    for it in range(8):
        x0,x1,s0,s1=screen_box(o);r=A/(s1-s0)
        if abs(r-1)<.003:break
        for v in o.data.vertices:
            v.co.z*=r
            if yz:v.co.y*=r
        kz*=r
    cx=(x0+x1)/2;zmin=min(v.co.z for v in o.data.vertices)
    for v in o.data.vertices:v.co.x-=cx;v.co.z-=zmin
    return kz
def ground(o,cut=0.):
    bm=bmesh.new();bm.from_mesh(o.data)
    bmesh.ops.bisect_plane(bm,geom=bm.verts[:]+bm.edges[:]+bm.faces[:],plane_co=(0,0,cut),plane_no=(0,0,1),clear_inner=True)
    bm.to_mesh(o.data);bm.free()
def tex(name,kind,**kw):
    t=bpy.data.textures.new(name,kind)
    for k,v in kw.items():setattr(t,k,v)
    return t
def displace(o,t,strength,mid=.5,coords='LOCAL'):
    d=o.modifiers.new('d','DISPLACE');d.texture=t;d.strength=strength;d.mid_level=mid;d.texture_coords=coords;return d
def remesh(o,vs):r=o.modifiers.new('r','REMESH');r.mode='VOXEL';r.voxel_size=vs
def decimate(o,ratio):d=o.modifiers.new('dec','DECIMATE');d.ratio=ratio
def shade(o,smooth,angle=40):
    for p in o.data.polygons:p.use_smooth=smooth
    if smooth:
        try:bpy.context.view_layer.objects.active=o;bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
        except Exception:pass
def cyl(r,h,loc=(0,0,0),rot=(0,0,0),verts=24,r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r,radius2=r if r2 is None else r2,depth=h,location=loc,rotation=rot);return bpy.context.object
def box(size,loc=(0,0,0),rot=(0,0,0),bevel=0.):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc,rotation=rot);o=bpy.context.object;o.scale=size;bpy.ops.object.transform_apply(scale=True)
    if bevel:b=o.modifiers.new('b','BEVEL');b.width=bevel;b.segments=2
    return o
def sphere(sc,loc=(0,0,0),seg=40,ring=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=ring,location=loc);o=bpy.context.object;o.scale=sc;bpy.ops.object.transform_apply(scale=True);return o
def lathe(profile,seg=32,closed=False):
    me=bpy.data.meshes.new('l');bm=bmesh.new()
    vs=[bm.verts.new((r,0,z)) for r,z in profile]
    for a,b in zip(vs,vs[1:]):bm.edges.new((a,b))
    if closed:bm.edges.new((vs[-1],vs[0]))
    bmesh.ops.spin(bm,geom=bm.verts[:]+bm.edges[:],axis=(0,0,1),cent=(0,0,0),steps=seg,angle=math.radians(360),use_duplicate=False)
    bmesh.ops.remove_doubles(bm,verts=bm.verts[:],dist=1e-5);bmesh.ops.recalc_face_normals(bm,faces=bm.faces[:])
    bm.to_mesh(me);bm.free();o=bpy.data.objects.new('l',me);bpy.context.collection.objects.link(o);return o
def segment(p0,p1,r,verts=10):
    # walec miedzy dwoma punktami
    d=p1-p0;o=cyl(r,d.length,loc=(p0+p1)/2,verts=verts)
    o.rotation_euler=d.to_track_quat('Z','Y').to_euler();bpy.ops.object.transform_apply(rotation=True,location=False);return o

# ---------- modele ----------
def m_glaz(F):
    a=sphere((1.0,.85,1.2));b=sphere((.62,.55,.66),loc=(.6,-.3,0),seg=32,ring=16);c=sphere((.55,.5,.72),loc=(-.6,-.22,0),seg=32,ring=16);d=sphere((.5,.45,.5),loc=(.15,-.55,0),seg=32,ring=16)
    o=join([a,b,c,d],'glaz');remesh(o,.035)
    displace(o,tex('v','VORONOI',noise_scale=.32,distance_metric='DISTANCE_SQUARED'),-.16,mid=0)
    displace(o,tex('c','CLOUDS',noise_scale=.5),.08);decimate(o,.12);obj_apply(o);ground(o);shade(o,False);return o
def m_beczka(F):
    # klepki: lekkie pionowe rowki, obrecze jako zgrubienia
    prof=[(0,0),(.40,0),(.42,.03),(.465,.22),(.5,.5),(.465,.78),(.42,.97),(.40,1),(.36,1),(.36,.96),(0,.96)]
    o=lathe(prof,48);o.name='beczka'
    bm=bmesh.new();bm.from_mesh(o.data)
    for v in bm.verts:
        r=math.hypot(v.co.x,v.co.y)
        if r<.3:continue
        a=math.atan2(v.co.y,v.co.x);z=v.co.z
        g=1-.012*(abs(math.sin(a*8))<.12)   # rowki miedzy klepkami
        h=1+sum(.018*math.exp(-((z-q)/.025)**2) for q in (.08,.27,.73,.92))  # obrecze
        v.co.x*=g*h;v.co.y*=g*h
    bm.to_mesh(o.data);bm.free()
    displace(o,tex('c','CLOUDS',noise_scale=.3),.012);obj_apply(o);shade(o,True,50);return o
MODELE={'glaz':('p4_mossy_boulder',m_glaz),'beczka1':('p1_barrel',m_beczka),'beczka3':('p3_barrel',m_beczka)}


def ridges(o,freq,amp,axis='a'):
    # rowki/pierscienie: przesuniecie promieniowe zalezne od kata (a) albo wysokosci (z)
    bm=bmesh.new();bm.from_mesh(o.data)
    for v in bm.verts:
        r=math.hypot(v.co.x,v.co.y)
        if r<1e-4:continue
        a=math.atan2(v.co.y,v.co.x);f=1+amp*(math.sin(a*freq) if axis=='a' else math.sin(v.co.z*freq))
        v.co.x*=f;v.co.y*=f
    bm.to_mesh(o.data);bm.free()
def m_pien(F):
    R=F.L(.31);top=F.at(.5,.45,0).z
    o=lathe([(0,0),(R*1.22,0),(R*1.1,top*.08),(R*1.05,top*.25),(R,top*.55),(R*.98,top),(R*.9,top*1.01),(0,top*1.01)],48)
    ridges(o,26,.035);remesh(o,R*.05);displace(o,tex('c','CLOUDS',noise_scale=R*.6),R*.06)
    obj_apply(o)
    blade=box((F.L(.17),F.L(.03),F.L(.14)),loc=F.at(.45,.40,0)+Vector((0,0,F.L(.02))),rot=(0,math.radians(-12),0),bevel=F.L(.008))
    p0=F.at(.52,.31,.02);p1=F.at(.86,.14,.06);h=segment(p0,p1,F.L(.022),12)
    parts=[o,blade,h]
    for gx,gy,sz in ((.2,.88,.05),(.27,.95,.045),(.7,.87,.055),(.8,.8,.05),(.86,.86,.045),(.6,.93,.05),(.12,.82,.04)):
        c=box((F.L(sz*1.4),F.L(sz),F.L(sz*.5)),loc=F.g(gx,gy)+Vector((0,0,F.L(sz*.25))),rot=(0,0,gx*9),bevel=F.L(.006));parts.append(c)
    o=join(parts,'pien');decimate(o,.22);obj_apply(o);shade(o,True,35);return o
def m_ul(F):
    W=F.L(.64);D=F.L(.4);Rd=F.L(.245);leg=F.L(.13);th=F.L(.04)
    plank=box((W,D,th),loc=(F.u(.405),0,leg+th/2),bevel=th*.3)
    legs=[box((F.L(.05),F.L(.05),leg),loc=(F.u(.405)+sx*W*.4,sy*D*.36,leg/2),bevel=F.L(.006)) for sx in (-1,1) for sy in (-1,1)]
    Hd=Rd*1.45
    d=lathe([(0,0),(Rd,0),(Rd*1.03,Hd*.12),(Rd,Hd*.32),(Rd*.88,Hd*.54),(Rd*.66,Hd*.74),(Rd*.38,Hd*.9),(Rd*.12,Hd*.98),(Rd*.12,Hd*1.04),(0,Hd*1.04)],48)
    ridges(d,2*math.pi/(Hd/9),.04,'z');d.location=(F.u(.41),0,leg+th);bpy.context.view_layer.objects.active=d;bpy.ops.object.transform_apply(location=True)
    o=join([plank,d]+legs,'ul');shade(o,True,40);return o
def m_kurhan(F):
    rx=F.L(.47);ry=F.L(.36);hz=F.L(.24)
    m=sphere((rx,ry,hz),seg=48,ring=24);remesh(m,F.L(.016))
    displace(m,tex('c','CLOUDS',noise_scale=F.L(.12)),F.L(.03));displace(m,tex('v','VORONOI',noise_scale=F.L(.1)),F.L(.018));obj_apply(m);ground(m)
    parts=[m]
    for gx,gy,r in ((.33,.66,.075),(.32,.84,.085),(.58,.62,.06),(.7,.78,.075),(.14,.82,.05),(.72,.57,.05)):
        a_=F.at(gx,gy,-5);b_=F.at(gx,gy,5);d_=(b_-a_);A_=Vector((1/rx,1/ry,1/hz));aa=Vector((a_.x*A_.x,a_.y*A_.y,a_.z*A_.z));dd=Vector((d_.x*A_.x,d_.y*A_.y,d_.z*A_.z))
        qa=dd.dot(dd);qb=2*aa.dot(dd);qc=aa.dot(aa)-1;disc=qb*qb-4*qa*qc
        if disc<0:continue
        t_=(-qb-math.sqrt(disc))/(2*qa);p=a_+d_*t_
        st=sphere((F.L(r),F.L(r*.8),F.L(r*.75)),loc=p,seg=12,ring=8);displace(st,tex('v2','VORONOI',noise_scale=F.L(r*.8)),F.L(r*.3));parts.append(st)
    base=Vector((F.u(.51),0,hz*.92));c1=F.at(.51,.19,base.y);v=box((F.L(.07),F.L(.06),(c1-base).length+F.L(.05)),loc=(base+c1)/2-Vector((0,0,F.L(.025))))
    a0=F.at(.37,.29,base.y);a1=F.at(.65,.29,base.y);arm=box(((a1-a0).length,F.L(.05),F.L(.05)),loc=(a0+a1)/2)
    o=join(parts+[v,arm],'kurhan');ground(o);decimate(o,.35);obj_apply(o);shade(o,True,40);return o
def m_drewno(F):
    r=F.L(.06);L=r*9.0;ax=Vector((math.sin(math.radians(68)),math.cos(math.radians(68)),0));pp=Vector((ax.y,-ax.x,0));parts=[]
    for k,n in enumerate((5,4,3,2)):
        for j in range(n):
            h=math.sin(j*3.1+k*1.7)
            x=(j-(n-1)/2)*r*2.05;z=r+k*r*1.74;p0=pp*x+Vector((0,0,z))+ax*(h*r*.5)
            c=segment(p0,p0+ax*L*(.9+.1*h),r*(.95+.06*h),16);b=c.modifiers.new('b','BEVEL');b.width=r*.12;b.segments=2;parts.append(c)
    o=join(parts,'drewno');displace(o,tex('c','CLOUDS',noise_scale=r*1.2),r*.06);obj_apply(o);shade(o,True,35);return o
def m_studnia(F):
    R=F.L(.325);Ri=R*.78;ctr=F.u(.43)
    Htop=F.at(.43,.62,-R).z
    ring=lathe([(Ri,0),(Ri,Htop),(R*1.01,Htop*1.02),(R*1.04,0)],48,closed=True)
    sub=ring.modifiers.new('s','SUBSURF');sub.levels=3;sub.subdivision_type='SIMPLE'
    displace(ring,tex('v','VORONOI',noise_scale=R*.22,distance_metric='DISTANCE_SQUARED'),-R*.05,mid=0);obj_apply(ring)
    ring.location.x=ctr;bpy.context.view_layer.objects.active=ring;bpy.ops.object.transform_apply(location=True)
    water=cyl(Ri*.98,Htop*.04,loc=(ctr,0,Htop*.55),verts=32)
    pt=F.L(.08);ph=F.at(.2,.1,0).z
    posts=[box((pt,pt,ph),loc=(F.u(gx),0,ph/2),bevel=pt*.1) for gx in (.2,.65)]
    b0=F.at(.12,.19,0);b1=F.at(.7,.21,0);beam=box(((b1-b0).length,pt*.85,pt*.85),loc=(b0+b1)/2,bevel=pt*.08)
    drum=segment(F.at(.33,.22,0),F.at(.53,.22,0),F.L(.07),16)
    rope=segment(F.at(.43,.29,0),F.at(.43,.42,0),F.L(.012),6)
    bucket=cyl(F.L(.075),F.L(.12),loc=F.at(.425,.52,0),verts=20,r2=F.L(.085))
    crank=segment(F.at(.7,.24,0),F.at(.79,.3,0),F.L(.02),8);knob=segment(F.at(.79,.38,0),F.at(.88,.4,0),F.L(.03),10)
    o=join([ring,water,beam,drum,rope,bucket,crank,knob]+posts,'studnia');decimate(o,.3);obj_apply(o);shade(o,True,35);return o
MODELE.update({'pien':('p4_axe_stump',m_pien),'ul':('p4_cz_beehive',m_ul),'kurhan':('p4_burial_mound',m_kurhan),'drewno':('p4_cz_firewood',m_drewno),'studnia':('p1_well',m_studnia)})

# ---------- wypalanie cieni, eksport, podglad ----------
def bake_ao(o):
    sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=64
    if not o.data.color_attributes:o.data.color_attributes.new('Col','FLOAT_COLOR','POINT')
    o.data.color_attributes.active_color=o.data.color_attributes[0]
    mat=bpy.data.materials.new('ao');mat.use_nodes=True;o.data.materials.clear();o.data.materials.append(mat)
    # ziemia pod spodem, zeby spod byl ciemny jak na malunku
    bpy.ops.mesh.primitive_plane_add(size=20,location=(0,0,0));pl=bpy.context.object
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    sc.render.bake.target='VERTEX_COLORS';sc.world=sc.world or bpy.data.worlds.new('w')
    bpy.ops.object.bake(type='AO')
    bpy.data.objects.remove(pl)
def export(o,name):
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    o.data.materials.clear()
    kw=dict(filepath=OUT+name+'.glb',export_format='GLB',use_selection=True,export_materials='NONE',export_texcoords=False,export_normals=True,export_apply=True,export_yup=True)
    try:bpy.ops.export_scene.gltf(**kw,export_vertex_color='ACTIVE')
    except TypeError:bpy.ops.export_scene.gltf(**kw,export_colors=True)
    return os.path.getsize(OUT+name+'.glb')
def preview(o,name,key):
    im,bxp=sprite(key);box_=bxp
    a=np.array(im);m=a[...,3]<128
    from scipy import ndimage
    _,(iy,ix)=ndimage.distance_transform_edt(m,return_indices=True);b=a[iy,ix].copy();b[...,3]=255
    Image.fromarray(b).save(OUT+name+'_tex.png')
    me=o.data;uv=me.uv_layers.new(name='UV');x0,x1,s0,s1=screen_box(o)
    for p in me.polygons:
        for li in p.loop_indices:
            v=me.vertices[me.loops[li].vertex_index].co;u=(v.x-x0)/(x1-x0);w=(v.dot(UP)-s0)/(s1-s0)
            uv.data[li].uv=(bxp[0]+u*(bxp[2]-bxp[0]),1-(bxp[3]-w*(bxp[3]-bxp[1])))
    mat=bpy.data.materials.new('pv');mat.use_nodes=True;nt=mat.node_tree;t=nt.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(OUT+name+'_tex.png')
    vc=nt.nodes.new('ShaderNodeVertexColor');mx=nt.nodes.new('ShaderNodeMix');mx.data_type='RGBA';mx.blend_type='MULTIPLY';mx.inputs[0].default_value=1
    nt.links.new(t.outputs['Color'],mx.inputs[6]);nt.links.new(vc.outputs['Color'],mx.inputs[7])
    bs=nt.nodes['Principled BSDF'];bs.inputs['Roughness'].default_value=.95;nt.links.new(mx.outputs[2],bs.inputs['Base Color'])
    me.materials.clear();me.materials.append(mat)
    sc=bpy.context.scene;w=sc.world;w.use_nodes=True;w.node_tree.nodes['Background'].inputs['Color'].default_value=(.08,.09,.1,1);w.node_tree.nodes['Background'].inputs['Strength'].default_value=2.5
    bpy.ops.object.light_add(type='SUN',rotation=(math.radians(-35),0,math.radians(-25)));bpy.context.object.data.energy=2.5
    sc.cycles.samples=24;sc.render.resolution_x=sc.render.resolution_y=360;sc.render.film_transparent=True
    _,_,s0,s1=screen_box(o)
    for tag,el,az in (('gra',45,0),('bok',22,65)):
        bpy.ops.object.camera_add();c=bpy.context.object;c.data.type='ORTHO';c.data.ortho_scale=max(1.25,(s1-s0)*1.25)
        e=math.radians(el);a_=math.radians(az);r=10;tgt=Vector((0,0,(s1-s0)*.45))
        c.location=tgt+Vector((r*math.cos(e)*math.sin(a_),-r*math.cos(e)*math.cos(a_),r*math.sin(e)));c.rotation_euler=(tgt-c.location).to_track_quat('-Z','Y').to_euler()
        sc.camera=c;sc.render.filepath=OUT+name+'_'+tag+'.png';bpy.ops.render.render(write_still=True)
    s=Image.new('RGBA',(1080,360),(40,44,50,255));s.alpha_composite(im.resize((360,360)),(0,0))
    for i,t_ in enumerate(('gra','bok')):s.alpha_composite(Image.open(OUT+name+'_'+t_+'.png').convert('RGBA'),(360*(i+1),0))
    s.save(OUT+name+'_porownanie.png')

for name in ARGS:
    reset();key,fn=MODELE[name];im,bx=sprite(key);F=Frame(bx)
    o=fn(F);kz=fit(o,F.A,yz=(name=='drewno'));bake_ao(o);n=export(o,name)
    print('MODEL',name,'verts',len(o.data.vertices),'bytes',n,'kz',round(kz,3))

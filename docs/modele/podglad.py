# podglad tego, co dostanie gra: wczytany .glb, rzut malunku z kamery, cienie z kolorow wierzcholkow
import bpy,sys,math,json
from mathutils import Vector
from PIL import Image
import numpy as np
from scipy import ndimage
names=sys.argv[sys.argv.index('--')+1:]
P=math.radians(45);UP=Vector((0,math.sin(P),math.cos(P)))
IDX={x['klucze'][0]:x['plik'] for x in json.load(open('/home/claude/nightbrand-pc/docs/INDEKS_ASSETOW.json'))['pliki'] if x.get('klucze')}
KEY={'glaz':'p4_mossy_boulder','beczka1':'p1_barrel','beczka3':'p3_barrel','pien':'p4_axe_stump','ul':'p4_cz_beehive','kurhan':'p4_burial_mound','drewno':'p4_cz_firewood','studnia':'p1_well'}
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath='/tmp/blend/out/%s.glb'%n)
    o=[x for x in bpy.context.scene.objects if x.type=='MESH'][0];bpy.context.view_layer.objects.active=o;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);me=o.data
    im=Image.open('/home/claude/nightbrand-pc/gra/'+IDX[KEY[n]]).convert('RGBA');a=np.array(im);al=a[...,3]>128;ys,xs=np.where(al);Wd,Hd=im.size
    b=(xs.min()/Wd,ys.min()/Hd,(xs.max()+1)/Wd,(ys.max()+1)/Hd)
    _,(iy,ix)=ndimage.distance_transform_edt(~al,return_indices=True);t=a[iy,ix].copy();t[...,3]=255;Image.fromarray(t).save('/tmp/blend/out/%s_tex.png'%n)
    vs=[v.co for v in me.vertices];x0=min(v.x for v in vs);x1=max(v.x for v in vs);s0=min(v.dot(UP) for v in vs);s1=max(v.dot(UP) for v in vs)
    uv=me.uv_layers.new(name='UV')
    for p in me.polygons:
        for li in p.loop_indices:
            v=me.vertices[me.loops[li].vertex_index].co;u=(v.x-x0)/(x1-x0);w=(v.dot(UP)-s0)/(s1-s0)
            uv.data[li].uv=(b[0]+u*(b[2]-b[0]),1-(b[3]-w*(b[3]-b[1])))
    mat=bpy.data.materials.new('pv');nt=mat.node_tree if mat.node_tree else None
    mat.use_nodes=True;nt=mat.node_tree;bs=nt.nodes['Principled BSDF'];bs.inputs['Roughness'].default_value=.95
    tx=nt.nodes.new('ShaderNodeTexImage');tx.image=bpy.data.images.load('/tmp/blend/out/%s_tex.png'%n)
    ca=nt.nodes.new('ShaderNodeVertexColor');ca.layer_name=me.color_attributes[0].name if me.color_attributes else ''
    mx=nt.nodes.new('ShaderNodeMix');mx.data_type='RGBA';mx.blend_type='MULTIPLY';mx.inputs[0].default_value=1
    nt.links.new(tx.outputs['Color'],mx.inputs[6]);nt.links.new(ca.outputs['Color'],mx.inputs[7]);nt.links.new(mx.outputs[2],bs.inputs['Base Color'])
    me.materials.clear();me.materials.append(mat)
    sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=20;sc.render.resolution_x=sc.render.resolution_y=360;sc.render.film_transparent=True
    w=bpy.data.worlds.new('w');sc.world=w;w.use_nodes=True;w.node_tree.nodes['Background'].inputs['Color'].default_value=(.08,.09,.1,1);w.node_tree.nodes['Background'].inputs['Strength'].default_value=2.5
    bpy.ops.object.light_add(type='SUN',rotation=(math.radians(-35),0,math.radians(-25)));bpy.context.object.data.energy=2.5
    for tag,el,az in (('gra',45,0),('bok',22,65)):
        bpy.ops.object.camera_add();c=bpy.context.object;c.data.type='ORTHO';c.data.ortho_scale=max(1.25,(s1-s0)*1.25)
        e=math.radians(el);aa=math.radians(az);r=10;tg=Vector((0,0,(s1-s0)*.45))
        c.location=tg+Vector((r*math.cos(e)*math.sin(aa),-r*math.cos(e)*math.cos(aa),r*math.sin(e)));c.rotation_euler=(tg-c.location).to_track_quat('-Z','Y').to_euler()
        sc.camera=c;sc.render.filepath='/tmp/blend/out/%s_%s.png'%(n,tag);bpy.ops.render.render(write_still=True)
    s=Image.new('RGBA',(1080,360),(40,44,50,255));s.alpha_composite(im.resize((360,360)),(0,0))
    for i,t_ in enumerate(('gra','bok')):s.alpha_composite(Image.open('/tmp/blend/out/%s_%s.png'%(n,t_)).convert('RGBA'),(360*(i+1),0))
    s.save('/tmp/blend/out/%s_porownanie.png'%n);print('PODGLAD',n)

# -*- coding: utf-8 -*-
"""Renders fotorrealistas (Blender Cycles) do Sobrado Opção B.
Uso:  blender -b -P render.py -- --views fachada,estar [--cut 0|1|2] [--sky dia|entardecer] [--samples 160] [--res 1600x900] [--save]
Lê cena/cena.json + cena.bin (node exportar_cena.mjs) e os assets CC0 do Poly Haven (python baixar_assets.py)."""
import bpy, bmesh, json, os, sys, math, random
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(HERE, "assets")
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default):
    return argv[argv.index(name) + 1] if name in argv else default
VIEWS = arg("--views", "fachada").split(","); CUT = int(arg("--cut", "0")); SKY = arg("--sky", "dia")
SAMPLES = int(arg("--samples", "160")); RES = [int(v) for v in arg("--res", "1600x900").split("x")]; SAVE = "--save" in argv
CUTZ = [None, 1.75, 4.6][CUT]; NIGHT = SKY == "entardecer"
random.seed(7)

# vistas: posição do olho e alvo em coordenadas de planta (u leste, v sul, z altura) + abertura vertical em graus
CAMS = {
    "fachada": ((5.2, -6.6, 1.65), (4.0, 3, 3.1), 50), "fachada_lado": ((-3.2, -6.2, 1.7), (4.2, 3, 2.9), 50), "aerea": ((-8, -12, 9.5), (4.1, 8, 2.2), 38),
    "fundos": ((13.5, 26, 8), (4, 13, 2), 40), "garagem": ((2.75, 8.3, 1.55), (6.3, 4.4, .75), 62), "garagem2": ((7.75, 8.3, 1.6), (3.6, 4.2, .7), 62),
    "hall": ((1.45, 4.5, 1.7), (1.6, 10, 1.3), 60), "jantar": ((1.75, 9.1, 1.75), (4.6, 11.4, 1.0), 62), "estar": ((4.4, 11.8, 1.7), (.9, 14.6, .9), 62),
    "estar2": ((.6, 9.3, 1.7), (3.4, 15.2, 1.0), 62), "cozinha": ((5.4, 14.4, 1.7), (7.7, 10.8, 1.05), 64), "deck": ((.5, 17.6, 1.6), (5, 15.4, 1.2), 62),
    "suite": ((1.9, 6.4, 4.6), (6.1, 4.3, 3.7), 62), "escritorio": ((2.9, 10.9, 4.6), (1.2, 15.2, 3.7), 62), "quarto2": ((3.7, 12.3, 4.6), (6.3, 14.3, 3.6), 62),
    "iso_terreo": ((-6, 24, 14), (4.1, 9, 0), 36), "iso_superior": ((-6, 24, 16), (3.6, 9, 3), 36),
}

# ------------------------------------------------------------------ cena
bpy.ops.wm.read_factory_settings(use_empty=True)
scn = bpy.context.scene; col = scn.collection
scn.render.engine = 'CYCLES'; cy = scn.cycles
try:
    pr = bpy.context.preferences.addons['cycles'].preferences
    for t in ('OPTIX', 'CUDA'):
        try:
            pr.compute_device_type = t; pr.get_devices()
            if any(d.type == t for d in pr.devices):
                for d in pr.devices: d.use = d.type == t
                cy.device = 'GPU'; print("GPU:", t, [d.name for d in pr.devices if d.use]); break
        except Exception as e: print("sem", t, e)
except Exception as e: print("CPU", e)
cy.samples = SAMPLES; cy.use_denoising = True; cy.use_adaptive_sampling = True; cy.adaptive_threshold = .02
cy.max_bounces = 10; cy.diffuse_bounces = 5; cy.glossy_bounces = 5; cy.transmission_bounces = 10; cy.transparent_max_bounces = 24; cy.sample_clamp_indirect = 8; cy.caustics_reflective = False; cy.caustics_refractive = False
scn.render.resolution_x, scn.render.resolution_y = RES; scn.render.image_settings.file_format = 'PNG'
scn.view_settings.view_transform = 'AgX'
try: scn.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass

# ------------------------------------------------------------------ materiais
TEX = os.path.join(A, "tex"); _img = {}
def image(tex, kind, srgb):
    d = os.path.join(TEX, tex)
    for f in os.listdir(d):
        if f.startswith(kind + "."):
            k = (tex, kind)
            if k not in _img:
                _img[k] = bpy.data.images.load(os.path.join(d, f)); _img[k].colorspace_settings.name = 'sRGB' if srgb else 'Non-Color'
            return _img[k]
    return None

def base(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree, m.node_tree.nodes['Principled BSDF']

def P(name, color, rough=.5, metal=0, **kw):
    m, nt, b = base(name); b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m

def pbr(name, tex, size, color=None, tint=None, rough=None, rot=0, bump=1.0, rough_add=0):
    """textura fotográfica em projeção de caixa (coordenadas do mundo, 'size' metros por repetição)"""
    m, nt, b = base(name); N = nt.nodes; L = nt.links
    tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1 / size,) * 3; mp.inputs['Rotation'].default_value = (rot, rot, rot) if False else (0, 0, rot)
    L.new(tc.outputs['Object'], mp.inputs['Vector'])
    def tx(kind, srgb):
        im = image(tex, kind, srgb)
        if not im: return None
        n = N.new('ShaderNodeTexImage'); n.image = im; n.projection = 'BOX'; n.projection_blend = .2; L.new(mp.outputs['Vector'], n.inputs['Vector']); return n
    d = tx("diff", True)
    if color: b.inputs['Base Color'].default_value = (*color, 1)
    elif d and tint:
        mx = N.new('ShaderNodeMixRGB'); mx.blend_type = 'MULTIPLY'; mx.inputs['Fac'].default_value = 1; mx.inputs['Color2'].default_value = (*tint, 1); L.new(d.outputs['Color'], mx.inputs['Color1']); L.new(mx.outputs['Color'], b.inputs['Base Color'])
    elif d: L.new(d.outputs['Color'], b.inputs['Base Color'])
    r = tx("rough", False)
    if rough is not None: b.inputs['Roughness'].default_value = rough
    elif r:
        if rough_add:
            ma = N.new('ShaderNodeMath'); ma.operation = 'ADD'; ma.use_clamp = True; ma.inputs[1].default_value = rough_add; L.new(r.outputs['Color'], ma.inputs[0]); L.new(ma.outputs[0], b.inputs['Roughness'])
        else: L.new(r.outputs['Color'], b.inputs['Roughness'])
    n = tx("nor", False)
    if n:
        nm = N.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = bump; L.new(n.outputs['Color'], nm.inputs['Color']); L.new(nm.outputs['Normal'], b.inputs['Normal'])
    return m

def wood_v(name, tex, size, tint):
    """tábuas na vertical: troca os eixos da projeção de caixa"""
    m = pbr(name, tex, size, tint=tint); nt = m.node_tree; N = nt.nodes; L = nt.links; mp = next(n for n in N if n.type == 'MAPPING'); tc = next(n for n in N if n.type == 'TEX_COORD')
    sp = N.new('ShaderNodeSeparateXYZ'); cb = N.new('ShaderNodeCombineXYZ'); ad = N.new('ShaderNodeMath'); ad.operation = 'ADD'
    L.new(tc.outputs['Object'], sp.inputs[0]); L.new(sp.outputs['X'], ad.inputs[0]); L.new(sp.outputs['Y'], ad.inputs[1]); L.new(sp.outputs['Z'], cb.inputs['X']); L.new(sp.outputs['Z'], cb.inputs['Y']); L.new(ad.outputs[0], cb.inputs['Z'])
    L.new(cb.outputs[0], mp.inputs['Vector']); return m

def grass(name, c1, c2, scale):
    m = pbr(name, "leafy_grass", 2.5, color=c1, rough=1, bump=1.5); nt = m.node_tree; N = nt.nodes; L = nt.links; b = N['Principled BSDF']
    tc = next(n for n in N if n.type == 'TEX_COORD'); no = N.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = scale; no.inputs['Detail'].default_value = 6; L.new(tc.outputs['Object'], no.inputs['Vector'])
    cr = N.new('ShaderNodeValToRGB'); e = cr.color_ramp.elements; e[0].position = .35; e[0].color = (*c1, 1); e[1].position = .7; e[1].color = (*c2, 1); L.new(no.outputs['Fac'], cr.inputs['Fac']); L.new(cr.outputs['Color'], b.inputs['Base Color']); return m

def glass(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links; N.remove(N['Principled BSDF']); out = N['Material Output']
    g = N.new('ShaderNodeBsdfGlass'); g.inputs['Roughness'].default_value = 0; g.inputs['IOR'].default_value = 1.45; g.inputs['Color'].default_value = (.93, .97, .96, 1)
    t = N.new('ShaderNodeBsdfTransparent'); t.inputs['Color'].default_value = (.9, .95, .94, 1)
    lp = N.new('ShaderNodeLightPath'); mx = N.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'; L.new(lp.outputs['Is Shadow Ray'], mx.inputs[0]); L.new(lp.outputs['Is Diffuse Ray'], mx.inputs[1])
    ms = N.new('ShaderNodeMixShader'); L.new(mx.outputs[0], ms.inputs['Fac']); L.new(g.outputs[0], ms.inputs[1]); L.new(t.outputs[0], ms.inputs[2]); L.new(ms.outputs[0], out.inputs['Surface']); return m

def emit(name, color, strength):
    m, nt, b = base(name); b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Emission Color'].default_value = (*color, 1); b.inputs['Emission Strength'].default_value = strength; return m

def art(name, cols):
    m, nt, b = base(name); N = nt.nodes; L = nt.links; no = N.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = 1.6; no.inputs['Detail'].default_value = 3; no.inputs['Distortion'].default_value = 2.5
    cr = N.new('ShaderNodeValToRGB'); e = cr.color_ramp.elements; e[0].position = .32; e[0].color = (*cols[0], 1); e[1].position = .62; e[1].color = (*cols[1], 1); k = e.new(.47); k.color = (*cols[2], 1)
    L.new(no.outputs['Fac'], cr.inputs['Fac']); L.new(cr.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .85; return m

def fabric(name, color):
    return pbr(name, "fabric_pattern_07", .35, color=color, rough=.95, bump=.6)

LAMP = 30 if NIGHT else 22
def make_material(name, info):
    hx = info["color"]; c = tuple((int(hx[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
    T = {
        "reboco": lambda: pbr(name, "painted_plaster_wall", 2.2, color=(.86, .85, .82), rough=.85, bump=.35),
        "rebocoCinza": lambda: pbr(name, "painted_plaster_wall", 2.2, color=(.5, .5, .49), rough=.85, bump=.35),
        "grafite": lambda: pbr(name, "painted_plaster_wall", 2.2, color=(.045, .048, .055), rough=.6, bump=.3),
        "branco": lambda: P(name, (.88, .88, .86), .55), "bloco": lambda: pbr(name, "painted_plaster_wall", 2.2, color=(.62, .61, .58), rough=.9, bump=.5),
        "pedra": lambda: pbr(name, "stacked_stone_wall", 1.3), "paver": lambda: pbr(name, "rectangular_paving", 1.6), "concreto": lambda: pbr(name, "concrete_floor_02", 3.0, color=(.5, .5, .48), bump=.6),
        "lajeTopo": lambda: pbr(name, "gravel_concrete", 2.0), "porcelanato": lambda: pbr(name, "marble_01", 2.4, rough=.12, bump=.1),
        "pisoMadeira": lambda: pbr(name, "laminate_floor_02", 2.0, rough_add=-.1), "deck": lambda: pbr(name, "wood_floor_deck", 1.6),
        "madeira": lambda: wood_v(name, "brown_planks_05", 1.4, (.95, .6, .36)), "madeiraClara": lambda: pbr(name, "laminate_floor_02", .9, tint=(1.25, 1.15, 1.0)),
        "grama": lambda: grass(name, (.09, .2, .035), (.16, .28, .06), 1.3), "soja": lambda: grass(name, (.05, .15, .03), (.1, .22, .05), 6), "cercaViva": lambda: grass(name, (.03, .1, .02), (.07, .16, .04), 9),
        "vidro": lambda: glass(name), "vidroEscuro": lambda: P(name, (.01, .012, .015), .04, 0, **{"Specular IOR Level": .8}),
        "lampada": lambda: emit(name, (1, .86, .68), LAMP), "led": lambda: emit(name, (1, .84, .62), LAMP * 1.6), "abajur": lambda: emit(name, (1, .8, .55), 3 if NIGHT else 1.2),
        "farol": lambda: P(name, (.9, .9, .88), .05, .6), "lanterna": lambda: P(name, (.5, .01, .01), .15), "preto": lambda: P(name, (.012, .012, .013), .4, .6), "rufo": lambda: P(name, (.04, .042, .046), .45, .8),
        "inox": lambda: P(name, (.72, .73, .74), .22, 1), "roda": lambda: P(name, (.62, .63, .65), .28, 1), "pneu": lambda: P(name, (.012, .012, .012), .85),
        "louca": lambda: P(name, (.9, .9, .89), .08), "bancada": lambda: P(name, (.012, .012, .014), .14), "vaso": lambda: P(name, (.82, .8, .74), .35), "cobre": lambda: P(name, (.72, .43, .26), .3, 1),
        "corsaPrata": lambda: P(name, (.42, .44, .46), .3, .9, **{"Coat Weight": 1.0, "Coat Roughness": .04}), "ceratoBranco": lambda: P(name, (.86, .87, .88), .35, 0, **{"Coat Weight": 1.0, "Coat Roughness": .03}),
        "tecido": lambda: fabric(name, (.25, .31, .36)), "tecidoClaro": lambda: fabric(name, (.78, .75, .68)), "tecidoCinza": lambda: fabric(name, (.16, .17, .19)), "colchao": lambda: fabric(name, (.88, .87, .84)),
        "cortina": lambda: fabric(name, (.8, .77, .7)), "almofada1": lambda: fabric(name, (.55, .16, .07)), "almofada2": lambda: fabric(name, (.08, .15, .11)),
        "quadro1": lambda: art(name, ((.3, .42, .36), (.85, .8, .68), (.1, .13, .14))), "quadro2": lambda: art(name, ((.7, .33, .12), (.9, .84, .7), (.15, .1, .08))), "quadro3": lambda: art(name, ((.05, .12, .22), (.8, .8, .76), (.5, .28, .12))),
        "lixoAzul": lambda: P(name, (.03, .16, .42), .45),
    }
    return T[name]() if name in T else P(name, c, info.get("rough", .6), info.get("metal", 0))

# ------------------------------------------------------------------ geometria exportada
D = json.load(open(os.path.join(HERE, "cena", "cena.json"), encoding="utf-8")); BIN = np.fromfile(os.path.join(HERE, "cena", "cena.bin"), dtype=np.float32)
for e in D["meshes"]:
    a = BIN[e["offset"] // 4: e["offset"] // 4 + e["count"] * 6].reshape(-1, 6); n = len(a)
    me = bpy.data.meshes.new(e["mat"]); me.vertices.add(n); me.loops.add(n); me.polygons.add(n // 3)
    me.vertices.foreach_set("co", a[:, :3].ravel()); me.loops.foreach_set("vertex_index", np.arange(n, dtype=np.int32))
    me.polygons.foreach_set("loop_start", np.arange(0, n, 3, dtype=np.int32)); me.polygons.foreach_set("loop_total", np.full(n // 3, 3, dtype=np.int32)); me.update()
    if CUTZ is None:
        me.polygons.foreach_set("use_smooth", np.ones(n // 3, dtype=bool)); me.normals_split_custom_set_from_vertices(a[:, 3:].tolist())
    else:
        bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, CUTZ), plane_no=(0, 0, 1), clear_outer=True); bm.to_mesh(me); bm.free()
    me.materials.append(make_material(e["mat"], e)); ob = bpy.data.objects.new(e["mat"], me); col.objects.link(ob)
    if e["mat"] in ("lampada", "led"): ob.visible_camera = True
if CUTZ is not None:   # paredes cortadas preenchidas em preto, como em planta baixa
    vs, fs = [], []
    for k in D["caps"]:
        if k[4] < CUTZ < k[5]:
            x0, x1 = sorted((k[0], k[2])); y0, y1 = sorted((k[1], k[3])); i = len(vs); z = CUTZ - .003
            vs += [(x0, -y0, z), (x1, -y0, z), (x1, -y1, z), (x0, -y1, z)]; fs.append((i, i + 3, i + 2, i + 1))
    me = bpy.data.meshes.new("poche"); me.from_pydata(vs, [], fs); me.materials.append(P("poche", (.008, .008, .009), .9)); col.objects.link(bpy.data.objects.new("poche", me))

# ------------------------------------------------------------------ modelos (Poly Haven)
_models = {}
def model(name):
    """importa o glTF uma vez e devolve (malha única, tamanho, centro xy, z mínimo)"""
    if name in _models: return _models[name]
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=os.path.join(A, "models", name, name + ".gltf")); new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == 'MESH']
    names = [o.name for o in new]
    for o in meshes:
        mw = o.matrix_world.copy(); o.parent = None; o.data.transform(mw); o.matrix_world = Matrix.Identity(4)
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1: bpy.ops.object.join()
    ob = meshes[0]; me = ob.data
    for nm in names:
        if nm != ob.name and nm in bpy.data.objects: bpy.data.objects.remove(bpy.data.objects[nm])
    co = np.empty(len(me.vertices) * 3, dtype=np.float32); me.vertices.foreach_get("co", co); co = co.reshape(-1, 3); lo, hi = co.min(0), co.max(0)
    for c in ob.users_collection: c.objects.unlink(ob)
    _models[name] = (me, hi - lo, ((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2), lo[2]); return _models[name]

def place(name, x, y, z, yaw=0, scale=1.0):
    me, size, cxy, zmin = model(name); ob = bpy.data.objects.new(name, me); col.objects.link(ob)
    ob.matrix_world = Matrix.Translation((x, y, z)) @ Matrix.Rotation(yaw, 4, 'Z') @ Matrix.Scale(scale, 4) @ Matrix.Translation((-cxy[0], -cxy[1], -zmin)); return ob

def soft(name, mat, x0, y0, z0, x1, y1, z1, M4, bevel=.045):
    me = bpy.data.meshes.new(name); me.from_pydata([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], [], [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)])
    me.polygons.foreach_set("use_smooth", [True] * 6); me.materials.append(mat); ob = bpy.data.objects.new(name, me); col.objects.link(ob); ob.matrix_world = M4
    if bevel:
        bv = ob.modifiers.new("b", 'BEVEL'); bv.width = bevel; bv.segments = 5; ob.modifiers.new("w", 'WEIGHTED_NORMAL').keep_sharp = False
    return ob
_mats = {}
def mm(key, f):
    if key not in _mats: _mats[key] = f()
    return _mats[key]
def modern_sofa(cx, cy, z, yaw, L, dep, dark=False):
    fab = mm("sofa" + str(dark), lambda: fabric("sofa_tecido" + str(dark), (.12, .13, .15) if dark else (.42, .41, .38))); leg = mm("leg", lambda: P("sofa_pe", (.02, .02, .02), .4, .7))
    p1 = mm("p1", lambda: fabric("almofada_terracota", (.5, .15, .06))); p2 = mm("p2", lambda: fabric("almofada_verde", (.07, .14, .1)))
    M4 = Matrix.Translation((cx, cy, z)) @ Matrix.Rotation(yaw, 4, 'Z'); h = L / 2; d = dep / 2; arm = .15; n = max(1, round((L - 2 * arm) / .8)); w = (L - 2 * arm) / n
    for sx in (-1, 1):
        for sy in (-1, 1): soft("pe", leg, sx * (h - .1) - .02, sy * (d - .1) - .02, 0, sx * (h - .1) + .02, sy * (d - .1) + .02, .1, M4, 0)
    soft("base", fab, -h + .01, -d + .03, .1, h - .01, d, .27, M4, .02); soft("enc", fab, -h + arm, d - .17, .25, h - arm, d, .8, M4, .05)
    for sx in (-1, 1): soft("braco", fab, min(sx * h, sx * (h - arm)), -d, .1, max(sx * h, sx * (h - arm)), d, .6, M4, .05)
    for i in range(n):
        x0 = -h + arm + i * w; soft("assento", fab, x0 + .008, -d, .27, x0 + w - .008, d - .15, .45, M4, .06); soft("costas", fab, x0 + .012, d - .36, .44, x0 + w - .012, d - .16, .86, M4, .07)
    for i, (px, pm) in enumerate(((-h + arm + .28, p1), (h - arm - .28, p2))):
        soft("almofada", pm, -.21, -.07, -.21, .21, .07, .21, M4 @ Matrix.Translation((px, d - .42, .68)) @ Matrix.Rotation(.35, 4, 'X') @ Matrix.Rotation(.2 * (1 if i else -1), 4, 'Y'), .065)
def cyl(name, mat, x, y, z0, z1, r0, r1, seg=28):
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r0, radius2=r1, depth=z1 - z0); me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    me.materials.append(mat); ob = bpy.data.objects.new(name, me); col.objects.link(ob); ob.location = (x, y, (z0 + z1) / 2); return ob
def stool(x, y, z):
    wd = mm("stw", lambda: pbr("banqueta_madeira", "laminate_floor_02", .6, tint=(1.2, 1.1, .95))); mt = mm("leg", lambda: P("sofa_pe", (.02, .02, .02), .4, .7))
    cyl("assento", wd, x, y, z + .62, z + .67, .17, .17); cyl("haste", mt, x, y, z + .02, z + .62, .022, .022, 12); cyl("base", mt, x, y, z, z + .02, .18, .17); cyl("apoio", mt, x, y, z + .24, z + .255, .13, .13)
YAW = {"n": 0, "s": math.pi, "w": math.pi / 2, "e": -math.pi / 2}      # lado do encosto -> rotação (frente do modelo = -Y)
FIX = {}                                                               # correção de frente por modelo, se precisar
def yaw_of(m, back): return YAW[back] + FIX.get(m, 0)
k = 0
for a in D["assets"]:
    if CUTZ is not None and a["z"] > CUTZ: continue
    k += 1
    if a["kind"] == "sofa":
        L = (a["u1"] - a["u0"]) if a["back"] in "ns" else (a["v1"] - a["v0"]); dep = (a["v1"] - a["v0"]) if a["back"] in "ns" else (a["u1"] - a["u0"])
        cx, cy = (a["u0"] + a["u1"]) / 2, (a["v0"] + a["v1"]) / 2
        if L > 1.4: modern_sofa(cx, -cy, a["z"], YAW[a["back"]], L, max(.85, min(dep, .95)), dark=a["z"] > 2)
        else:
            m = "modern_arm_chair_01"; _, size, _, _ = model(m); place(m, cx, -cy, a["z"], yaw_of(m, a["back"]), min(1.0, (L + .15) / size[0]))
    elif a["kind"] == "car":   # modelo real do carro, se o arquivo existir em assets/cars
        f = a["file"]; before = set(bpy.data.objects); ext = f.rsplit(".", 1)[-1].lower()
        if ext in ("glb", "gltf"): bpy.ops.import_scene.gltf(filepath=f)
        elif ext == "fbx": bpy.ops.import_scene.fbx(filepath=f)
        else: bpy.ops.wm.obj_import(filepath=f)
        new = [o for o in bpy.data.objects if o not in before]; roots = [o for o in new if o.parent is None]; pts = [o.matrix_world @ Vector(c) for o in new if o.type == 'MESH' for c in o.bound_box]
        lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts))); hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
        along_y = (hi.y - lo.y) >= (hi.x - lo.x); sc = a["L"] / max(hi.x - lo.x, hi.y - lo.y); yaw = (0 if along_y else math.pi / 2) + math.radians(float(arg("--car-yaw", "0")))
        M4 = Matrix.Translation((a["u"], -a["v"], 0)) @ Matrix.Rotation(yaw, 4, 'Z') @ Matrix.Scale(sc, 4) @ Matrix.Translation((-(lo.x + hi.x) / 2, -(lo.y + hi.y) / 2, -lo.z))
        for o in roots: o.matrix_world = M4 @ o.matrix_world
    elif a["kind"] == "chair": place("dining_chair_02", a["u"], -a["v"], a["z"], yaw_of("dining_chair_02", a["back"]))
    elif a["kind"] == "stool": stool(a["u"], -a["v"], a["z"])
    elif a["kind"] == "coffee":
        _, size, _, _ = model("modern_coffee_table_01"); w, d = a["u1"] - a["u0"], a["v1"] - a["v0"]
        place("modern_coffee_table_01", (a["u0"] + a["u1"]) / 2, -(a["v0"] + a["v1"]) / 2, a["z"], 0 if w >= d else math.pi / 2, min(1.2, max(w, d) / max(size[0], size[1])))
    elif a["kind"] == "pot":
        if a["s"] < .75: m, h = "potted_plant_04", .28
        elif a["plant"] == "banana": m, h = ("potted_plant_01", 1.25) if k % 2 else ("potted_plant_02", 1.1)
        else: m, h = "potted_plant_02", .8
        _, size, _, _ = model(m); place(m, a["u"], -a["v"], a["z"], k * 2.1, h * (a["s"] if a["s"] < .75 else 1) / size[2] * (1.8 if a["s"] < .75 else 1))
# vegetação externa
for i, v in enumerate(D["veg"]):
    kind, s = v["kind"], v["s"]
    if kind == "tree":
        if CUTZ is not None: continue
        m, h = ("tree_small_02", 4.6 * s) if i % 2 else ("island_tree_02", 5.2 * s)
    elif kind == "shrub": m, h = ("shrub_01", "shrub_02", "shrub_04")[i % 3], 1.25 * s
    elif kind == "capim": m, h = ("shrub_04", "shrub_02")[i % 2], .55 * s
    else: m, h = "potted_plant_01", 1.2 * s
    _, size, _, _ = model(m); place(m, v["x"], -v["y"], v.get("z", 0), i * 1.7, h / size[2])
# grama em fios nos canteiros do lote
gm = P("fio_grama", (.09, .2, .04), .7)
for i, g in enumerate(D["grass"]):
    x0, y0, x1, y1 = g[:4]; me = bpy.data.meshes.new("canteiro"); me.from_pydata([(x0, -y0, .035), (x1, -y0, .035), (x1, -y1, .035), (x0, -y1, .035)], [], [(0, 3, 2, 1)])
    me.materials.append(gm); ob = bpy.data.objects.new("canteiro", me); col.objects.link(ob); ps = ob.modifiers.new("grama", 'PARTICLE_SYSTEM').particle_system.settings
    ps.type = 'HAIR'; ps.count = int(abs(x1 - x0) * abs(y1 - y0) * 900); ps.hair_length = .09; ps.child_type = 'INTERPOLATED'; ps.rendered_child_count = 12; ps.child_length = .9; ps.length_random = .6
    ps.brownian_factor = .03; ps.roughness_2 = .04; ps.clump_factor = .2; ps.root_radius = .5; ps.tip_radius = .05; ps.radius_scale = .004; ob.show_instancer_for_render = False

# ------------------------------------------------------------------ céu
w = bpy.data.worlds.new("ceu"); scn.world = w; w.use_nodes = True; N = w.node_tree.nodes; L = w.node_tree.links; bg = N['Background']
env = N.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(os.path.join(A, "hdri", ("qwantani_dusk_2_puresky" if NIGHT else "kloofendal_48d_partly_cloudy_puresky") + ".hdr"))
tc = N.new('ShaderNodeTexCoord'); mp = N.new('ShaderNodeMapping'); mp.inputs['Rotation'].default_value = (0, 0, math.radians(float(arg("--rot", "200" if not NIGHT else "70"))))
L.new(tc.outputs['Generated'], mp.inputs['Vector']); L.new(mp.outputs['Vector'], env.inputs['Vector']); L.new(env.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = float(arg("--sky-strength", "1.0" if not NIGHT else "0.45"))
EXPO = float(arg("--exposure", "0" if not NIGHT else "0.9")); INTERIOR = {"garagem": 1.6, "garagem2": 1.6, "hall": 1.5, "jantar": 1.5, "estar": 1.5, "estar2": 1.5, "cozinha": 1.5, "suite": 1.0, "escritorio": 1.0, "quarto2": 1.0}

# ------------------------------------------------------------------ câmeras e render
out = os.path.join(HERE, "renders"); os.makedirs(out, exist_ok=True)
cam = bpy.data.cameras.new("cam"); co = bpy.data.objects.new("cam", cam); col.objects.link(co); scn.camera = co; cam.clip_start = .05; cam.clip_end = 2000
for v in VIEWS:
    if v.startswith("planta"):
        cam.type = 'ORTHO'; cam.ortho_scale = 19.6; co.location = (4.125, -9.0, 40); co.rotation_euler = (0, 0, 0)
    else:
        p, t, fov = CAMS[v]; cam.type = 'PERSP'; cam.sensor_fit = 'VERTICAL'; cam.angle_y = math.radians(fov); co.location = (p[0], -p[1], p[2])
        co.rotation_euler = (Vector((t[0], -t[1], t[2])) - co.location).to_track_quat('-Z', 'Y').to_euler()
    scn.view_settings.exposure = EXPO + (INTERIOR.get(v, 0) if not NIGHT else INTERIOR.get(v, 0) * .4)
    scn.render.filepath = os.path.join(out, v + ("_entardecer" if NIGHT else "") + ".png"); bpy.ops.render.render(write_still=True); print("RENDER OK", v)
if SAVE: bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "cena", "sobrado_opcao_B.blend"))

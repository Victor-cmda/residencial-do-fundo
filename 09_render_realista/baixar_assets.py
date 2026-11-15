# -*- coding: utf-8 -*-
"""Baixa do Poly Haven (polyhaven.com, licença CC0) as texturas, o céu HDRI e os modelos usados nos renders.
Uso: python baixar_assets.py   -> grava em ./assets  (pula o que já existe)"""
import json, os, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(HERE, "assets")
UA = {"User-Agent": "residencial-render/1.0"}
TEXTURES = ["painted_plaster_wall", "laminate_floor_02", "wood_floor_deck", "brown_planks_05", "stacked_stone_wall", "concrete_block_wall_02",
            "rectangular_paving", "concrete_floor_02", "leafy_grass", "gravel_concrete", "marble_01", "fabric_pattern_07"]
HDRIS = ["kloofendal_48d_partly_cloudy_puresky", "qwantani_dusk_2_puresky"]
MODELS = ["sofa_03", "sofa_02", "modern_arm_chair_01", "dining_chair_02", "modern_coffee_table_01", "bar_chair_round_01", "potted_plant_01", "potted_plant_02",
          "potted_plant_04", "calathea_orbifolia_01", "pachira_aquatica_01", "shrub_01", "shrub_02", "shrub_04", "tree_small_02", "island_tree_02", "grass_medium_01",
          "side_table_01", "book_encyclopedia_set_01", "ceramic_vase_03", "Television_01"]


def get(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())


def files(aid):
    with urllib.request.urlopen(urllib.request.Request("https://api.polyhaven.com/files/" + aid, headers=UA), timeout=60) as r:
        return json.load(r)


def pick(d, *res):
    for k in res:
        if k in d:
            return d[k]
    return d[sorted(d)[0]]


for t in TEXTURES:
    try:
        f = files(t); out = os.path.join(A, "tex", t); done = []
        for key, short in (("Diffuse", "diff"), ("nor_gl", "nor"), ("Rough", "rough")):
            if key in f:
                e = pick(f[key], "2k", "1k"); fmt = "jpg" if "jpg" in e else sorted(e)[0]
                get(e[fmt]["url"], os.path.join(out, f"{short}.{fmt}")); done.append(short)
        print("tex", t, done)
    except Exception as ex:
        print("FALHOU tex", t, ex)
for h in HDRIS:
    try:
        e = pick(files(h)["hdri"], "2k", "1k"); get(e["hdr"]["url"], os.path.join(A, "hdri", h + ".hdr")); print("hdri", h)
    except Exception as ex:
        print("FALHOU hdri", h, ex)
for m in MODELS:
    try:
        e = pick(files(m)["gltf"], "1k", "2k")["gltf"]; out = os.path.join(A, "models", m)
        get(e["url"], os.path.join(out, m + ".gltf"))
        for rel, inc in e.get("include", {}).items():
            get(inc["url"], os.path.join(out, rel.replace("/", os.sep)))
        print("model", m, len(e.get("include", {})))
    except Exception as ex:
        print("FALHOU model", m, ex)

# -*- coding: utf-8 -*-
"""Gera todos os renders finais em ./renders (leva alguns minutos com placa de vídeo).  Uso: python renderizar_tudo.py"""
import subprocess, os, glob, sys
HERE = os.path.dirname(os.path.abspath(__file__))
BL = (glob.glob(r"C:\Program Files\Blender Foundation\Blender*\blender.exe") or ["blender"])[-1]
subprocess.run(["node", os.path.join(HERE, "exportar_cena.mjs")], check=True)
JOBS = [
    ["--views", "fachada,fachada_lado,aerea,fundos,garagem,garagem2,hall,jantar,estar,estar2,cozinha,deck,suite,escritorio,quarto2", "--res", "1920x1080", "--save"],
    ["--views", "planta_terreo", "--cut", "1", "--res", "1400x2200"], ["--views", "iso_terreo", "--cut", "1", "--res", "1920x1080"],
    ["--views", "planta_superior", "--cut", "2", "--res", "1400x2200"], ["--views", "iso_superior", "--cut", "2", "--res", "1920x1080"],
    ["--views", "fachada,aerea,estar,jantar", "--sky", "entardecer", "--res", "1920x1080"],
]
for j in JOBS:
    r = subprocess.run([BL, "-b", "-P", os.path.join(HERE, "render.py"), "--", "--samples", "220"] + j + sys.argv[1:], capture_output=True, text=True, errors="ignore")
    print(" ".join(j[:2]), "->", [l for l in r.stdout.splitlines() if "RENDER OK" in l or "Error" in l or "Traceback" in l][-20:], flush=True)

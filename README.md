# Residencial do Fundo

Projeto de condomínio no fundo de um terreno na Av. Fiorino Brol, Foz do Iguaçu – PR. Inclui plantas, maquetes 3D navegáveis e renders realistas.

## Como abrir (Mac, Windows ou Linux)

Não é preciso instalar nada.

1. Baixe o projeto: no GitHub, clique em **Code → Download ZIP** e descompacte o arquivo. Ou rode `git clone` com o endereço do repositório.
2. Dê dois cliques em **`ABRIR.html`**. Ela é a página inicial, com links para tudo.

Tudo funciona sem internet e sem servidor. Use Chrome ou Safari.

| O quê | Arquivo |
|---|---|
| Maquete 3D do condomínio inteiro | `contexto-3d/maquete/index.html` |
| Maquete 3D do Sobrado Opção B | `08_sobrado_opcao_B_3d/index.html` |
| Galeria de renders | `09_render_realista/galeria.html` |
| Plantas do condomínio (+ PDF A1) | `06_plantas/` |
| Planta do Sobrado Opção B (+ PDF A1) | `07_sobrado_opcao_B/` |
| Implantação 2 (croqui de 15/11/2026): maquete 3D | `10_implantacao_2/maquete/index.html` |
| Implantação 2: plantas (+ PDF A1) | `10_implantacao_2/plantas/` |

**Navegação nas maquetes:** use o menu de vistas para ir direto a cada ponto. No modo caminhando, mova-se com W A S D ou com as setas (Shift corre) e olhe em volta com o mouse.

## Para quem for editar

As páginas `index.html` das maquetes já estão prontas. Só é preciso gerá-las de novo se mudar algo em `src/`. Para isso, você precisa do Node.js 18 ou mais novo:

```sh
cd contexto-3d/maquete
npm install
node build.mjs                          # maquete do condomínio
node ../../08_sobrado_opcao_B_3d/build.mjs   # maquete do sobrado
node ../../10_implantacao_2/maquete/build.mjs   # maquete da implantação 2
```

Os scripts das plantas precisam do Python 3:

```sh
python3 06_plantas/gerar_plantas.py
python3 07_sobrado_opcao_B/gerar_opcao_b.py
python3 10_implantacao_2/plantas/gerar_plantas_2.py
```

Os arquivos de cena do Blender (`09_render_realista/cena`, `assets`) não estão no repositório porque são grandes demais. Os renders prontos estão em `09_render_realista/renders`.

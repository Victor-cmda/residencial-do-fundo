# Contexto para gerar a maquete 3D navegável do "Residencial do Fundo"

## O que preciso
Criar do zero uma **maquete 3D navegável em tempo real** do projeto cuja planta você acabou de fazer. Ela deve seguir **exatamente a planta**: implantação, plantas baixas, fachadas e medidas.

O resultado tem de parecer **realista, como um projeto de arquitetura, e não um jogo**. Isso pede:
- materiais com textura e relevo;
- sol físico e sombras suaves;
- oclusão de ambiente;
- vegetação densa;
- muitos detalhes construtivos: caixilhos, rufos, ripados, meio-fio, luminárias, carros e mobiliário.

## Requisitos
1. **Fidelidade à planta.** Use as mesmas cotas da planta para:
   - lotes, kitnets, servidão, ruas, retorno e muros;
   - paredes, portas e janelas das casas e kitnets (as fachadas precisam bater com as plantas baixas);
   - garagens, piscinas, decks, jardins e calçadas.
2. **Navegação:**
   - **Girar** (órbita), com clique duplo para ir até um ponto.
   - **Caminhar** em 1ª pessoa, na altura dos olhos (1,65 m): WASD ou setas para andar, mouse para olhar, Shift para correr, colisão com paredes e muros, e joystick na tela no celular.
   - Lista **Ir para** com pontos de vista: visão geral, planta de cima, os 4 lotes, quintais, portaria, rua das kitnets, frente de uma kitnet, praça, rua dos lotes e frente de cada casa (lotes 1 a 4).
   - Se possível, **entrar nas casas e kitnets** e ver os interiores com mobília básica, seguindo as plantas baixas.
3. **Luz:**
   - Controle de **hora do dia** (6h–19h30), com o sol calculado para Foz do Iguaçu (latitude −25,5°) em novembro.
   - À noite, acendem luminárias, fitas de LED e janelas.
4. **Qualidade:** opção **Alta** (oclusão de ambiente, sombras de alta resolução) e **Leve** (para celular).
5. **Rótulos** que liga e desliga, com o nome de cada elemento (Lote 1 · Sobrado, Kitnet 7, Servidão…).
6. **Entrega:** uma página web que abra no navegador, no computador e no celular.

## Dados do terreno (resumo; os detalhes estão em `referencias/CONTEXTO_planta.md`)
- **Local:** Av. Fiorino Brol, Foz do Iguaçu – PR.
- **Terreno:** 34 × 180 m. O projeto ocupa o fundo, com 33 × 80 m.
- **Primeiros 100 m:** casa do proprietário já existente, com muitas árvores e bananeiras. Há um acesso de paver de 5 m pelo lado esquerdo.
- **Divisas do fundo:**
  - à esquerda e no fundo, plantação de soja, onde entra muro novo;
  - à direita, o muro de bloco do vizinho, que já existe (~2,8 m, com cerca elétrica e postes de concreto). Do outro lado dele há um lote de terra com um barracão comprido.
- **Ao longe:** linhas de transmissão de alta tensão (aparecem nas fotos do pôr do sol).
- **Solo:** terra roxa, terreno plano.
- **Demolição:** o galpão de lona preta do fundo será derrubado e não entra na maquete do projeto.

## Linguagem visual pedida pelo proprietário
- **Kitnets modernas com garagem:**
  - platibanda reta e reboco claro, com detalhes em grafite;
  - ripado de madeira e esquadrias pretas;
  - vaga coberta;
  - jardim de entrada;
  - mureta com número.
- **Lote 1, sobrado "muito bonito":**
  - volume em balanço sobre a garagem;
  - guarda-corpo de vidro;
  - pedra e madeira;
  - porta pivotante;
  - brises;
  - piscina.
- **Lote 2, chalé:**
  - duas águas bem inclinadas (A-frame);
  - oitão de vidro;
  - pedra, madeira e deck;
  - lareira e mezanino;
  - araucária no quintal.
- **Lotes 3 e 4, casas térreas modernas e diferentes entre si:**
  - lote 3: laje com beiral grande, pergolado na garagem e jardim seco;
  - lote 4: volume alto amadeirado, garagem em grafite e área gourmet.
- **Áreas comuns:**
  - portaria no início da servidão;
  - praça com pergolado na faixa hachurada;
  - bicicletário e abrigo de lixo;
  - palmeira no retorno;
  - postes, meio-fio e calçada em frente aos lotes;
  - cerca viva junto ao muro do vizinho.

## Referências nesta pasta
- `referencias/CONTEXTO_planta.md`: todos os dados do terreno e do programa.
- `referencias/01_satelite`: implantação real e entorno.
- `referencias/02_croqui`: croqui do proprietário com as medidas.
- `referencias/03_fotos_local`: mostram as cores reais da terra, do muro do vizinho, da soja e das torres, e a luz de fim de tarde.
- `referencias/04_referencias_3d`: imagens de uma tentativa anterior. Servem só como ideia de volumetria; o pedido é algo mais realista que elas.
- `referencias/05_esquema_cotado`: leitura do croqui em escala.
- **A planta que você gerou no passo anterior** é a fonte principal das medidas. Se ela mudou algo em relação ao croqui, siga a planta.

## Antes de entregar
Abra cada ponto de vista nas qualidades Alta e Leve. Confira se as medidas batem com a planta, usando a vista de cima sobre a implantação, e se não há elementos flutuando ou atravessando outros.

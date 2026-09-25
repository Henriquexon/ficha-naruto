# Ficha Ninja · RPG Naruto

Protótipo de ficha de personagem para o RPG de Naruto criado pelo grupo. É um site estático (HTML, CSS e JavaScript puro, sem build) que roda direto no navegador e salva as fichas no próprio navegador.

Tudo o que aparece na ficha vem dos documentos do sistema:

| Documento | O que foi usado |
| --- | --- |
| RPG Naruto - Regras Gerais | Criação de personagem, atributos, classes, clãs, habilidades inatas, talentos, perícias e talentos de perícia, especializações, escalonamento de nível, DNs, vida, chakra, descansos, deslocamento, carregamento, condições, protagonismo, alinhamentos |
| RPG Naruto - Treinos | Pontos de treino por Inteligência e rank, tabela de atividades, tabela de soco, rank de aprimoramento de jutsus |
| RPG Naruto - Jutsus e Habilidades de Clãs | Livro de jutsus pesquisável (468 técnicas) com os campos Custo, Rank, Efeito, Dano, Requerimentos, Range, Aprendizado e Custo de Ações |
| RPG Naruto - Armas & Mercadorias | Loja de itens, marionetes padrão e componentes |
| RPG Naruto - Criaturas & Invocações | Invocações e companheiros, cachorros Inuzuka, bijuus, tabela de invocação reversa |
| RPG Naruto - Kinjutsus e GodMods | 8 Portões, Jashin, Jiongu (máscaras) |

## Como usar

Abra `index.html` no navegador. Não precisa instalar nada.

Para publicar no GitHub Pages: *Settings → Pages → Deploy from a branch*, escolha a branch e a pasta raiz (`/`).

A ficha abre com um personagem de exemplo. Em **Fichas** dá para criar novas fichas, alternar entre elas, duplicar, excluir, baixar/copiar o JSON e importar uma ficha recebida de outra pessoa.

### Abas

- **Ficha**: identidade (clã, classe, patente, elementos, habilidades inatas), atributos com a conta dos 9 pontos da criação, vida e chakra com dano/cura, sobrevida e sobrechakra, testes contra a morte, condições, descansos, as 7 DNs, deslocamento, PA, regeneração, percepção passiva, soco, carregamento, protagonismo e especializações. Os botões `d20` rolam o teste com o modificador.
- **Jutsus**: técnicas do personagem. Adicione pelo livro de jutsus (busca por nome/efeito, filtro por categoria, rank e “só do meu clã”), adicione de uma vez as técnicas iniciais (I) do clã e das habilidades inatas, ou registre uma técnica criada em treino.
- **Inventário**: itens da loja ou personalizados, quantidade, peso total contra o limite de carregamento, Ryo.
- **Evolução**: Pontos de Criação (20 PC), talentos, as 4 perícias com os benefícios acumulados, talentos de perícia, upgrades de clã, calculadora de pontos de treino e registro de treinos, escalonamento com o nível atual destacado.
- **Aliados**: invocações e companheiros (do catálogo ou em branco) e marionetes com compartimentos e componentes.
- **Especial**: Jinchuuriki (bijuu, custo do selo, laço de amizade), Sharingan e medidor de cegueira do Mangekyou, 8 Portões, penalidades de Jashin, máscaras do Jiongu. Os módulos relevantes ao personagem abrem sozinhos.
- **História**: alinhamento, ideal, fraqueza, vínculo, história e anotações.

## Contas automáticas

- **Atributos**: `−1 + clã + pontos distribuídos + classe + outros`. O custo da distribuição segue a tabela da criação (passar de 1 para 2 custa 2).
- **Vida máxima**: `nível × (vida por nível da classe + extra do clã + Cons/2 arredondado para baixo) + extras`. Constituição negativa entra inteira por nível. Hoozuki usa 6/6 por nível; Senju e Uzumaki somam o extra por nível.
- **Chakra máximo**: `nível × (chakra por nível da classe + extra do clã) + extras`, metade com o talento Mestre em Taijutsu, menos o custo do selo da bijuu (2/3/4 por nível, mínimo 2) enquanto não houver laço de amizade.
- **DN**: Taijutsu 6 + Tai · Ninjutsu 8 + Nin · Constituição 10 + Cons · Destreza 6 + Des · Genjutsu 8 + Gen · Contra-ataque 4 + atributo escolhido · Inteligência = percepção passiva.
- **Rank** pelo nível: D (1–4), C (5–9), B (10–14), A (15–19), S (20).
- **Descanso curto**: 1 dado de vida e chakra (3 a partir do nível 10, 6 no nível 20; o dobro com a 3ª perícia de Resistência). **Descanso longo**: recupera tudo e tira 20 de cegueira.

Bônus que dependem de escolha do jogador (perícias, talentos de valor variável, técnicas ativas como Byakugan e Sharingan) entram à mão nos campos “Outros” dos atributos e em “Bônus extras”.

## Pontos em que os documentos se contradizem

A ficha segue uma das versões e o texto da regra fica visível. Vale o grupo decidir:

1. **Percepção passiva**: o escalonamento diz 8/9/10/11/12 + Int nos níveis 1/7/12/17/20; a seção “Percepção passiva” diz 8/10/12/14/16 + Int. A ficha usa a seção específica (8/10/12/14/16).
2. **Especializações**: o escalonamento e o passo 7 da criação dão 1 especialização com +1 no nível 1, 3 com +2 no nível 10 e 7 com +4 no nível 20; a seção “Interpretação explicada” fala em 3 (+3), 5 (+6) e 7 (+9). A ficha usa o escalonamento.
3. **Elemento**: o escalonamento dá a escolha de elemento no nível 4; a seção “Elementos” fala no nível 5.
4. **Kubikiribōchō (Zambatou)**: o dano aparece como “10d1212d6” no documento; a ficha mostra “10d12 / 12d6”.
5. **Aburame: Rinkaichu** e algumas habilidades inatas (6 Braços, Bolha de Sabão, Bolsa de Veneno, Cobra, Homem de Borracha, Kyoumeisen) ainda não têm custo em PC.

## Atualizar os dados

- `js/data/regras.js`: classes, clãs, habilidades inatas, talentos, perícias, especializações, tabelas.
- `js/data/itens.js`: loja, marionetes e componentes.
- `js/data/criaturas.js`: invocações e companheiros.
- `js/data/jutsus.js`: gerado a partir do documento de Jutsus. No Google Docs use *Arquivo → Fazer download → Markdown (.md)* e rode:

```sh
python3 tools/gerar_jutsus.py "RPG Naruto - Jutsus e Habilidades de Clãs.md"
```

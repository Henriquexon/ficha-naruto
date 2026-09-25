// Dados transcritos de "RPG Naruto - Regras Gerais", "RPG Naruto - Treinos",
// "RPG Naruto - Kinjutsus e GodModes" e "RPG Naruto - Criaturas & Invocações".
// Ao mudar uma regra no documento, atualize aqui.

window.REGRAS = (function () {
  const ATRIBUTOS = [
    { id: 'car', nome: 'Carisma', desc: 'Serve para se relacionar com pessoas que não são jogadores na campanha.' },
    { id: 'cons', nome: 'Constituição', desc: 'Acrescenta na vida e representa a resistência física do ninja.' },
    { id: 'des', nome: 'Destreza', desc: 'Utilizado para locomoção, para uso de armas e furtividade.' },
    { id: 'gen', nome: 'Genjutsu', desc: 'Utilizado para o uso de genjutsus.' },
    { id: 'int', nome: 'Inteligência', desc: 'Torna o ninja mais apto a compreender o mundo a sua volta, permitindo aumentar suas ações por turno e liberar mais opções durante seus treinos.' },
    { id: 'nin', nome: 'Ninjutsu', desc: 'Utilizado para a realização de ninjutsus e manipulação livre de chakra.' },
    { id: 'tai', nome: 'Taijutsu', desc: 'Utilizado para golpes de taijutsu, atividades de força física e esquiva.' },
  ];

  // bonus: cada grupo dá +v em UM dos atributos listados (grupo de 1 opção = fixo)
  const CLASSES = [
    { id: 'equilibrado', nome: 'Equilibrado', vida: 8, chakra: 8, texto: '+1 Nin/Tai/Gen; +1 Des/Cons/Car/Int',
      bonus: [{ v: 1, op: ['nin', 'tai', 'gen'] }, { v: 1, op: ['des', 'cons', 'car', 'int'] }] },
    { id: 'guerreiro', nome: 'Guerreiro', vida: 8, chakra: 8, texto: '+1 Des; +1 Cons/Car/Int',
      bonus: [{ v: 1, op: ['des'] }, { v: 1, op: ['cons', 'car', 'int'] }] },
    { id: 'pacifista', nome: 'Pacifista', vida: 6, chakra: 8, texto: '+1 Int/Car, +1 Int/Car, +1 Int/Car',
      bonus: [{ v: 1, op: ['int', 'car'] }, { v: 1, op: ['int', 'car'] }, { v: 1, op: ['int', 'car'] }] },
    { id: 'duelista', nome: 'Duelista', vida: 8, chakra: 6, texto: '+2 Destreza',
      bonus: [{ v: 2, op: ['des'] }] },
    { id: 'reservatorio', nome: 'Reservatório de Chakra', vida: 4, chakra: 12, texto: '+1 Nin; +1 Gen; +1 Int/Car',
      bonus: [{ v: 1, op: ['nin'] }, { v: 1, op: ['gen'] }, { v: 1, op: ['int', 'car'] }] },
    { id: 'usuario', nome: 'Usuário de Chakra', vida: 6, chakra: 10, texto: '+1 Nin/Gen; +1 Int/Car',
      bonus: [{ v: 1, op: ['nin', 'gen'] }, { v: 1, op: ['int', 'car'] }] },
    { id: 'resistente', nome: 'Resistente', vida: 10, chakra: 6, texto: '+1 Tai/Cons; +1 Cons',
      bonus: [{ v: 1, op: ['tai', 'cons'] }, { v: 1, op: ['cons'] }] },
  ];

  // attrs: bônus fixos. escolha: +1 em atributo à escolha. vidaNivel/chakraNivel: extra por nível.
  // grupos: seções do documento de Jutsus com as técnicas do clã.
  const CLAS = [
    { id: 'sem', nome: 'Sem clã', pc: 0, attrs: {}, desc: 'O ninja não pertence a nenhum clã e com isso não possui nenhum tipo de herança relevante na família.' },
    { id: 'aburame_kikai', nome: 'Aburame: Kikaichuu', pc: 11, attrs: { nin: 1 }, grupos: ['Kikaichū'],
      desc: 'Clã onde os ninjas permitem que insetos habitem seus corpos, permitindo comunicação e controle como armas de combate. Possui a forma mais comum de insetos do clã, que é focada em consumo de chakra dos adversários. +1 Nin' },
    { id: 'aburame_rinkai', nome: 'Aburame: Rinkaichu', pc: null, attrs: { nin: 1 }, grupos: [],
      desc: 'Clã onde os ninjas permitem que insetos habitem seus corpos, permitindo comunicação e controle como armas de combate. Possui uma forma rara de insetos venenosos, que causam um dano celular no adversário através do simples toque físico. +1 Nin' },
    { id: 'akimichi', nome: 'Akimichi', pc: 14, attrs: { cons: 1 }, grupos: ['Akimichi', 'Pílulas de Comida do Clã Akimichi'],
      desc: 'Clã de ninjas resistentes de corpo voluptuoso usando jutsus de deformação corporal. +1 Cons.' },
    { id: 'hoozuki', nome: 'Hoozuki', pc: 18, attrs: { nin: 2, cons: -1 }, grupos: ['Hoozuki'], vidaFixa: 6, chakraFixo: 6, elementos: ['suiton'],
      desc: 'Clã de Kirigakure, conhecido por ter o corpo composto por água, realizando técnicas a partir dele. Começa o jogo com Suiton e não pode possuir nenhum outro elemento. +2 Nin -1 Cons' },
    { id: 'hyuuga', nome: 'Hyuuga', pc: 18, attrs: { tai: 2 }, grupos: ['Hyuuga'],
      desc: 'Família tradicional da vila da Folha que utiliza o doujutsu Byakugan. +2 Tai' },
    { id: 'inuzuka', nome: 'Inuzuka', pc: 13, attrs: { des: 1 }, grupos: ['Inuzuka'],
      desc: 'Clã que utiliza cachorros no combate, ganhando um turno extra para ele, também sendo capaz de localizar e identificar pessoas através do olfato, uma habilidade parecida com a sensorial. +1 Des' },
    { id: 'nara', nome: 'Nara', pc: 9, attrs: { int: 1 }, grupos: ['Nara'],
      desc: 'Clã capaz de manipular as sombras, muito conhecidos por sua inteligência acima da média. +1 Int' },
    { id: 'sarutobi', nome: 'Sarutobi', pc: 8, attrs: { nin: 1 }, grupos: ['Sarutobi'], elementos: ['katon'],
      desc: 'Um clã que possui facilidade em controlar elementos, inicia com o Katon. Nos níveis que se pode comprar jutsus, pode obter um jutsu elemental a mais desde que seja do seu ranking ou abaixo. +1 Nin.' },
    { id: 'generico', nome: 'Clã genérico', pc: 5, attrs: {}, escolha: 1,
      desc: 'Um clã que não possui muita relevância no mundo ninja ou técnicas próprias (Hatake, Namikaze, etc). +1 em algum atributo a escolha do ninja.' },
    { id: 'senju', nome: 'Senju', pc: 16, attrs: { car: 1, cons: 1, des: 1, gen: 1, int: 1, nin: 1, tai: 1 }, vidaNivel: 1, chakraNivel: 1,
      desc: 'Clã muito conhecido em Konoha, famoso por ter conhecimento em todas as áreas de combate. Ganham +1 de vida e chakra por nível. +1 em todos seus atributos.' },
    { id: 'uchiha', nome: 'Uchiha', pc: 20, attrs: { nin: 1, gen: 1 }, grupos: ['Uchiha'], elementos: ['katon'],
      desc: 'Ninjas possuidores do doujutsu Sharingan e também da liberação de Katon, elemento que os ninjas possuem desde o nível 1. +1 Nin, +1 Gen' },
    { id: 'uzumaki', nome: 'Uzumaki', pc: 15, attrs: { cons: 3, int: -1 }, grupos: ['Uzumaki'], vidaNivel: 1, chakraNivel: 4,
      desc: 'Conhecidos por seus fuuinjutsus fortes. Ganham +1 de vida e +4 de chakra por nível. +3 Cons e -1 Int.' },
    { id: 'yamanaka', nome: 'Yamanaka', pc: 7, attrs: { nin: 1 }, grupos: ['Yamanaka'],
      desc: 'Passivamente ninjas sensoriais, os ninjas desse clã possuem jutsus relacionados com a mente, seja transferência, comunicação ou até mesmo ler mentes. +1 Nin' },
  ];

  const INATAS = [
    { id: 'seis_bracos', nome: '6 Braços', pc: null, desc: '' },
    { id: 'aojorou', nome: 'Aojorou (Aranha Azul)', pc: 13, grupos: ['Aojorou (Aranha Azul)'], desc: 'Possui a habilidade de manipular teias (como as de aranha) livremente, podendo inclusive deixá-las tão resistentes quanto aço.' },
    { id: 'bakuton1', nome: 'Bakuton I', pc: 12, grupos: ['Bakuton I'], desc: 'O ninja possui a capacidade de utilizar a explosão como elemento, e expeli-la pelas mãos a partir do contato físico, essa habilidade é formada pela mistura das naturezas de Katon e Raiton.' },
    { id: 'bakuton2', nome: 'Bakuton II (Kibaku Nendo)', pc: 15, grupos: ['Bakuton II'], kinjutsu: true, elementos: ['doton'], desc: 'O ninja consegue utilizar o elemento da explosão no seu chakra para infundi-lo a argila e utilizar a argila explosiva como bomba moldando na forma que quiser e também podendo ser ativada quando o ninja quiser. É formado pela união entre os elementos Katon e Raiton. Inicia o jogo com Doton devido a confecção das suas argilas. Por se tratar de um kinjutsu possui algumas restrições.' },
    { id: 'bolha', nome: 'Bolha de Sabão', pc: null, desc: '' },
    { id: 'bolsa_veneno', nome: 'Bolsa de Veneno', pc: null, desc: '' },
    { id: 'choujuu', nome: 'Choujuu Giga (Desenhos)', pc: 10, grupos: ['Choujuu Giga'], desc: 'Ninja que consegue dar vida a seus desenhos ao adicionar seu chakra. Sofre penalidades contra o elemento Suiton.' },
    { id: 'cobra', nome: 'Cobra', pc: null, desc: '' },
    { id: 'curandeiro', nome: 'Curandeiro Masoquista', pc: 2, desc: 'Permite ao ninja curar quem lhe morder, isso inclui o próprio ninja.' },
    { id: 'futton', nome: 'Futton (Fervura)', pc: 6, desc: 'Combina os elementos Suiton e Katon para criar substâncias gasosas de diferentes propriedades e usos.' },
    { id: 'borracha', nome: 'Homem de Borracha', pc: null, desc: '' },
    { id: 'hyouton', nome: 'Hyouton (Gelo)', pc: 10, grupos: ['Hyouton (Gelo)'], desc: 'Permite ao ninja que manipule a transformação de natureza do gelo, que é formada pela união entre Fuuton e Suiton. É uma habilidade encontrada no clã Yuki.' },
    { id: 'jashin', nome: 'Jashin (Imortalidade)', pc: 14, grupos: ['Jutsu da Maldição (Jashin)'], kinjutsu: true, desc: 'O ninja é um seguidor da religião do deus Jashin, todos os fiéis podem se tornar imortais desde que se mantenham ativos nos seus deveres com o culto. Por se tratar de um Kinjutsu possui algumas restrições.' },
    { id: 'jinton', nome: 'Jinton (Poeira)', pc: 15, grupos: ['Jinton (Poeira)'], desc: 'É uma Kekkei Touta, uma versão avançada da Kekkei Genkai; nela o ninja junta 3 elementos (Doton, Katon e Fuuton) para criar o poder de pulverizar seus inimigos.' },
    { id: 'jiton1', nome: 'Jiton I (Areias)', pc: 12, grupos: ['Jiton I'], desc: 'O ninja consegue utilizar do magnetismo para controlar a areia, com diferentes composições. É formada através da combinação entre Doton e Fuuton.' },
    { id: 'bencao_areias', nome: 'Benção das Areias', pc: 20, grupos: ['Jiton I'], desc: 'O ninja possui a habilidade inata Jiton I (areia comum) e possui uma benção que lhe garante quase uma defesa perfeita e impenetrável, na qual a areia chega a se movimentar por conta própria para sua proteção.' },
    { id: 'jiton2', nome: 'Jiton II (Armas Magnéticas)', pc: 11, desc: 'Utilizando da manipulação do magnetismo, o ninja consegue aplicar sua natureza em objetos metálicos como armas ninja, tornando tanto as armas quanto os alvos acertados em ímãs. É formada através da combinação entre Doton e Fuuton.' },
    { id: 'jiongu', nome: 'Jiongu (Boneca de Pano)', pc: 15, grupos: ['Jiongu'], kinjutsu: true, desc: 'Um kinjutsu secreto da vila da Cachoeira que transforma o corpo do ninja em algo semelhante a uma boneca de pano, formado por incontáveis fios pretos. Possui bonecos elementais que funcionam como aliados além de lhe darem vidas extras. Por se tratar de um kinjutsu possui algumas restrições.' },
    { id: 'kami', nome: 'Kami (Papel)', pc: 12, grupos: ['Kami'], desc: 'Utiliza o papel como arma e meio para realizar ninjutsus e ataques de longo alcance, podendo transformar seu corpo neste material.' },
    { id: 'kyoumeisen', nome: 'Kyoumeisen (Som)', pc: null, desc: '' },
    { id: 'mokuton', nome: 'Mokuton (Madeira)', pc: 15, grupos: ['Mokuton (Liberação de Madeira)'], desc: 'Considerado um dos ninjutsus mais fortes de todos, o Mokuton surge com Hashirama Senju e consiste na manipulação da madeira, que é formada na união entre Doton e Suiton. Recebe vantagem nos ataques da sua kekkei genkai quando estiver em um ambiente favorável, como uma floresta. Possui uma regeneração de vida passiva que aumenta conforme seu rank.' },
    { id: 'punhos', nome: 'Punhos Bêbados', pc: 6, grupos: ['Punhos Bêbados'], desc: 'Ao ingerir alguma bebida alcoólica o ninja se torna extremamente forte porém entrará em frenesi.' },
    { id: 'ranton', nome: 'Ranton (Tempestade)', pc: 7, desc: 'Combina Suiton e Raiton para criar um elemento baseado na liberação de raios fluídos como a água.' },
    { id: 'roubo', nome: 'Roubo de Chakra', pc: 5, grupos: ['Roubo de Chakra'], desc: 'O ninja é capaz de absorver o chakra do seu inimigo para si.' },
    { id: 'sensorial', nome: 'Sensorial', pc: 3, grupos: ['Sensorial'], desc: 'O ninja possui a habilidade de rastrear outros ninjas pelo seu chakra.' },
    { id: 'shakuton', nome: 'Shakuton (Calor)', pc: 8, grupos: ['Shakuton (Liberação de Calor)'], desc: 'Uma transformação de natureza de chakra que junta os elementos Katon e Fuuton. Capaz de criar pequenos Sóis que queimam seus alvos.' },
    { id: 'shikotsu', nome: 'Shikotsumyaku (Ossos)', pc: 12, desc: 'É uma habilidade que permite ao usuário controlar os ossos do próprio corpo, podendo fazer com que fiquem expostos para usá-los como armas. Possuem uma resistência semelhante à de armas ninjas formadas por aço comum. É encontrada no clã Kaguya.' },
    { id: 'senninka', nome: 'Senninka (Transformação Sábia)', pc: 15, grupos: ['Senninka'], desc: 'É uma transformação que consiste em uma mutação por absorver energia natural em grande quantidade e de forma passiva, que resulta no aumento da capacidade física e a possibilidade de realizar várias proezas que mudam de forma. Por se manter conectado com a natureza, também tem a habilidade de se comunicar com os animais, além de passivamente absorver chakra natural, dando ao ninja a habilidade de regeneração de chakra passiva. Porém por estar o tempo todo com essa absorção de energia, o ninja possui momentos de frenesi.' },
    { id: 'siameses', nome: 'Siameses', pc: 8, grupos: ['Siameses'], desc: 'O ninja nasce com um gêmeo siamês que normalmente fica com a cabeça atrás de sua nuca e pode se movimentar livremente pelo corpo “principal”.' },
    { id: 'tubarao', nome: 'Tubarão', pc: 10, grupos: ['Tubarão'], elementos: ['suiton'], desc: 'O ninja nasce com a aparência semelhante a de um tubarão, sua pele possui um tom azul-claro acinzentado, pequenos olhos redondos brancos e marcas parecidas com brânquias sob seus olhos e ombros. O ninja que possuir essa habilidade inata começa o jogo com o elemento Suiton, roubo de chakra e a invocação de Tubarões. Além disso também possui vantagem nos combates aquáticos e interage diretamente com a lendária espada “Samehada”.' },
    { id: 'tubos', nome: 'Tubos de Ar', pc: 4, grupos: ['Tubos de Ar'], desc: 'O ninja tem seu corpo alterado fisicamente, tendo a adição de tubos de ar ocos que se estendem até a palma de suas mãos. A partir desses tubos ele pode impulsionar uma combinação de pressão de ar e som em várias proporções, controladas pelo seu chakra.' },
    { id: 'youton1', nome: 'Youton I (Borracha)', pc: 6, desc: 'Uma transformação de natureza de chakra que junta os elementos Katon e Doton. O ninja pode utilizar técnicas formadas por uma borracha vulcanizada. Consegue anular jutsus de Raiton.' },
    { id: 'youton2', nome: 'Youton II (Lava)', pc: 5, desc: 'Uma transformação de natureza de chakra que junta os elementos Katon e Doton. Permitindo ao ninja utilizar técnicas de lava viscosa que logo endurece formando rochas.' },
    { id: 'youton3', nome: 'Youton III (Cal)', pc: 3, desc: 'Uma transformação de natureza de chakra que junta os elementos Katon e Doton. O ninja pode utilizar técnicas que são formadas por cal viva, um material que quando adicionado água se torna extremamente rígido.' },
  ];

  const TALENTOS = [
    { nome: 'Adepto a Pergaminhos', pc: '2', desc: 'Permite o ninja selar até o dobro do limite de peso de cada pergaminho.' },
    { nome: 'Atitudes Altruístas', pc: '2', desc: 'Sempre que o ninja decidir gastar seu próximo turno de ataque para defender um aliado irá ganhar +3 na DN. Somente será aplicado quando for o ninja original gastando seu turno, não se aplicando a clones ou quaisquer outras técnicas que o ninja “invoque”.' },
    { nome: 'Brincando com a Sorte', pc: '5', desc: 'Uma vez por descanso longo você pode substituir um d20 rodado para realização de qualquer teste. O valor rolado deve ser utilizado.' },
    { nome: 'Brisa Forte', pc: '5', desc: 'O ninja começa com um leque dobrável gigante e o elemento Fuuton.' },
    { nome: 'Banco de Chakra', pc: '3', desc: 'O ninja pode transferir uma quantidade de chakra qualquer que não o leve a 0 de chakra para um ninja em distância corpo-a-corpo. Custa 1 PA e não é considerado como um ataque.' },
    { nome: 'Burguês', pc: '1-2', desc: 'Dinheiro não é problema para essa pessoa, dessa forma ela ganhará uma mesada ninja nos níveis 1, 5, 10, 15 e 20. Essa mesada é equivalente a quantos pontos você adquirir, sendo 450 Ryo por cada ponto gasto. Só recebe os Ryo referente aos níveis que o ninja possuir esse talento.' },
    { nome: 'Carismático', pc: '4', desc: 'O ninja possui uma aura que chama a atenção daqueles próximos, uma vez por descanso curto o jogador pode, em um teste de carisma, após ver o resultado, adicionar dois d4 ao resultado do d20 anteriormente jogado.' },
    { nome: 'Caçador de Recompensas', pc: '2', desc: 'Ganha 60 Ryo a cada golpe final causado.' },
    { nome: 'Chakra Elevado', pc: '1-2', desc: 'O ninja ganha +5 de chakra para cada PC gasto.' },
    { nome: 'Corrigindo Falhas', pc: '4', desc: 'O ninja ganha +1 no atributo que possuir menor número (se houver mais de um, o ninja poderá escolher).' },
    { nome: 'Duro de Matar', pc: '2', desc: 'Uma vez por descanso longo o ninja tem um sucesso garantido em seus testes contra a morte (não é utilizado em testes de chakra).' },
    { nome: 'Elementalista', pc: '4-16', desc: 'O ninja ganha um elemento extra para cada 4 PC gastos. O ninja não pode possuir mais do que os 5 elementos base do jogo.' },
    { nome: 'Erro Calculado', pc: '8', desc: 'O ninja pode prever quando irá errar seu golpe, fazendo-o recuperar 50% (arredondado pra cima) do chakra gasto. Não pode ser utilizado em jutsus com custos por turno.' },
    { nome: 'Intimidador', pc: '2', desc: 'Habilita para o jogador a habilidade de intimidar inimigos durante a batalha. O ninja realiza uma rolagem de Carisma contra a DN de Inteligência dos alvos. Caso seja bem sucedido, todos os adversários afetados em um raio grande não podem terminar seu próximo turno de ataque nessa mesma área, ou todos os ataques contra eles receberão vantagem. Caso o alvo esteja impossibilitado de se mover esse efeito é desconsiderado. Custa 1 PA e é considerado como um ataque.' },
    { nome: 'Líder Inspirador', pc: '2', desc: 'O ninja pode usar seus pontos de protagonismos para adicionar seu modificador de carisma em rolagens de aliados que acontecem em um range longo.' },
    { nome: 'Mestre da Enganação', pc: '4', desc: 'A cada 3 pontos acima de 0 em Inteligência, o ninja ganha +1 no modificador de Genjutsu. Ou seja, com 3 no modificador de Inteligência o ninja ganha +1 em Genjutsu, com 6 em Inteligência irá ganhar +2 e assim sucessivamente.' },
    { nome: 'Mestre Invocador', pc: '5', desc: 'Permite que o ninja escolha uma invocação quando fizer o jutsu de invocação reversa.' },
    { nome: 'Mestre dos Cupons', pc: '2', desc: 'Ao comprar 3 itens, o mais barato sairá de graça.' },
    { nome: 'Mestre dos Sons', pc: '5', desc: 'O ninja escolhe um instrumento musical que permitirá realizar genjutsu e inicia o jogo com ele. Toda vez que ele utilizar um genjutsu com o instrumento, o custo para usar a técnica é reduzido. Os jutsus que não forem realizados por meio sonoro custam essa mesma quantidade porém a mais. (Rank D = 0, Rank C = 1, Rank B = 3, Rank A = 5, Rank S = 8).' },
    { nome: 'Mestre em Taijutsu', pc: '6', desc: 'O ninja tem seu chakra reduzido à metade (arredondado para baixo com o mínimo de 1) e ganha +1 em Taijutsu e +1 em Constituição.' },
    { nome: 'Número da Sorte', pc: '7/6/5/4', desc: 'O ninja pode escolher qualquer número (exceto 1 e 20) como seu número da sorte. Ao rodar um dado em algum teste e tirar esse número, ele é substituído por um 20 natural. (Entre 2 e 5 = 7, entre 6 e 10 = 6, entre 11 e 15 = 5, entre 16 e 19 = 4). Só pode ser pego uma vez.' },
    { nome: 'Prodígio em Medicina', pc: '4', desc: 'O ninja aprende a técnica “Shousen Jutsu (Técnica da Palma Mística)” nesse caso essa técnica é considerada inicialmente de Rank B para treinos.' },
    { nome: 'Prodígio em Portões', pc: '8', desc: 'Os oito portões se tornam compráveis para esse ninja, além de ganhar a ativação do portão da abertura juntamente com sua primeira perícia de taijutsu. Os portões 2 e 3 pertencem ao rank C, os portões 4, 5 e 6 pertencem ao rank B e os portões 7 e 8 pertencem ao rank A.' },
    { nome: 'Provocar', pc: '2', desc: 'Habilita para o jogador a habilidade de provocar inimigos em batalha. O ninja faz uma rolagem de Constituição contra a DN de Inteligência dos alvos. Caso seja bem sucedido, todos os adversários afetados em um raio grande deverão tentar atacar o usuário no seu próximo turno de ataque, ataques em quaisquer outros alvos receberão desvantagem. Custa 1 PA e não é considerado como um ataque.' },
    { nome: 'Recuperação Concentrada', pc: '3', desc: 'O ninja pode gastar 2 turnos seguidos para recuperar 4x a sua recuperação de chakra. Caso o ninja perca a concentração, ele recupera 5 de chakra.' },
    { nome: 'Sangue nos Olhos', pc: '4', desc: 'O ninja, uma vez por descanso curto, pode utilizar até duas ações de ataque no seu turno quando tiver os PA necessários.' },
    { nome: 'Marioneteiro', pc: '6', desc: 'O ninja sabe como controlar marionetes, dessa forma aprende a técnica “Kugutsu no Jutsu (Técnica das Marionetes)” e ganha uma marionete básica I.' },
    { nome: 'Um Passo à Frente', pc: '3', desc: 'O ninja pode obter o 4º PA possuindo no mínimo 1 como modificador de Inteligência, e não 3 como o requisito original. Para os demais PA a regra do jogo se mantém.' },
    { nome: 'Veloz', pc: '2-4', desc: 'Ganha +1 de deslocamento para cada 2 PC gastos.' },
    { nome: 'Vida Elevada', pc: '1-2', desc: 'O ninja ganha +4 de vida para cada PC gasto.' },
  ];

  const PERICIAS = [
    { id: 'ninjutsu', nome: 'Perícia em Ninjutsu',
      garante: 'Ou um acréscimo de 10 pontos no chakra total ou conseguir mais um elemento. Nos dois casos o ninja ganha +5 pontos na regeneração de chakra.',
      niveis: ['Seu número máximo de opções na DN de Ninjutsu se torna 2.',
        '+1 de Ninjutsu; 4 Pontos de Perícia.',
        '+1 de Ninjutsu; +1 de Carisma, Constituição ou Inteligência.',
        'Todos os Ninjutsus se tornam Compráveis (não aplicável para tabela de Sensei); 4 Pontos de Perícia; +10 de chakra ou um elemento aleatório; +5 na sua regeneração de Chakra.'],
      talentos: [
        ['Avatar', '4', 'Quando o ninja dominar os 5 elementos ele receberá +1 no seu modificador de Ninjutsu.'],
        ['Chakrudo', '4', 'Para cada 10 de chakra gasto em uma técnica, o ninja causa 1d4 de dano extra em 1 dos alvos atingidos.'],
        ['Chakra Elevado²', '1-2', 'Ganha 10 de chakra máximo para cada ponto gasto.'],
        ['Recuperação Elevada', '2-4', 'Aumenta a regeneração de chakra em 5 a cada 2 pontos gastos.'],
        ['Engenheiro Ninja', '2', 'Para cada 10 de chakra gasto para criar uma técnica de barreira ela ganhará 6 de vida.'],
        ['Eu bato e fujo', '2', 'O ninja ganhará 2 metros no seu reposicionamento ao ser bem sucedido em um DN feita com a técnica “Kawarimi no Jutsu (Técnica de Substituição de Corpo)”.'],
        ['Jogaram gasolina?', '4', 'Os DPT do usuário atingem seus alvos uma quarta vez.'],
        ['Mestre em Fuuinjutsus', '4', 'Ataques de Fuuinjutsus não contam como ataque.'],
        ['Ninja Precavido', '2', 'Ganha +1 espaço de DN de Ninjutsu.'],
        ['Linha de Frente', '2', 'Recebe vantagem nos seus testes de Concentração de um jutsu quando sofrer dano.'],
      ] },
    { id: 'genjutsu', nome: 'Perícia em Genjutsu',
      garante: 'Um acréscimo de 25 pontos no chakra total.',
      niveis: ['Seu número máximo de opções na DN de Genjutsu se torna 2.',
        '+1 de Genjutsu; 4 Pontos de Perícia; pode usar 2 genjutsus de concentração ao mesmo tempo.',
        '+1 de Genjutsu; +1 de Carisma, Constituição ou Inteligência.',
        'Todos os Genjutsus se tornam Compráveis (não aplicável para tabela de Sensei); 4 Pontos de Perícia; +15 de chakra; pode usar 4 genjutsus de concentração ao mesmo tempo.'],
      talentos: [
        ['Ensinando o padre a rezar missa', '1', 'Adiciona seu Genjutsu na DN de Int contra Genjutsus.'],
        ['Chakra Elevadíssimo', '1-2', 'Ganha 15 de chakra máximo para cada ponto gasto.'],
        ['Segunda Chance', '4', 'Caso o ninja falhe na primeira rolagem do Genjutsu, a jogada não será considerada como um ataque.'],
        ['Mestre das Ilusões', '4', 'Sua jogada para manter seus Genjutsus agora custa 0 PA.'],
        ['Ilusionista de Suporte', '1', 'Consegue realizar a técnica “Genjutsu Kai (Dissipação de Genjutsu)” nos seus aliados em um alcance médio.'],
        ['Genjutsu no x1 é forte mesmo ein?', '4', 'O usuário ganhará +2 na sua DN de Genjutsu caso seja atacado por um ninja que esteja sob efeito de algum Genjutsu seu.'],
        ['Linha de Frente', '2', 'Recebe vantagem nos seus testes de Concentração de um jutsu quando sofrer dano.'],
      ] },
    { id: 'taijutsu', nome: 'Perícia em Taijutsu',
      garante: 'Aumenta em 5 pontos a vida do ninja; o nível do seu soco aumenta em 1.',
      niveis: ['+1 de Deslocamento; Habilita o aprendizado do 1º portão.',
        '+1 de Taijutsu; o ninja agora pode aprender a abrir o 2º e 3º portão; 4 Pontos de Perícia.',
        '+1 de Taijutsu; +1 de Carisma, Constituição ou Inteligência; ninja agora pode aprender a abrir o 4º, 5º e 6º portão.',
        'Todos os Taijutsus se tornam Compráveis (não aplicável para tabela de Sensei); 4 Pontos de Perícia; +5 de vida; seu dano do soco aumenta em 1 nível; ninja agora pode aprender a abrir o 7º e 8º portões.'],
      talentos: [
        ['Pensa Rápido', '4', 'Quando um inimigo em uma distância corpo-a-corpo do ninja desejar realizar uma técnica de ataque que não seja de alcance corpo-a-corpo, é possível causar um ataque de oportunidade. Caso o ataque seja bem sucedido o alvo irá errar sua técnica, caso contrário ele acertará sua jogada de ataque.'],
        ["Can't touch This", '3', 'Ao ser bem sucedido numa defesa de Taijutsu, o ninja pode se deslocar 2 metros em qualquer direção sem tomar ataques de oportunidade.'],
        ['Taijutsu também custa chakra, sabia?', '2-4', 'Usuário ganha 15 de chakra para cada 2 pontos gastos.'],
        ['Vida Elevada²', '1-2', 'Ganha 8 de vida para cada ponto gasto.'],
        ['Arrombamento', '3', 'Pode abrir todos os portões que quiser gastando somente 1 PA e 5 de vida por portão (essa técnica só é utilizada quando desejar ativar o segundo portão ou superior).'],
        ['Tarda mas não falha', '1', 'O ninja aprende o 1º Portão.'],
        ['Pés Leves', '1', 'Uma vez por descanso curto o ninja pode utilizar a técnica “Shunshin no Jutsu (Técnica de Cintilação Corporal)” sem gastar chakra.'],
        ['Taijiu-jitsu', '2-4', 'Para cada 2 pontos gastos o CD dos agarrões do usuário sobem 1 rank (+2 no CD).'],
        ['Estilo do Macaco Bêbado', '4', 'Enquanto estiver com a técnica “Suiken (Punhos Bêbados)” ativa, o ninja ganha 1d6 de dano extra nos seus socos e taijutsus para cada 1 nível de perícia de Taijutsu que ele possuir.'],
        ['Estilo do Panda Bêbado', '4', 'Enquanto estiver com a técnica “Suiken (Punhos Bêbados)” ativa, todo ataque contra o alvo receberá desvantagem.'],
        ['Os Oito Bêbados Imortais', '4', 'O ninja agora pode utilizar “Suiken (Punhos Bêbados)” junto dos Oito Portões. Enquanto ambos estiverem ativos o dano auto infligido pelos portões não afetará a Concentração dos Punhos Bêbados.'],
      ] },
    { id: 'armas', nome: 'Perícia no Uso de Armas',
      garante: 'Aumenta 250g por PA de arremesso ou 500g no seu limite de carregamento.',
      niveis: ['As ações de embainhar e desembainhar armas corpo-a-corpo agora custam 0 PA.',
        '+1 de Destreza; 4 Pontos de Perícia.',
        '+1 de Destreza; +1 de Carisma, Constituição ou Inteligência; o ninja agora pode criar e utilizar armas lendárias (Rank S).',
        'O ninja cria uma arma lendária (Rank S) para si; 4 Pontos de Perícia; Aumenta 200g por PA de arremesso ou 500g no seu limite de carregamento.'],
      talentos: [
        ['Coletor', '2', 'Consegue coletar todas suas armas ninjas lançadas no combate.'],
        ['Ambidestro', '4', 'Atacar com a segunda espada agora custa 1 PA.'],
        ['Ladino', '1', 'Todas as ações furtivas do ninja possuem vantagem.'],
        ['Manipulador de Armas Corpo-a-Corpo', '4', 'A cada 5 de dano causado em um só ataque com uma arma corpo-a-corpo o alvo receberá um acréscimo de 1d4 de dano.'],
        ['Manipulador de Arremessáveis', '4', 'A cada 5 de dano causado num só ataque de arremessáveis em um mesmo alvo ele receberá um acréscimo de 1d4 de dano, esse valor só será adicionado para jogadas de ataque com alcance superior a curto (4 metros).'],
        ['Kunai AK47, a kunai perfeita para o combate', '2', 'O dano das kunais utilizadas pelo ninja é aumentado para 2d6.'],
        ['Arremesso Defensivo', '1', 'Pode realizar sua DN de Destreza com armas arremessáveis. Para poder utilizar a DN é preciso gastar no mínimo 250g de armas arremessáveis.'],
        ['Veloz²', '1-2', 'Ganha +1 de deslocamento para cada 1 ponto gasto.'],
        ['Burro de Carga', '2-4', 'A cada 2 pontos gastos adiciona 1 Kg que o ninja pode carregar.'],
      ] },
    { id: 'kugutsu', nome: 'Perícia em Kugutsu',
      garante: 'Um acréscimo de 25 pontos no chakra total e 500g no seu limite de carregamento.',
      niveis: ['Permite que o ninja conserte as marionetes por meio de um kit de reparos e seu número máximo de opções na DN de Ninjutsu se torna 2.',
        '+1 de Ninjutsu; 4 Pontos de Perícia; Habilita o jogador a manipular uma marionete a mais, totalizando 2, desconsiderando outros meios.',
        '+1 de Ninjutsu; +1 de Carisma, Constituição ou Inteligência. Habilita o jogador a manipular uma marionete a mais, totalizando 3, desconsiderando outros meios.',
        '4 Pontos de Perícia; +15 de Chakra; Habilita o jogador a manipular uma marionete a mais, totalizando 4, desconsiderando outros meios.'],
      talentos: [
        ['Mestre dos Ajustes', '4', 'Pode realizar uma ação de Concentração que custa o turno inteiro do ninja e um kit de consertos, caso essa ação não seja quebrada até o início do seu próximo turno de ataque todas as marionetes no seu alcance corpo-a-corpo terão a vida totalmente recuperada.'],
        ['MDF', '4', 'A partir de agora todas marionetes criadas pelo ninja tem seu peso reduzido pela metade.'],
        ['Chakra Elevadíssimo', '1-2', 'Ganha 15 de chakra máximo para cada ponto gasto.'],
        ['Mestre em componentes', '2-4', 'Para cada 2 pontos gastos o ninja pode adicionar 1 componente extra em todas suas marionetes (criadas por ele ou não).'],
        ['Dedos Ágeis', '4', 'Pode controlar 1 marionete extra.'],
        ['Quer ver uma mágica?', '3', 'Retirar marionetes de pergaminhos não custa chakra nem PA.'],
        ['Burro de Carga', '2-4', 'A cada 2 PC gastos adiciona 1 Kg que o ninja pode carregar.'],
        ['Ninja Precavido', '2', 'Ganha +1 espaço de DN de Ninjutsu.'],
      ] },
    { id: 'resistencia', nome: 'Perícia em Resistência',
      garante: 'Amplia a vida do ninja em 15 pontos.',
      niveis: ['Habilita o jogador a, uma vez por descanso longo, quando receber um dano que seria suficiente para deixá-lo desmaiado, ele fica com o equivalente a um dado de vida (multiplicado pelo número vezes que a perícia em resistência foi obtida) ao invés de desmaiar.',
        '+1 de Constituição; 4 Pontos de Perícia.',
        '+1 de Constituição; +1 de Carisma, Constituição ou Inteligência; descansos curtos do ninja recuperam o dobro do normal.',
        'Habilita o jogador a absorver todo o dano quando se defender com a DN de Constituição; 4 Pontos de Perícia; +15 de vida.'],
      talentos: [
        ['Controle Absoluto', '1', 'Uma vez por descanso curto, no início do seu turno, o ninja têm a possibilidade de se livrar de alguma condição que afete especificamente o ninja sem rolar dados ou gastar PA (cegueira, atordoamento ou enraizamento).'],
        ['Vida Elevadíssima', '1-2', 'Ganha 12 de vida para cada ponto gasto.'],
        ['Super amigos', '1', 'O alcance da DN de ajuda com Constituição se torna 2 deslocamentos.'],
        ['Pesado não significa lerdo', '1', 'Uma vez por descanso curto o ninja pode defender um aliado com Constituição sem gastar seu turno de ataque.'],
        ['Armadura de Espinhos', '4', 'Quando bem sucedido em uma DN de Constituição contra um ataque corpo-a-corpo o atacante receberá 1d6 de dano.'],
        ['Duro como Pedra', '2', 'A ação “preparar defesa” agora custa 2 PA ao invés do turno todo.'],
        ['Ursão', '3', 'Os agarrões do ninja agora utilizam Constituição tanto no seu ataque quanto no seu CD.'],
        ['Implacável', '4', 'O ninja não recebe os efeitos de atordoamento, empurrão ou derrubar.'],
        ['Pele de Dragão', '4', 'Reduz em 5 o dano total de uma jogada de ataque que não seja de alcance corpo-a-corpo.'],
        ['Vem dar um abraço no Vô', '2', 'Seus agarrões causam 1d8 de dano por turno.'],
        ['Chato pra Caralho', '2', 'O ninja receberá vantagem em todas suas rolagens de provocação.'],
        ['Burro de Carga', '2-4', 'A cada 2 PC gastos adiciona 1 Kg que o ninja pode carregar.'],
      ] },
    { id: 'medicina', nome: 'Perícia em Medicina',
      garante: 'Aumenta em 1d4 a cura dos ninjutsus médicos para cada 15 de vida recuperado (o d4 adicional não é considerado), além de ampliar a regeneração de chakra em 5 pontos.',
      niveis: ['Seu número máximo de opções na DN de Ninjutsu se torna 2; o ninja agora pode criar Poções do seu Rank.',
        '+1 de qualquer atributo; 4 Pontos de Perícia; Habilita o jogador a salvar a vida de um aliado ao realizar uma ação corpo-a-corpo que custa 1 PA e 4 de chakra (não é considerada como ataque), o deixando desmaiado até que consiga 3 sucessos nos testes contra a morte.',
        '+1 de qualquer atributo; +1 de Carisma, Constituição ou Inteligência.',
        'Todos os Medicinais se tornam Compráveis (não aplicável para tabela de Sensei); 4 Pontos de Perícia; +1d4 a cura dos ninjutsus médicos para cada 15 de vida recuperado; +5 de regeneração de chakra; consegue trazer aliados desmaiados de volta a vida, acordando os mesmos se curá-los.'],
      talentos: [
        ['Maca', '1', 'O ninja consegue carregar aliados desmaiados sem sofrer qualquer penalidade, apenas precisando ocupar suas duas mãos.'],
        ['Palma Mítica', '3', 'O ninja agora pode recuperar 1d4 a mais por PA na técnica “Shousen Jutsu (Técnica da Palma Mística)”, desde que gaste o chakra necessário para isso.'],
        ['Recuperação Elevada', '2-4', 'Aumenta a regeneração de chakra em 5 a cada 2 pontos gastos.'],
        ['Samu', '3', 'O ninja ganha +5 deslocamento em direção aos seus aliados desde que não realize nenhuma ação de ataque no turno.'],
        ['Médico de Combate', '2', 'Ao utilizar a ação de estabilizar, e bem sucedido, o alvo retornará com 1 vida e chakra (caso possua menos do que isso antes de desmaiar).'],
        ['Eficácia Garantida', '4', 'Uma vez por rodada o ninja pode adicionar um valor equivalente a soma do seu Ninjutsu com seu Carisma a uma rolagem de cura.'],
      ] },
    { id: 'jiongu', nome: 'Perícia Jiongu', soJiongu: true,
      garante: 'Uma nova máscara e um elemento aleatório.',
      niveis: ['Seu número máximo de opções na DN de Genjutsu ou Ninjutsu se torna 2.',
        '+1 de qualquer atributo; Soco das máscaras se torna nível 2; Máscaras ganham +2 de modificador tanto em ataque quanto na sua DN.',
        '+1 de qualquer atributo; +1 de Carisma, Constituição ou Inteligência; Aprende a técnica “Jiongu Modo”.',
        'Soco das máscaras se torna nível 6; Máscaras ganham +2 de modificador tanto em ataque quanto na sua DN.'],
      talentos: [] },
  ];

  const ESPECIALIZACOES = [
    { id: 'atletismo', nome: 'Atletismo', attrs: ['tai'], desc: 'Testes feitos em jogadas que exigem habilidades puramente físicas, como arrombar uma porta, puxar uma alavanca emperrada ou ganhar uma queda de braço.' },
    { id: 'atuacao', nome: 'Atuação', attrs: ['car', 'gen'], desc: 'Determina o quão bem você pode entreter um grupo de pessoas com música, dança, atuação, contando histórias ou alguma outra forma de entretenimento.' },
    { id: 'controle', nome: 'Controle de Chakra', attrs: ['nin'], desc: 'Testes em relação a controles simples de chakra, como acender velas utilizando Katon ou bloquear uma porta com uma raíz de Mokuton.' },
    { id: 'furtividade', nome: 'Furtividade', attrs: ['des'], desc: 'Esconder-se de inimigos, escapar sem ser notado, ou aproximar-se de alguém sem ser visto ou ouvido.' },
    { id: 'intimidacao', nome: 'Intimidação', attrs: ['car'], desc: 'Influenciar alguém através de ameaças abertas, ações hostis e violência física.' },
    { id: 'medicina', nome: 'Medicina', attrs: ['car'], desc: 'Estabilizar um companheiro que está morrendo fora de batalha, diagnosticar uma doença ou perceber um veneno.' },
    { id: 'mundo', nome: 'Mundo Ninja', attrs: ['int'], desc: 'Conhecimento sobre as situações atuais do universo: grandes ninjas vivos, disputas entre vilas, técnicas famosas.' },
    { id: 'percepcao', nome: 'Percepção', attrs: ['int'], desc: 'Observar, ouvir ou detectar a presença de alguma coisa. Mede a consciência geral do que está acontecendo ao seu redor.' },
    { id: 'persuasao', nome: 'Persuasão', attrs: ['car', 'gen'], desc: 'Influenciar alguém ou um grupo de pessoas com tato, delicadeza ou boa índole.' },
    { id: 'prestidigitacao', nome: 'Prestidigitação', attrs: ['des'], desc: 'Atos de prestidigitação ou trapaça manual, como plantar algo em outra pessoa, esconder um objeto ou roubar uma bolsa.' },
    { id: 'provocar', nome: 'Provocar', attrs: ['cons'], desc: 'Estressar e desestabilizar outras pessoas apenas com palavras, forçando-as a tomar atitudes por impulso.' },
    { id: 'resistencia', nome: 'Resistência', attrs: ['cons'], desc: 'Suportar situações extremas, como alto nível de embriaguez, venenos, socos etc.' },
    { id: 'sobrevivencia', nome: 'Sobrevivência', attrs: ['int'], desc: 'Seguir rastros, caçar, orientar o grupo através de matas fechadas, prever o tempo, evitar perigos naturais.' },
  ];

  const ALINHAMENTOS = [
    ['LB', 'Leal e Bom'], ['NB', 'Neutro e Bom'], ['CB', 'Caótico e Bom'],
    ['LN', 'Leal e Neutro'], ['N', 'Neutro'], ['CN', 'Caótico e Neutro'],
    ['LM', 'Leal e Mau'], ['NM', 'Neutro e Mau'], ['CM', 'Caótico e Mau'],
  ];

  const ELEMENTOS = [
    { id: 'katon', nome: 'Katon', sigla: 'Kt', efeito: 'Dano por Turno (DPT) pelo rank: D 0 · C 1d4 · B 1d8 · A 2d10 · S 4d10' },
    { id: 'suiton', nome: 'Suiton', sigla: 'St', efeito: 'Empurrão (E). Pode criar barreiras que aguentam mais dano.' },
    { id: 'fuuton', nome: 'Fuuton', sigla: 'Ft', efeito: 'Amplifica o dano das suas técnicas.' },
    { id: 'raiton', nome: 'Raiton', sigla: 'Rt', efeito: 'Atordoamento (A).' },
    { id: 'doton', nome: 'Doton', sigla: 'Dt', efeito: 'Derrubar (D). Pode criar barreiras e armaduras.' },
  ];

  const PATENTES = ['Nenhuma', 'Estudante', 'Gennin', 'Chunnin', 'Jounnin', 'Anbu'];

  const ESCALONAMENTO = {
    1: 'Permitida a compra de 2 jutsus ou 2 missões rank D; 1 Especialização (+1 de Mod); Regeneração de chakra = 5; Descanso Curto recupera 1 dado de vida e chakra; Percepção passiva = 8 + Inteligência.',
    2: 'Permitida a compra de jutsus ou missão rank D.',
    3: '',
    4: 'Perícia; Escolher 1 Elemento.',
    5: 'Rank C; Upgrade de clã; Permitida a compra de jutsus ou missão rank C.',
    6: 'Treino sem Sensei (1 ou menos de Carisma = Treino Curto; 2 de Carisma = Treino Médio; 3 ou mais de Carisma = Treino Longo).',
    7: 'Permitida a compra de jutsus ou missão rank C; Percepção passiva se torna 9 + Inteligência.',
    8: '',
    9: 'Perícia; Permitida a compra de jutsus ou missão rank C.',
    10: 'Rank B; Upgrade de clã; Carregamento de chakra amplia em 5 pontos; Ganha mais 2 especializações (o mod da especialização se torna +2); Descanso curto agora recupera 3 dados de vida e chakra.',
    11: 'Treino sem Sensei (1 ou menos de Carisma = Treino Curto; 2 de Carisma = Treino Médio; 3 ou mais de Carisma = Treino Longo).',
    12: 'Permitida a compra de jutsus ou missão rank B; Percepção passiva se torna 10 + Inteligência.',
    13: '',
    14: 'Perícia; Permitida a compra de jutsus ou missão rank B.',
    15: 'Rank A; Upgrade de clã.',
    16: 'Treino sem Sensei (1 ou menos de Carisma = Treino Curto; 2 de Carisma = Treino Médio; 3 ou mais de Carisma = Treino Longo).',
    17: 'Permitida a compra de jutsus ou missão rank A; Percepção passiva se torna 11 + Inteligência.',
    18: '',
    19: 'Perícia; Permitida a compra de jutsus ou missão rank A.',
    20: 'Ganha mais 4 especializações (o mod da especialização se torna +4); +1 de Modificador em todos os seus atributos; +1 de Modificador em um atributo a sua escolha; Rank S; Descanso curto agora recupera 6 dados de vida e chakra; Permitida a compra de jutsus ou missão rank A; Percepção passiva se torna 12 + Inteligência; Upgrade de Clã. Treino sem Sensei.',
  };

  // Tabela de soco (Treinos)
  const SOCO = [null, ['C', '1d4'], ['C', '1d6'], ['C', '1d6+1d4'], ['C', '2d6'], ['B', '2d8'], ['B', '2d10'], ['B', '2d12'],
    ['B', '2d12+1d6+1d4'], ['A', '2d12+2d10'], ['A', '3d12+2d8+1d4'], ['A', '3d12+2d8+5d4'], ['A', '3d12+2d8+9d4']];

  // Pontos de treino: [modInt][duração][rank]
  const RANKS = ['D', 'C', 'B', 'A', 'S'];
  const PONTOS_TREINO = {
    '-2': { curto: [5, 18, 34, 54, 90], medio: [18, 34, 54, 90, 168], longo: [25, 43, 72, 120, 228] },
    '-1': { curto: [6, 24, 45, 72, 120], medio: [24, 45, 72, 120, 224], longo: [34, 58, 96, 160, 304] },
    '0': { curto: [8, 30, 56, 90, 150], medio: [30, 56, 90, 150, 280], longo: [42, 72, 120, 200, 380] },
    '1': { curto: [10, 36, 67, 108, 180], medio: [36, 67, 108, 180, 336], longo: [50, 86, 144, 240, 456] },
    '2': { curto: [12, 45, 84, 135, 225], medio: [45, 84, 135, 225, 420], longo: [63, 108, 180, 300, 570] },
    '3': { curto: [14, 51, 95, 153, 255], medio: [51, 95, 153, 255, 476], longo: [71, 122, 204, 340, 646] },
    '4': { curto: [16, 60, 112, 180, 300], medio: [60, 112, 180, 300, 560], longo: [84, 144, 240, 400, 760] },
    '5': { curto: [18, 66, 123, 198, 330], medio: [66, 123, 198, 330, 616], longo: [92, 158, 264, 440, 836] },
  };

  const TABELA_TREINO = [
    ['Horas Complementares', 1, '+15 Ryo'], ['Aprender jutsu Rank D', 3, ''], ['Aprimorar Rank D', 8, ''],
    ['Ir atrás de Sensei (já utilizado)', 10, 'Permite utilizar um sensei já utilizado anteriormente'],
    ['Fazer Missão Rank D', 13, '+200 Ryo'], ['Criar Rank D', 18, ''],
    ['Ir atrás de Sensei (novo)', 20, 'Permite utilizar um novo sensei'], ['Aprimorar 1º Portão', 21, ''],
    ['Fazer Missão Rank C', 22, '+400 Ryo'], ['Aprender Rank C', 24, 'Jutsu Rank C com aprendizado C'],
    ['Aprender 2º portão', 26, 'Necessário possuir o 1º portão'], ['Aprimorar Rank C', 30, ''], ['Aprimorar 2º Portão', 32, ''],
    ['Fazer missão Rank B', 36, '+800 Ryo'], ['Aprender 3º portão', 40, 'Necessário possuir o 2º portão'], ['Criar Rank C', 42, ''],
    ['Aprender Rank B', 44, 'Jutsu Rank B com aprendizado C'], ['Aprimorar 3º Portão', 46, ''], ['Aprimorar Rank B', 56, ''],
    ['Aprender 4º portão', 58, 'Necessário possuir o 3º portão'], ['Missão Rank A', 60, '+1600 Ryo'], ['Aprimorar 4º Portão', 65, ''],
    ['4º PA', 70, ''], ['Criar Rank B', 72, 'Criar um jutsu do Ranking B, baseado na tabela de treinos'],
    ['Buscar Invocação', 73, 'Contrato com uma invocação de Rank B a escolha do jogador'],
    ['Aprender 5º portão', 74, ''], ['Aprender Rank A', 75, 'Jutsu Rank A com aprendizado C'], ['Aprimorar 5º Portão', 80, ''],
    ['Aprimorar Rank A', 90, ''], ['Aprender 6º portão', 95, 'Necessário possuir o 5º portão'], ['5° PA ou superior', 100, ''],
    ['Invocação Reversa', 105, 'Contrato com invocação de Rank A ou S de forma aleatória'], ['Aprimorar 6° Portão', 110, ''],
    ['Criar jutsu Rank A', 120, ''], ['Aprender 7º e 8º portão', 130, 'Necessário possuir o 6º portão'], ['1x Modificador', 140, ''],
    ['Aprimorar 7º Portão', 145, ''], ['Aprender Rank S', 150, 'Jutsu Rank S com aprendizado C'], ['Aprimorar Rank S', 175, ''],
    ['2x Modificador', 190, ''], ['Criar Rank S', 200, ''], ['3x Modificador', 300, ''],
  ];

  const CONDICOES = [
    { id: 'A', nome: 'Atordoamento', desc: 'Atacante possui vantagem. Defende com DN de Constituição. Cancela concentração. Não pode realizar nenhuma ação. Acaba ao receber dano, ao passar no teste de Constituição (CD do rank) no início do turno, ou no fim do turno de ataque do usuário 1 rodada após o acerto.' },
    { id: 'C', nome: 'Cegueira', desc: 'Desvantagem no ataque. Ataques contra o ninja possuem vantagem. Não pode realizar ataques de oportunidade.' },
    { id: 'DPT', nome: 'Dano por Turno', desc: 'Dano no acerto e no final dos próximos 2 turnos do usuário. O mesmo tipo de DPT não acumula; mantém-se o maior.' },
    { id: 'D', nome: 'Derrubado', desc: 'Ataques com desvantagem; deslocamento pela metade (mín. 1). 1 PA para teste de Constituição (CD da técnica) para levantar; se falhar, outro PA levanta sem teste.' },
    { id: 'E', nome: 'Empurrão', desc: 'Empurrado a uma distância igual ao CD base do rank da técnica (ou o limite da técnica). Não cancela ações.' },
    { id: 'Ez', nome: 'Enraizado', desc: 'Atacante possui vantagem. Deslocamento 0. Acaba ao passar no teste de Constituição (CD do rank) no início do turno, no fim do turno de ataque do usuário 1 rodada após o acerto, ou quando o usuário cancelar.' },
    { id: 'Conc', nome: 'Em Concentração', desc: 'Ao receber dano: teste de Constituição com CD 10 ou metade do dano (o maior). Se falhar, a técnica desativa. Atordoamento impede manter.' },
  ];

  const CD_RANK = { D: 3, C: 5, B: 7, A: 11, S: 13 };

  const DISTANCIAS = [
    ['Corpo-a-corpo', '1 m'], ['Curta', '4 m'], ['Média', '8 m'], ['Longa', '15 m'],
    ['Área pequena', 'raio 1 m'], ['Área grande', 'raio 4 m'],
  ];

  // Kinjutsus e GodModes
  const PORTOES = [
    ['1º Portão: Portão de Abertura', '3 (2) PV/turno', '+1 Tai', 'O ninja perde 1 de Constituição e Taijutsu.', 'Curto'],
    ['2º Portão: Portão da Cura', '4 (3) PV/turno', '+1 Tai e recupera 7 de vida', 'O ninja perde 2 de vida máxima por nível.', 'Curto'],
    ['3º Portão: Portão da Vida', '5 (3) PV/turno', '+1 Tai e +2 Deslocamento', 'O ninja terá o seu deslocamento reduzido pela metade arredondado para baixo com o mínimo de 1.', 'Curto'],
    ['4º Portão: Portão da Dor', '8 (6) PV/turno', '+1 Tai e vantagem nos ataques de Taijutsu', 'O ninja perde 2 de Constituição e Taijutsu.', 'Longo'],
    ['5º Portão: Portão do Limite', '9 (6) PV/turno', '+1 Tai e +4 Deslocamento', 'O ninja recebe desvantagem em todas suas rolagens de d20.', 'Longo'],
    ['6º Portão: Portão da Visão', '10 (7) PV/turno', '+1 Tai e recupera 39 de vida', 'Sua DN de Taijutsu se torna 4 + Taijutsu, e sua DN de contra-ataque não pode ser utilizada.', 'Longo'],
    ['7º Portão: Portão da Maravilha', '12 (10) PV/turno', '+2 Tai, seu deslocamento é dobrado e todas suas DN de Taijutsu ganham um aumento de +2', 'O ninja ficará desmaiado realizando testes contra a morte e caso saia vivo disso todo o dano recebido será dobrado.', 'Longo'],
    ['8º Portão: Portão da Morte', '-', '+4 Tai, seus Taijutsus causam o dobro de dano e o ninja pode voar chutando o ar (porém deve terminar seu turno no chão ou ele cairá).', 'O ninja tem seu corpo completamente desintegrado, morrendo sem deixar nenhum rastro.', '-'],
  ];

  const JASHIN_PENALIDADES = [
    'Seu deslocamento é reduzido pela metade arredondado para cima.',
    'Seu chakra é reduzido pela metade, arredondado para cima.',
    'Desvantagem em todas rolagem de d20.',
    'O Deus Jashin retira a imortalidade do ninja e reduz sua vida pela metade, arredondada para cima.',
    'O Deus Jashin irá requisitar a alma do infiel, matando o personagem.',
  ];

  const BIJUUS = [
    { nome: 'Shukaku', caudas: 1, papinho: 230, pv: 4000, chakra: 6000, dn: 20, atk: 17 },
    { nome: 'Matatabi', caudas: 2, papinho: 145, pv: 3000, chakra: 7000, dn: 18, atk: 22 },
    { nome: 'Isobu', caudas: 3, papinho: 170, pv: 7000, chakra: 6000, dn: 23, atk: 17 },
    { nome: 'Son Goku', caudas: 4, papinho: 190, pv: 6000, chakra: 7000, dn: 23, atk: 21 },
    { nome: 'Kokuo', caudas: 5, papinho: 150, pv: 5000, chakra: 8000, dn: 17, atk: 25 },
    { nome: 'Saiken', caudas: 6, papinho: 180, pv: 6000, chakra: 9000, dn: 22, atk: 23 },
    { nome: 'Choumei', caudas: 7, papinho: 185, pv: 5000, chakra: 7000, dn: 17, atk: 27 },
    { nome: 'Gyuuki', caudas: 8, papinho: 250, pv: 10000, chakra: 7000, dn: 30, atk: 21 },
    { nome: 'Kurama', caudas: 9, papinho: 205, pv: 6000, chakra: 10000, dn: 20, atk: 33 },
  ];

  // Efeitos numéricos das perícias, aplicados automaticamente na ficha.
  // g = "Garante" (vale a cada vez que a perícia é obtida); 1..4 = "Se obtida N vezes".
  // fixo: bônus sempre aplicado; esc: escolhas do jogador, cada uma [id, rótulo, bônus].
  // Bônus: vida, chakra, regen, desl, carga (kg), arremesso (g), soco (níveis), attrs {id: +n}.
  const umAtr = (ids) => ids.map((a) => [a, '+1 ' + ATRIBUTOS.find((x) => x.id === a).nome, { attrs: { [a]: 1 } }]);
  const TODOS = ['car', 'cons', 'des', 'gen', 'int', 'nin', 'tai'];
  const CCI = ['car', 'cons', 'int'];
  const PERICIAS_AUTO = {
    ninjutsu: {
      g: { fixo: { regen: 5 }, esc: [[['chakra', '+10 de chakra', { chakra: 10 }], ['elemento', 'Mais um elemento', {}]]] },
      2: { fixo: { attrs: { nin: 1 } } },
      3: { fixo: { attrs: { nin: 1 } }, esc: [umAtr(CCI)] },
      4: { fixo: { regen: 5 }, esc: [[['chakra', '+10 de chakra', { chakra: 10 }], ['elemento', 'Elemento aleatório', {}]]] },
    },
    genjutsu: {
      g: { fixo: { chakra: 25 } },
      2: { fixo: { attrs: { gen: 1 } } },
      3: { fixo: { attrs: { gen: 1 } }, esc: [umAtr(CCI)] },
      4: { fixo: { chakra: 15 } },
    },
    taijutsu: {
      g: { fixo: { vida: 5, soco: 1 } },
      1: { fixo: { desl: 1 } },
      2: { fixo: { attrs: { tai: 1 } } },
      3: { fixo: { attrs: { tai: 1 } }, esc: [umAtr(CCI)] },
      4: { fixo: { vida: 5, soco: 1 } },
    },
    armas: {
      g: { esc: [[['arremesso', '+250 g de arremesso por PA', { arremesso: 250 }], ['carga', '+500 g de carregamento', { carga: 0.5 }]]] },
      2: { fixo: { attrs: { des: 1 } } },
      3: { fixo: { attrs: { des: 1 } }, esc: [umAtr(CCI)] },
      4: { esc: [[['arremesso', '+200 g de arremesso por PA', { arremesso: 200 }], ['carga', '+500 g de carregamento', { carga: 0.5 }]]] },
    },
    kugutsu: {
      g: { fixo: { chakra: 25, carga: 0.5 } },
      2: { fixo: { attrs: { nin: 1 } } },
      3: { fixo: { attrs: { nin: 1 } }, esc: [umAtr(CCI)] },
      4: { fixo: { chakra: 15 } },
    },
    resistencia: {
      g: { fixo: { vida: 15 } },
      2: { fixo: { attrs: { cons: 1 } } },
      3: { fixo: { attrs: { cons: 1 } }, esc: [umAtr(CCI)] },
      4: { fixo: { vida: 15 } },
    },
    medicina: {
      g: { fixo: { regen: 5 } },
      2: { esc: [umAtr(TODOS)] },
      3: { esc: [umAtr(TODOS), umAtr(CCI)] },
      4: { fixo: { regen: 5 } },
    },
    jiongu: {
      2: { esc: [umAtr(TODOS)] },
      3: { esc: [umAtr(TODOS), umAtr(CCI)] },
    },
  };

  // Requerimentos de técnicas, normalizados a partir dos que aparecem no livro de jutsus.
  // [grupo, nome, expressão que reconhece o texto do livro]
  const REQUERIMENTOS = [];
  const req = (g, n, re) => REQUERIMENTOS.push([g, n, re]);
  // opções com "ou" (alternativas) vêm primeiro para não virarem dois requisitos
  req('Técnica', 'Kage Bunshin no Jutsu ou Tajū Kage Bunshin no Jutsu', /kage bunshin.* ou .*taj/i);
  req('Perícia', 'Segunda Perícia de Taijutsu ou Ninjutsu', /segunda per[ií]cia/i);
  req('Doujutsu e estados', 'Rinne Sharingan Vermelho ou Rinne Sharingan Roxo', /vermelho ou/i);
  [['Aburame: Kikaichū', /kikaich/i], ['Aburame: Rinkaichu', /rinkaich/i], ['Akimichi', /akimichi/i], ['Hoozuki', /hoozuki/i],
    ['Hyuuga', /hyuuga/i], ['Inuzuka', /^(cl[aã]\s+)?inuzuka$/i], ['Nara', /^(cl[aã]\s+)?nara$/i], ['Sarutobi', /sarutobi/i],
    ['Senju', /senju/i], ['Uchiha', /uchiha/i], ['Uzumaki', /uzumaki/i], ['Yamanaka', /yamanaka/i]]
    .forEach(([n, re]) => req('Clã', 'Clã ' + n, re));
  // nomes como aparecem no documento de Jutsus
  [['Aojorou Kekkei Genkai', /aojorou/i], ['Bakuton I Kekkei Genkai', /bakuton\s*i\b(?!i)/i], ['Kekkei Genkai Kibaku Nendo', /kibaku\s*nendo|bakuton\s*ii/i],
    ['Habilidade Inata Choujuu Giga', /choujuu/i], ['Habilidade Inata Hyouton', /hyouton/i], ['Habilidade Inata Jinton', /jinton/i],
    ['Habilidade Inata Kami', /\bkami\b/i], ['Mokuton Kekkei Genkai', /mokuton kekkei|^mokuton$/i], ['Habilidade Inata Punhos Bêbados', /punhos/i],
    ['Habilidade Inata Roubo de Chakra', /roubo de chakra/i], ['Habilidade Inata Senninka', /senninka/i], ['Habilidade Inata Sensorial', /sensorial$/i],
    ['Habilidade Inata Shakuton', /shakuton/i], ['Habilidade Siameses', /siames/i], ['Habilidade Inata Tubarão', /tubar[aã]o/i], ['Habilidade Tubos de Ar', /tubos de ar/i]]
    .forEach(([n, re]) => req('Habilidade inata', n, re));
  req('Kinjutsu', 'Kinjutsu Jashin', /jashin/i);
  req('Kinjutsu', 'Kinjutsu Jiongu', /^(kinjutsu\s+)?jiongu$/i);
  req('Kinjutsu', 'Perícia Jiongu Nível 3', /per[ií]cia jiongu/i);
  [['Katon', 'katon'], ['Suiton', 'suiton'], ['Fuuton', 'f[uū]u?ton'], ['Raiton', 'raiton'], ['Doton', 'doton']].forEach(([n, r]) => {
    req('Kinjutsu', 'Máscara de ' + n, new RegExp('m[aá]scara de ' + r, 'i'));
  });
  req('Kinjutsu', 'Máscara do Shinigami', /shinigami/i);
  [['Katon', 'katon'], ['Suiton', 'suiton'], ['Fuuton', 'f[uū]u?ton'], ['Raiton', 'raiton'], ['Doton', 'doton']].forEach(([n, r]) => {
    req('Elemento', 'Elemento ' + n, new RegExp('^(elemento\\s+)?' + r + '$', 'i'));
  });
  req('Doujutsu e estados', 'Sharingan', /^sharingan$/i);
  req('Doujutsu e estados', 'Sharingan com 3 Tomoe', /3 tomoe/i);
  req('Doujutsu e estados', 'Mangekyou Sharingan', /mangekyou/i);
  req('Doujutsu e estados', 'Rinnegan', /^rinnegan$/i);
  req('Doujutsu e estados', 'Rinne Sharingan Vermelho', /^rinne sharingan vermelho$/i);
  req('Doujutsu e estados', 'Rinne Sharingan Roxo', /^rinne sharingan roxo$/i);
  req('Doujutsu e estados', 'Selo Amaldiçoado', /selo amaldi/i);
  req('Doujutsu e estados', 'Ser um Jinchuuriki', /ser um jinchuuriki/i);
  req('Doujutsu e estados', 'Selo que une Jinchuuriki e Bijuu deve estar enfraquecido', /selo que une/i);
  ['Sapos', 'Cobras', 'Lesmas', 'Doki'].forEach((n) => req('Invocação', 'Pacto com ' + n, new RegExp('pacto com ' + n, 'i')));
  req('Invocação', 'Pacto com um animal de rank B', /animal de rank b/i);
  req('Invocação', 'Pacto com um animal de rank A', /animal de rank a/i);
  req('Invocação', 'Kuchiyose - Doki', /kuchiyose - doki/i);
  [['Perícia de Ninjutsu', 'ninjutsu'], ['Perícia de Genjutsu', 'genjutsu'], ['Perícia de Taijutsu', 'taijutsu'], ['Perícia em Armas', 'armas'],
    ['Perícia em Kugutsu', 'kugutsu'], ['Perícia em Resistência', 'resist'], ['Perícia Medicinal', 'medic'], ['Perícia em Fuuinjutsu', 'fuuinjutsu']].forEach(([n, k]) => {
    [1, 2, 3, 4].forEach((lv) => req('Perícia', `${n} nível ${lv}`,
      new RegExp(`per[ií]cia[^/]*${k}[^/]*n[ií]vel\\s*${lv}|per[ií]cia\\s+n[ií]vel\\s*${lv}[^/]*${k}`, 'i')));
  });
  for (let i = 1; i <= 8; i++) req('Portões', `${i}º Portão`, new RegExp(`^${i}º port`, 'i'));
  req('Modificador', '1 no Modificador de Genjutsu', /1 no modificador de genjutsu/i);
  req('Modificador', '5 no Modificador de Ninjutsu', /5 no mod/i);
  [['Kugutsu no Jutsu', /kugutsu no jutsu/i], ['Kage Bunshin no Jutsu', /^kage bunshin/i], ['Shōsen Jutsu (Técnica da Palma Mística)', /sh[oō]sen/i],
    ['Rasengan', /^rasengan$/i], ['Kinobiri', /^kinobiri$/i], ['Henge no Jutsu', /^henge/i], ['Hiraishin no Jutsu', /hiraishin/i],
    ['Baika no Jutsu', /^baika/i], ['Chou Baika no Jutsu', /chou baika/i], ['Chō Mōdo', /ch[oō] m[oō]do/i], ['Kagemane no Jutsu', /kagemane/i],
    ['Shintenshin no Jutsu', /shintenshin/i], ['Inuzuka Ryuu: Jinjuu Konbi Henge: Soutourou', /soutourou/i],
    ['Transformação cão gigante ativada', /c[aã]o gigante/i], ['Suika no Jutsu', /suika/i], ['Shikigami no Mai', /shikigami/i],
    ['Kumo Nenkin (Ouro Pegajoso da Aranha)', /kumo nenkin/i], ['C2', /^c2$/i], ['Raiton Chakura Mōdo', /raiton chakura/i],
    ['Arte Sábia da Liberação de Madeira', /arte s[aá]bia/i], ['Mokuton Bunshin no Jutsu', /mokuton bunshin/i],
    ['Genbusō Kyoku', /genbus/i], ['Técnica Jichinsai Ativa', /jichinsai/i], ['Ataque de Combinação Mortal', /combina[cç][aã]o mortal/i]]
    .forEach(([n, re]) => req('Técnica', n, re));
  [['Selos com as duas mãos', /selos com (as )?duas m/i], ['Juntar as mãos', /juntar as m/i], ['Alvo parado', /alvo parado/i],
    ['Água ao redor', /[aá]gua/i], ['Nuvens Carregadas', /nuvens/i], ['Caverna', /caverna/i], ['Superfície Sólida', /superf[ií]cie/i],
    ['Solo', /^solo$/i], ['Um sacrifício humano vivo', /sacrif[ií]cio/i], ['Óleo na sua composição corporal', /[oó]leo/i],
    ['Rolo de Pano', /rolo de pano/i], ['Gunbai', /gunbai/i], ['Argila', /argila/i], ['Cão e dono', /c[aã]o e dono/i],
    ['Estabelecer um local para o teleporte', /teleporte/i], ['Passar 15 PA parado carregando chakra natural, possuindo desvantagem na defesa', /chakra natural|desvantagem na defesa/i]]
    .forEach(([n, re]) => req('Condição', n, re));

  return {
    ATRIBUTOS, PERICIAS_AUTO, REQUERIMENTOS, CLASSES, CLAS, INATAS, TALENTOS, PERICIAS, ESPECIALIZACOES, ALINHAMENTOS, ELEMENTOS, PATENTES,
    ESCALONAMENTO, SOCO, RANKS, PONTOS_TREINO, TABELA_TREINO, CONDICOES, CD_RANK, DISTANCIAS,
    PORTOES, JASHIN_PENALIDADES, BIJUUS,
  };
})();

// Transcrito de "RPG Naruto - Armas & Mercadorias".
// peso em gramas (null quando o documento não informa).
window.CATALOGO_ITENS = [
  // --ARMAS NINJA--
  { g: 'Armas Ninja', n: 'Shuriken', dano: '1d4', range: 'Longo', custo: '10 Ryo', peso: 250 },
  { g: 'Armas Ninja', n: 'Kunai', dano: '1d6', range: 'Curto ou Corpo-a-corpo', custo: '250 Ryo', peso: 250 },
  { g: 'Armas Ninja', n: 'Kusarigama', dano: '1d6', range: 'Médio', custo: '250 Ryo', peso: 1000, obs: 'Uma foice com uma corrente que permite que o ninja realize ataques com alcance maiores sem perder a arma de sua mão.' },
  { g: 'Armas Ninja', n: 'Espada', dano: '1d8', range: 'Corpo-a-corpo', custo: '250 Ryo', peso: 500 },
  { g: 'Armas Ninja', n: 'Fuuma Shuriken', dano: '1d10', range: 'Longo', custo: '20 Ryo', peso: 500 },
  { g: 'Armas Ninja', n: 'Bo', dano: '1d6', range: 'Corpo-a-Corpo', custo: '400 Ryo', peso: 1000, obs: 'Um bastão que é normalmente utilizado pelos ninjas do clã Akimichi, pode usar o atributo de constituição para atacar.' },
  { g: 'Armas Ninja', n: 'Pergaminho', dano: '', range: '-', custo: '150 Ryo', peso: 500, obs: 'Pode armazenar até 1 quilo.' },
  { g: 'Armas Ninja', n: 'Pergaminho Grande', dano: '', range: '-', custo: '500 Ryo', peso: 2000, obs: 'Pode armazenar até 4 quilos.' },
  { g: 'Armas Ninja', n: 'Shuriken Gigante', dano: '2d6 + 2d4', range: 'Longo', custo: '40 Ryo', peso: 1000 },
  { g: 'Armas Ninja', n: 'Papel Bomba', dano: '1d4', range: 'Corpo-a-corpo; Área Pequena', custo: '10 Ryo', peso: 50 },
  { g: 'Armas Ninja', n: 'Agulha', dano: '1', range: 'Curto', custo: '4 Ryo', peso: 75 },
  { g: 'Armas Ninja', n: 'Nunchaku', dano: '2d6', range: 'Corpo-a-Corpo', custo: '450 Ryo', peso: 500, obs: 'Para utilizar a arma o ninja deve possuir no mínimo 1 no seu modificador de Destreza. Utiliza o modificador de Taijutsu nos seus ataques. Pode ser utilizada na sua DN de Taijutsu, dessa forma ganhará +1 no valor. Essa arma sempre irá ocupar as duas mãos do usuário.' },
  { g: 'Armas Ninja', n: 'Lançador de Arremessáveis', dano: 'Arremessa até 1Kg', range: 'Da arma', custo: '800 Ryo', peso: 500, obs: 'Precisa de Perícia em Armas Nível 2. Com o custo de 1 PA o ninja irá lançar todas as armas colocadas dentro do equipamento, esse ataque possuirá somente uma rolagem de destreza e é preciso das duas mãos livres. Para recolocar as armas no lançador, o ninja deve gastar um turno inteiro em Concentração.' },

  // --MERCADORIAS--
  { g: 'Mercadorias', n: 'Papel de Camuflagem', range: '-', custo: '20 Ryo', peso: 100, obs: 'Permite ao ninja se camuflar em um terreno. Dando vantagem nos seus testes de Furtividade (Destreza) desde que se mantenha parado e em Concentração.' },
  { g: 'Mercadorias', n: 'Barraca para descanso', range: '-', custo: '1000 Ryo', peso: 1500, obs: 'Usada para fazer um acampamento em um terreno não tão apropriado para descanso. Com ela um ninja pode realizar um descanso longo em qualquer local, pode ser usada somente uma vez e é limitada para 1 ninja.' },
  { g: 'Mercadorias', n: 'Fios de aço (1 metro)', range: '-', custo: '10 Ryo/metro', peso: 50, obs: 'Serve como um fio para conectar armas e outros itens.' },
  { g: 'Mercadorias', n: 'Bomba de Fumaça', range: 'Médio; Área Grande', custo: '20 Ryo', peso: 200, obs: 'Cria uma esfera de fumaça que cega todos que estiverem dentro e quem decidir realizar uma jogada de ataque contra alguém dentro da fumaça também terá o efeito de cegueira. Dura até o fim do próximo turno de ataque do usuário.' },
  { g: 'Mercadorias', n: 'Bomba de Luz', range: 'Médio; Área Pequena', custo: '50 Ryo', peso: 200, obs: 'Uma bomba que ao estourar libera um grande feixe de luz causando cegueira nos ninjas afetados, dura até o fim do próximo turno de ataque do usuário.' },
  { g: 'Mercadorias', n: 'Makibishi', range: 'Médio; Área Grande', custo: '150 Ryo', peso: 500, obs: 'Torna o ambiente em terreno difícil (diminuindo o deslocamento pela metade, arredondado para cima) para todos os ninjas na área.' },
  { g: 'Mercadorias', n: 'Leque Dobrável Gigante', range: '-', custo: '', peso: null, obs: 'Por conseguir manipular o vento com maior precisão, todos os jutsus de Fuuton recebem um aumento de 1d8 no dano.' },
  { g: 'Mercadorias', n: 'Guizo', range: '-', custo: '1 Ryo', peso: 10, obs: 'Uma pequena esfera de metal com um sino dentro.' },
  { g: 'Mercadorias', n: 'Pacote de batatinhas fritas', range: '-', custo: '50 Ryo', peso: 200, obs: 'Um pacote de batatas que pode possuir diversos sabores. Utilizado pelos usuários do Clã Akimichi na técnica “Comer Batatinhas”.' },
  { g: 'Mercadorias', n: 'Kit de Conserto para Marionetes', range: '-', custo: '100 Ryo', peso: 250, obs: 'Kit para conserto que é utilizado em um descanso curto para recuperar totalmente a vida das marionetes que o ninja possui. Limite de um uso por kit comprado. Precisa de Perícia em Kugutsu nível 1.' },
  { g: 'Mercadorias', n: 'Garrafa de Saquê', range: '-', custo: '100 Ryo', peso: 500, obs: 'Garrafa com aproximadamente meio litro de Saquê, uma bebida alcoólica feita de arroz.' },
  { g: 'Mercadorias', n: 'Loteria Ninja', range: '-', custo: '10 Ryo', peso: 0, obs: 'O ninja compra um bilhete de um jogo de azar. (Rola-se um d100, caso caia 100 o ninja irá ganhar 1000 Ryo).' },
  { g: 'Mercadorias', n: 'Pílula dos Inuzuka', range: 'Curto', custo: '-', peso: 50, obs: 'Pílula utilizada na técnica “Juujin Bunshin (Clone da Besta Humana)”. Apenas Inuzukas tem acesso a isso na base do seu clã.' },
  { g: 'Mercadorias', n: 'Instrumento musical', range: '-', custo: '500 Ryo', peso: 1000, obs: 'Qualquer instrumento musical que pode ser utilizado para tocar música e realizar jutsus.' },

  // --ICHIRAKU RAMEN--
  { g: 'Ichiraku Ramen', n: 'Misso Gyoza-Ramen', custo: '100 Ryo', peso: null, obs: 'Ramen de frutos do mar, com pasta de soja. Vida: 5 · Chakra: -' },
  { g: 'Ichiraku Ramen', n: 'Shoyu Gyoza-Ramen', custo: '100 Ryo', peso: null, obs: 'Ramen de frutos do mar, temperado especialmente com molho de soja. Vida: - · Chakra: 5' },
  { g: 'Ichiraku Ramen', n: 'Shio Gyoza-Ramen', custo: '100 Ryo', peso: null, obs: 'Ramen de frutos do mar, temperado com sal. Vida: 3 · Chakra: 3' },
  { g: 'Ichiraku Ramen', n: 'Shio Tyashu-Ramen', custo: '200 Ryo', peso: null, obs: 'Ramen com carne de porco, temperado com sal. Vida: 12 · Chakra: -' },
  { g: 'Ichiraku Ramen', n: 'Shoyu Tyashu-Ramen', custo: '200 Ryo', peso: null, obs: 'Ramen com carne de porco, temperado especialmente com molho de soja. Vida: - · Chakra: 12' },
  { g: 'Ichiraku Ramen', n: 'Misso Tyashu-Ramen', custo: '200 Ryo', peso: null, obs: 'Ramen com carne de porco, acompanhando pasta de soja. Vida: 7 · Chakra: 7' },
  { g: 'Ichiraku Ramen', n: 'Shio Yasai-Ramen', custo: '400 Ryo', peso: null, obs: 'Ramen de verduras e legumes, temperado com sal. Vida: 25 · Chakra: -' },
  { g: 'Ichiraku Ramen', n: 'Shoyu Yasai-Ramen', custo: '400 Ryo', peso: null, obs: 'Ramen de verduras e legumes, temperado especialmente com molho de soja. Vida: - · Chakra: 25' },
  { g: 'Ichiraku Ramen', n: 'Misso Yasai-Ramen', custo: '400 Ryo', peso: null, obs: 'Ramen de verduras e legumes, com pasta de soja. Vida: 15 · Chakra: 15' },
  { g: 'Ichiraku Ramen', n: 'Shio Ebi-Ramen', custo: '800 Ryo', peso: null, obs: 'Ramen de camarão, temperado com sal. Vida: 60 · Chakra: -' },
  { g: 'Ichiraku Ramen', n: 'Shoyu Ebi-Ramen', custo: '800 Ryo', peso: null, obs: 'Ramen de camarão, temperado especialmente com molho de soja. Vida: - · Chakra: 60' },
  { g: 'Ichiraku Ramen', n: 'Misso Ebi-Ramen', custo: '800 Ryo', peso: null, obs: 'Ramen de camarão, com pasta de soja. Vida: 35 · Chakra: 35' },

  // --MERCADO NEGRO--
  { g: 'Mercado Negro', n: 'Veneno', dano: '1d4 por Turno', range: '-', custo: '', peso: 75, obs: 'Um recipiente com veneno. Pode gastar 1 PA numa ação para banhar alguma arma corpo-a-corpo com o veneno, adicionando DPT de veneno por 3 turnos à arma.' },
  { g: 'Mercado Negro', n: 'Poção de Vida', custo: '-', peso: null, obs: '' },
  { g: 'Mercado Negro', n: 'Poção de Chakra', custo: '-', peso: null, obs: '' },
  { g: 'Mercado Negro', n: 'Antídoto', custo: '-', peso: null, obs: '' },
  { g: 'Mercado Negro', n: 'Removedor de Queimadura', custo: '-', peso: null, obs: '' },

  // --ARMAS CONHECIDAS--
  { g: 'Armas Conhecidas', n: 'Agulha Envenenada', dano: '1d4 por Turno', range: 'Curto', custo: '30 Ryo', peso: 150, obs: 'Uma agulha normal que além de causar seu dano padrão no acerto (1) adiciona DPT de veneno no seu alvo. Utilizado por: Shizune.' },
  { g: 'Armas Conhecidas', n: 'Estaca', dano: '1d8 (3d12 + 4d10)', range: 'Corpo-a-Corpo', custo: '', peso: 250, obs: 'Seu dano aumenta caso seja o ninja atacando a si próprio por poder acertar pontos vitais com extrema facilidade. Utilizado por: Hidan.' },
  { g: 'Armas Conhecidas', n: 'Sanjin no Ōgama (Foice de Lâmina Tripla)', dano: '9d6', range: 'Corpo-a-Corpo e Médio', custo: '', peso: 1000, obs: 'Pode ser usada corpo-a-corpo como qualquer arma normal e também ser controlada por um cabo ligado ao seu braço para atacar a média distância. Utilizado por: Hidan.' },
  { g: 'Armas Conhecidas', n: 'Chakura Tō (Lâmina de Chakra)', dano: '2d10', range: 'Corpo-a-Corpo e Curto', custo: '2000 Ryo', peso: 300, obs: 'Uma lâmina com encaixes que permitem uma pegada semelhante a soqueiras. Estilos de luta que amplificam o poder de uma arma ninja custam a metade do chakra nessa arma. Pode ser arremessada. Pode gastar 26 de chakra para “Chakura Tō: Maichimonji (Lâmina de Chakra: Linha Reta)”, causando 1d12 + 3d10 + 2d8 de dano como ataque de arma corpo-a-corpo. Utilizado por: Sarutobi Asuma.' },
  { g: 'Armas Conhecidas', n: 'Hakkō Chakura Tō (Sabre de Chakra da Luz Branca)', dano: '3d8', range: 'Corpo-a-Corpo', custo: '', peso: 500, obs: 'Uma pequena espada de uma mão que pode utilizar 6 de chakra em cada ataque, demonstrando um rastro branco de chakra e aumentando em 1d8 seu dano. Utilizado por: Hatake Sakumo e Hatake Kakashi.' },

  // --ARMAS LENDÁRIAS--
  { g: 'Armas Lendárias', n: 'Kubikiribōchō (Zambatou)', dano: '10d12 / 12d6 (confira no documento)', range: 'Corpo-a-Corpo', custo: '-', peso: 3000, obs: 'Se quebrada, a espada pode se regenerar após causar um somatório de 60 de dano na vida dos adversários, sobrevidas não são incluídas.' },
  { g: 'Armas Lendárias', n: 'Samehada', dano: '5d6/5d12/10d8', range: 'Corpo-a-Corpo', custo: '-', peso: 3000, obs: 'Espada com personalidade própria focada em absorção de chakra, com reservatório próprio de até 200. Coberta: rouba 6d4 de chakra, 5d6 de dano. Semi Descoberta (30): 5d12 de dano, rouba 8d4. Descoberta (150): 10d8 de dano, rouba 12d4, peso 5kg. Consulte o documento para todos os efeitos.' },
];

// Marionetes padrão e componentes
window.CATALOGO_MARIONETES = [
  { n: 'Marionete Básica I', pv: 12, atk: -1, desl: 3, comp: 1, peso: 1000, custo: '500 Ryo' },
  { n: 'Marionete Básica II', pv: 18, atk: 0, desl: 5, comp: 2, peso: 1500, custo: '1000 Ryo' },
  { n: 'Marionete Básica III', pv: 35, atk: 1, desl: 7, comp: 3, peso: 2000, custo: '2000 Ryo' },
];

window.CATALOGO_COMPONENTES = [
  ['Camuflagem', 1, '-', '150 Ryo', 'A marionete consegue se esconder embaixo da terra para realizar um ataque furtivo. A ação de se camuflar custa 1 PA.'],
  ['Lançador de Bombas', 1, '-', '150 Ryo', 'Pode lançar uma bomba de fumaça ou luz por alguma articulação. Range Longo.'],
  ['Abraço de Urso', 1, '-', '150 Ryo', 'Adiciona um par de braços potentes que conseguem realizar ações de agarrão nos seus alvos.'],
  ['Propulsores', 1, '-', '200 Ryo', 'Jatos que, ativados com chakra, aumentam o próximo deslocamento em 5 metros. 1 uso por turno.'],
  ['Escudo Pequeno', 1, '-', '150 Ryo', 'Um pequeno escudo de metal que resiste até 8 de dano.'],
  ['Lançador de Agulhas Pequeno', 1, '3', '175 Ryo', 'Arremessa 3 agulhas de uma só vez em um único alvo. Range Curto.'],
  ['Lançador de Kunais Pequeno', 1, '1d6', '175 Ryo', 'Arremessa 1 kunai no seu alvo. Range Curto.'],
  ['Granadeiro Pequeno', 1, '1d4', '200 Ryo', 'Lança um pequeno objeto esférico de papel bomba. Range Longo; Área Pequena.'],
  ['Super Abraço de Urso', 1, '1d4', '200 Ryo', 'Braços que causam dano ao alvo agarrado a cada turno. Precisa de 1 “abraço de urso” para cada.'],
  ['Lançador de Shurikens Pequeno', 1, '1d4', '175 Ryo', 'Arremessa 1 shuriken em um único alvo. Range Longo.'],
  ['Membros separáveis', 1, '-', '', 'O corpo pode se dividir entre seus componentes; cada parte tem metade do deslocamento.'],
  ['Canhão de Fumaça', 1, '', '', 'Dispara fumaça em forma de cone, com as mesmas propriedades das bombas. Range Médio.'],
  ['Mãos Leves', 2, '2d6', '400 Ryo', 'Socos com dano mais elevado. Não pode ser usado com “mãos pesadas”.'],
  ['Abraço Serrilhado', 2, '1d8', '350 Ryo', 'Braços com serras que cortam o alvo agarrado a cada turno. Precisa de 1 “abraço de urso” para cada.'],
  ['Escudo Médio', 2, '-', '300 Ryo', 'Um escudo resistente de metal que aguenta até 14 de dano.'],
  ['Amontoado de Lâminas', 2, '-', '400 Ryo', 'Junta todas as lâminas da marionete numa arma com o dano de todas elas somadas.'],
  ['Lâmina Pequena', 2, '1d10', '300 Ryo', 'Uma lâmina de 30 cm nas articulações para atacar corpo-a-corpo.'],
  ['Lançador de Agulhas Médio', 2, '10', '350 Ryo', 'Arremessa 10 agulhas de uma só vez. Range Curto.'],
  ['Lançador de Shurikens Médio', 2, '3d4', '350 Ryo', 'Arremessa 3 shurikens de uma só vez. Range Longo.'],
  ['Lançador de Kunais Médio', 2, '3d6', '350 Ryo', 'Arremessa 3 kunais de uma só vez. Range Curto.'],
  ['Veneno I', 2, '1d4', '400 Ryo', 'Adiciona DPT de veneno em todas suas armas de corte.'],
  ['Granadeiro Médio', 2, '3d4', '400 Ryo', 'Lança 3 esferas de papel bomba no mesmo alvo. Range Longo; Área Pequena.'],
  ['Escudo Grande', 3, '-', '600 Ryo', 'Um grande e resistente escudo de metal que aguenta até 26 de dano.'],
  ['Lançador de Kunais Grande', 3, '5d6', '650 Ryo', 'Arremessa 5 kunais de uma só vez. Range Curto.'],
  ['Lançador de Agulhas Grande', 3, '17', '650 Ryo', 'Arremessa 17 agulhas de uma só vez. Range Curto.'],
  ['Lâmina Grande', 3, '1d12 + 1d8', '700 Ryo', 'Peça da marionete equipada com uma grande lâmina ou espada.'],
  ['Granadeiro Grande', 3, '5d4', '700 Ryo', 'Lança 5 esferas de papel bomba no mesmo alvo. Range Longo; Área Pequena.'],
  ['Lançador de Shurikens Grande', 3, '6d4', '750 Ryo', 'Arremessa 6 shurikens de uma só vez. Range Longo.'],
  ['Veneno II', 3, '1d8', '750 Ryo', 'Adiciona DPT de veneno em todas suas armas de corte.'],
  ['Mãos Pesadas', 3, '2d12', '800 Ryo', 'Socos potentes. Não pode ser usado com “mãos leves”.'],
  ['Kikō Junbū (Escudo de Luz Bloqueador Mecânico)', 3, '-', '', 'O chakra se espalha como uma película fina, bloqueando até 20 de dano.'],
  ['Tronco caixão', 3, '-', '', 'Prende o alvo dentro da barriga; armas ninjas atacam com vantagem. O preso defende com DN de Constituição. Sai se liberado ou se a marionete sofrer 13 de dano.'],
  ['Fumaça Envenenada', 4, '2d6', '1500 Ryo', 'Bomba de fumaça envenenada; quem passar recebe DPT de veneno por 3 turnos. Range Longo; Área Grande.'],
  ['Serra Circular', 4, '2d12 + 1d6', '1400 Ryo', 'Uma serra giratória acoplada no corpo da marionete.'],
  ['Lança-chamas', 4, '3d10', '1600 Ryo', 'Lança-chamas com DPT adicional de 1d8 (não acumula com Katon). Range Médio.'],
  ['Lançador de Água', 4, '3d12', '1200 Ryo', 'Lança um jato de água que causa empurrão. Range Longo.'],
];

// Transcrito de "RPG Naruto - Criaturas & Invocações".
// Só entram aqui as criaturas com ficha preenchida no documento.
window.CATALOGO_CRIATURAS = [
  // Invocações Rank B (Buscar Invocação)
  { g: 'Invocação Rank B', n: 'Cachorros', pv: 28, dn: 9, atk: '+1', dano: '1D8+1D6', desl: 6, hab: 'Caso possua um objeto de referência, pode utilizar dele para farejar um ninja em distância longa.' },
  { g: 'Invocação Rank B', n: 'Falcão', pv: 25, dn: 8, atk: '+1', dano: '2D6', desl: 7, hab: 'Voar, consegue carregar apenas 1 ninja.' },
  { g: 'Invocação Rank B', n: 'Gato', pv: 25, dn: 8, atk: '+3', dano: '2D6', desl: 5, hab: '-' },
  { g: 'Invocação Rank B', n: 'Gorila', pv: 25, dn: 11, atk: '+1', dano: '2D6', desl: 5, hab: '-' },
  { g: 'Invocação Rank B', n: 'Tubarão (Mar)', pv: 35, dn: 11, atk: '+3', dano: '2D10', desl: 7, hab: '-' },
  { g: 'Invocação Rank B', n: 'Tartaruga (Mar)', pv: 25, dn: 5, atk: '-1', dano: '-', desl: 3, hab: 'Aumenta o modificador de inteligência do ninja em 1 para todos os testes.' },
  { g: 'Invocação Rank B', n: 'Tigre', pv: 25, dn: 8, atk: '+1', dano: '2D12', desl: 5, hab: '-' },
  { g: 'Invocação Rank B', n: 'Urso', pv: 35, dn: 8, atk: '+1', dano: '2D6', desl: 5, hab: '-' },

  // Rank A
  { g: 'Invocação Rank A', n: 'Aranha Mãe', pv: 42, dn: 8, atk: '+2', dano: '2d6', desl: 7, hab: 'Ataques básicos causam 1d4 de DPT de veneno; 2 PA para lançar teia em alcance médio, atordoando o alvo (CD 5); turno inteiro para criar 3 aranhas filhotes; ao morrer libera 5 aranhas filhotes; anda em paredes e na água.' },
  { g: 'Invocação Rank A', n: 'Aranha Filhote', pv: 1, dn: 4, atk: '-1', dano: '1d4', desl: 7, hab: 'Consegue andar tanto em paredes quanto na água.' },
  { g: 'Invocação Rank A', n: 'Doki', pv: 35, dn: 8, atk: '+2', dano: '2d12', desl: 5, hab: '-' },

  // Rank S - Lesmas
  { g: 'Invocação Rank S', n: 'Katsuyu Pequena', pv: 6, dn: 0, atk: '-', dano: '-', desl: 1, hab: 'Pode ficar acoplada em um ninja para que o invocador utilize “Shōsen Jutsu (Técnica da Palma Mística)” através dela. Ao morrer, divide-se em 2 da categoria menor (vida 4).' },
  { g: 'Invocação Rank S', n: 'Katsuyu Média', pv: 35, dn: 10, atk: '0', dano: '2d4 (Curto)', desl: 5, hab: 'Acoplamento para Shōsen Jutsu; pode gastar seu turno para se acoplar a um ninja corpo-a-corpo e realizar a defesa no seu lugar. Ao morrer, divide-se em 2 menores (vida 20).' },

  // Sapos
  { g: 'Sapos', n: 'Gamaden', pv: 5, dn: -1, atk: '-1', dano: '1d4', desl: 3, hab: 'Um pequeno sapo verde pálido com detalhes em azul. Não é usado em batalha.' },
  { g: 'Sapos', n: 'Gamatama', pv: 5, dn: -1, atk: '-1', dano: '1d4', desl: 3, hab: 'Um pequeno sapo branco com detalhes em rosa. Não é usado em batalha.' },
  { g: 'Sapos', n: 'Kōsuke', pv: 8, dn: 0, atk: '-1', dano: '1d4', desl: 5, hab: 'Pode carregar um pergaminho pequeno em suas costas. Sem ameaça, percorre distâncias maiores que todos os sapos pequenos e médios.' },
  { g: 'Sapos', n: 'Gerotora', pv: 15, dn: 0, atk: '-1', dano: '1d4', desl: 2, hab: 'Reside dentro do corpo do contratante. Estende o abdômen em um pergaminho grande que pode ter qualquer selamento ou mensagem escrita.' },
  { g: 'Sapos', n: 'Gamatatsu', pv: 20, chakra: 40, dn: 2, atk: '+2', dano: '2d6', desl: 5, hab: 'Kōsuke (Projétil do Óleo de Sapo). Suiton: Teppoudama (Liberação de Água: Tiro da Arma).' },
  { g: 'Sapos', n: 'Gamakichi', pv: 35, chakra: 25, dn: 1, atk: '+3', dano: '3d8', desl: 8, hab: 'Katon: Endan (Liberação de Fogo: Bola de Fogo).' },
  { g: 'Sapos', n: 'Gama', pv: 60, dn: 3, atk: '+1', dano: '2d8', desl: 6, hab: 'Pode atacar ou enraizar o corpo todo de um ninja com sua língua (range curto, CD 12). Consegue carregar um adulto nas costas.' },

  // Rinnegan
  { g: 'Rinnegan', n: 'Pássaro Bico-de-Broca Gigante', pv: 25, dn: 8, atk: '+3', dano: '2d6', desl: 7, hab: 'Pode voar. Pode carregar até 3 ninjas.' },
  { g: 'Rinnegan', n: 'Centopeia Gigante', pv: 25, dn: 8, atk: '+1', dano: '2d6', desl: 10, hab: 'Consegue carregar até 4 ninjas.' },
  { g: 'Rinnegan', n: 'Quimera Gigante', pv: 15, dn: 8, atk: '+3', dano: '1d8 por cabeça', desl: 5, hab: 'Vida 15 por cabeça. Ao chegar a 0, perde o próximo turno e revive com vida completa e 1 cabeça extra. Cada cabeça faz uma jogada de ataque corpo-a-corpo por turno.' },
  { g: 'Rinnegan', n: 'Camaleão Gigante', pv: 25, dn: 8, atk: '+1', dano: '2d6', desl: 5, hab: 'Pode ficar invisível (+4 na DN, cegueira para quem o ataca). Pode carregar um ninja dentro de sua boca.' },
  { g: 'Rinnegan', n: 'Touro Gigante', pv: 25, dn: 8, atk: '+3', dano: '2d12', desl: 5, hab: '-' },
  { g: 'Rinnegan', n: 'Rinoceronte Gigante', pv: 35, dn: 8, atk: '+1', dano: '2d12', desl: 5, hab: '-' },
  { g: 'Rinnegan', n: 'Crustáceo Gigante', pv: 25, dn: 8, atk: '+3', dano: '2d8', desl: 5, hab: 'Libera pela boca uma técnica de Suiton com alcance médio que causa 2d6 de dano.' },

  // Cachorros Inuzuka (Fase 1): vida por nível
  { g: 'Cachorro Inuzuka', n: 'Cachorro equilibrado', pvNivel: 6, dn: 2, atk: '+2', dano: '', desl: '', hab: 'Um pequeno cachorro que acompanha seu dono Inuzuka. 6 de vida por nível.' },
  { g: 'Cachorro Inuzuka', n: 'Cachorro de ataque', pvNivel: 6, dn: 1, atk: '+3', dano: '', desl: '', hab: 'Um cachorro pequeno que acompanha seu dono Inuzuka. 6 de vida por nível.' },
  { g: 'Cachorro Inuzuka', n: 'Cachorro de defesa', pvNivel: 8, dn: 3, atk: '+1', dano: '', desl: '', hab: 'Um cachorro mais resistente que acompanha seu dono Inuzuka. 8 de vida por nível.' },
];

// Tabela de Invocação Reversa (d20)
window.INVOCACAO_REVERSA = [
  ['20', 'Sapo'], ['19', 'Cobra'], ['18', 'Lesma'], ['17-16', 'Rei Macaco'], ['15-14', 'Salamandra'], ['13-12', 'Doki'],
  ['11-10', 'Baku'], ['9-8', 'Fuinha'], ['7-6', 'Concha'], ['5-4', 'Portão'], ['3-2', 'Aranha'], ['1', 'Rodar novamente o dado'],
];

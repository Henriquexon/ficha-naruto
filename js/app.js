(function () {
  'use strict';

  const R = window.REGRAS;
  const CAT_J = window.CATALOGO_JUTSUS || [];
  const CAT_I = window.CATALOGO_ITENS || [];
  const CAT_C = window.CATALOGO_CRIATURAS || [];
  const CAT_M = window.CATALOGO_MARIONETES || [];
  const CAT_COMP = window.CATALOGO_COMPONENTES || [];
  const STORE = 'ficha-naruto:v1';
  const RANK_ORD = { E: -1, D: 0, C: 1, B: 2, A: 3, S: 4 };
  const RANKS_JUTSU = ['E', 'D', 'C', 'B', 'A', 'S'];
  const ALCANCES = ['-', 'Corpo-a-Corpo', 'Curto', 'Médio', 'Longo'];
  const AREAS = ['-', 'Pequeno', 'Grande'];
  const APRENDIZADOS = ['C', 'I', 'T', 'D'];
  const TIPOS_JUTSU = ['Ninjutsu', 'Taijutsu', 'Kenjutsu'];
  const NIVEIS_PERICIA = [4, 9, 14, 19];
  const NIVEIS_UPGRADE = [5, 10, 15, 20];
  const NIVEIS_COMPRA = [1, 2, 4, 7, 9, 12, 14, 17, 19, 20];

  // ---------------------------------------------------------------- util
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sinal = (n) => (n > 0 ? '+' + n : String(n));
  const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
  const uid = () => Math.random().toString(36).slice(2, 10);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const attrNome = (id) => (R.ATRIBUTOS.find((a) => a.id === id) || {}).nome || id;
  const attrCurto = { car: 'Car', cons: 'Cons', des: 'Des', gen: 'Gen', int: 'Int', nin: 'Nin', tai: 'Tai' };
  const rankLetra = (s) => { const m = String(s || '').trim().match(/^[EDCBAS]\b/i); return m ? m[0].toUpperCase() : '—'; };

  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }
  function setPath(obj, path, val) {
    const ks = path.split('.');
    let o = obj;
    for (let i = 0; i < ks.length - 1; i++) {
      if (o[ks[i]] == null || typeof o[ks[i]] !== 'object') o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      o = o[ks[i]];
    }
    o[ks[ks.length - 1]] = val;
  }

  // ---------------------------------------------------------------- modelo
  function fichaVazia() {
    const attrs = {};
    R.ATRIBUTOS.forEach((a) => { attrs[a.id] = { pts: 0 }; });
    return {
      v: 2, id: uid(), nome: '', jogador: '', nivel: 1, patente: 'Gennin',
      cla: 'sem', claEscolha: 'nin', classe: 'equilibrado', classeEscolhas: [], nivel20Attr: '',
      inatas: [], elementos: [], attrs,
      bonus: { vida: 0, chakra: 0, regen: 0, desl: 0, carga: 0, arremesso: 0, dn: 0 },
      pvAtual: null, chakraAtual: null, sobrevida: 0, sobrechakra: 0, protagonismo: null,
      morte: { v: 0, d: 0 }, condicoes: {}, pa: 3, soco: 1,
      dn: { nin: '', gen: '', contra: '', contraAttr: 'tai' },
      esp: {}, pericias: ['', '', '', ''], periciasEsc: [{}, {}, {}, {}], talentosPericia: [], talentos: [],
      upgrades: { 5: '', 10: '', 15: '', 20: '' },
      jutsus: [], itens: [], ryo: 0, companheiros: [], marionetes: [],
      bijuu: { nome: '', aliado: false, papinho: 0 },
      sharingan: { nivel: 0, cegueira: 0 },
      portoes: R.PORTOES.map(() => ({ aprendido: false, treinado: false, penal: 0, ativo: false })),
      jashin: 0, mascaras: [],
      treinos: [], treinoCalc: { dur: 'curto', rank: '' },
      alinhamento: '', ideal: '', fraqueza: '', vinculo: '', historia: '', notas: '',
    };
  }

  function normalizar(f) {
    const base = fichaVazia();
    const out = Object.assign(base, f || {});
    R.ATRIBUTOS.forEach((a) => { out.attrs[a.id] = { pts: num(((f && f.attrs && f.attrs[a.id]) || {}).pts) }; });
    out.bonus = Object.assign(fichaVazia().bonus, (f && f.bonus) || {});
    out.dn = Object.assign(fichaVazia().dn, (f && f.dn) || {});
    out.morte = Object.assign({ v: 0, d: 0 }, (f && f.morte) || {});
    out.bijuu = Object.assign(fichaVazia().bijuu, (f && f.bijuu) || {});
    out.sharingan = Object.assign(fichaVazia().sharingan, (f && f.sharingan) || {});
    out.upgrades = Object.assign(fichaVazia().upgrades, (f && f.upgrades) || {});
    out.treinoCalc = Object.assign(fichaVazia().treinoCalc, (f && f.treinoCalc) || {});
    if (!Array.isArray(out.portoes) || out.portoes.length !== R.PORTOES.length) out.portoes = fichaVazia().portoes;
    ['inatas', 'elementos', 'jutsus', 'itens', 'companheiros', 'marionetes', 'talentos', 'talentosPericia', 'treinos', 'mascaras', 'classeEscolhas']
      .forEach((k) => { if (!Array.isArray(out[k])) out[k] = []; });
    if (!Array.isArray(out.pericias)) out.pericias = ['', '', '', ''];
    while (out.pericias.length < 4) out.pericias.push('');
    if (!Array.isArray(out.periciasEsc)) out.periciasEsc = [];
    for (let i = 0; i < 4; i++) if (!out.periciasEsc[i] || typeof out.periciasEsc[i] !== 'object') out.periciasEsc[i] = {};
    // v1: o exemplo somava a perícia de Ninjutsu à mão; agora ela é automática
    if (num(out.v, 1) < 2 && /\(exemplo\)$/.test(out.nome || '') && out.pericias[0] === 'ninjutsu') {
      out.bonus.chakra = Math.max(0, num(out.bonus.chakra) - 10);
      out.bonus.regen = Math.max(0, num(out.bonus.regen) - 5);
    }
    out.jutsus = out.jutsus.map((j) => {
      estruturarJutsu(j);
      if (!Array.isArray(j.reqs)) j.reqs = reqsDe(j.req).reqs;
      const fora = j.reqs.filter((r) => !GRUPO_REQ[r]);
      if (fora.length) {
        j.reqs = [...new Set(j.reqs.flatMap((r) => (GRUPO_REQ[r] ? [r] : reqsDe(r).reqs)))];
        const soltos = fora.filter((r) => !reqsDe(r).exato);
        if (soltos.length) j.notas = [`Requerimentos: ${soltos.join(', ')}`, j.notas].filter(Boolean).join('\n');
      }
      if (j.tipo === undefined) j.tipo = TIPO_CAT[j.cat] || '';
      estruturarDano(j);
      marcarJutsu(j);
      j.aprim = clamp(num(j.aprim), 0, 6);
      return j;
    });
    out.itens = out.itens.map(estruturarItem);
    out.v = 2;
    out.nivel = clamp(num(out.nivel, 1), 1, 20);
    out.pa = clamp(num(out.pa, 3), 1, 5);
    if (out.patente === 'ANBU') out.patente = 'Anbu';
    return out;
  }

  function fichaExemplo() {
    const f = fichaVazia();
    f.nome = 'Kaede Uchiha (exemplo)';
    f.jogador = 'Ficha de demonstração';
    f.nivel = 5; f.patente = 'Gennin';
    f.cla = 'uchiha'; f.classe = 'equilibrado'; f.classeEscolhas = ['nin', 'des'];
    f.elementos = ['katon', 'fuuton'];
    f.attrs.nin.pts = 2; f.attrs.des.pts = 2; f.attrs.int.pts = 2; f.attrs.tai.pts = 1; f.attrs.cons.pts = 1;
    f.pericias = ['ninjutsu', '', '', ''];
    f.periciasEsc[0] = { g0: 'chakra' };
    f.esp = { percepcao: { on: true }, furtividade: { on: false } };
    f.dn = { nin: 'Kawarimi no Jutsu (Técnica de Substituição de Corpo)', gen: '', contra: '', contraAttr: 'tai' };
    f.upgrades[5] = 'Exemplo: aprimoramento do Goukakyuu no Jutsu.';
    const pega = (nome) => CAT_J.find((j) => j.n.startsWith(nome));
    ['Goukakyuu no Jutsu', 'Kawarimi no Jutsu', 'Shunshin no Jutsu', 'Bunshin no Jutsu', 'Sharingan']
      .map(pega).filter(Boolean).forEach((j) => f.jutsus.push(jutsuDoCatalogo(j)));
    const item = (n, qtd) => { const i = CAT_I.find((x) => x.n === n); if (i) f.itens.push(itemDoCatalogo(i, qtd)); };
    item('Kunai', 4); item('Shuriken', 6); item('Papel Bomba', 3); item('Bomba de Fumaça', 1);
    f.ryo = 350;
    f.sharingan.nivel = 1;
    f.alinhamento = 'LN';
    f.ideal = 'Provar que o clã ainda tem honra.';
    f.fraqueza = 'Não suporta ser subestimada.';
    f.vinculo = 'A bandana do irmão mais velho.';
    f.historia = 'Personagem de exemplo para mostrar como a ficha funciona. Crie uma nova ficha em “Fichas”.';
    return f;
  }

  // Acrescenta um trecho à linha "No livro: …" das anotações (ou cria a linha)
  function notaLivro(o, trecho) {
    const t = String(trecho).replace(/\s+/g, ' ').trim();
    if (!t) return;
    o.notas = /^No livro: /.test(o.notas || '') ? o.notas.replace(/^(No livro: [^\n]*)/, `$1 · ${t}`) : [`No livro: ${t}`, o.notas].filter(Boolean).join('\n');
  }
  // Texto de alcance do livro -> opções de Range e Área
  function alcanceDe(texto) {
    const r = String(texto || '').trim().toLowerCase();
    return {
      alcance: /corpo/.test(r) ? 'Corpo-a-Corpo' : /curt/.test(r) ? 'Curto' : /m[eé]di/.test(r) ? 'Médio' : /long/.test(r) ? 'Longo' : '-',
      area: /pequen/.test(r) ? 'Pequeno' : /grande/.test(r) ? 'Grande' : '-',
      exato: !r || r === '-' || /^(corpo-a-corpo|curto|m[eé]dio|longo)?(;?\s*[aá]rea\s+(pequena|grande))?$/i.test(r),
    };
  }
  const TIPO_CAT = { NINJUTSUS: 'Ninjutsu', TAIJUTSUS: 'Taijutsu', KENJUTSUS: 'Kenjutsu' };
  // Converte os campos de texto do livro para as caixas da ficha. O que não couber
  // exatamente nas opções fica registrado em "Anotações" como "No livro: …".
  function estruturarJutsu(j) {
    if (j.v === 2) return j;
    const livro = [];
    const txt = (v) => String(v == null ? '' : v).trim();
    const rk = txt(j.rank); const letra = rankLetra(rk);
    if (rk && rk !== letra) livro.push(`Rank ${rk}`);
    const c = txt(j.custo); const nC = c.match(/\d+/);
    let tipo = /vida|\bpv\b/i.test(c) && !/chakra/i.test(c) ? 'vida' : /chakra/i.test(c) ? 'chakra' : (nC ? 'chakra' : '-');
    if (!c || /^-+$/.test(c)) tipo = '-';
    if (c && !/^-+$/.test(c) && !/^\d+\s*(de\s+)?(chakra|vida)$/i.test(c)) livro.push(`Custo ${c}`);
    const { alcance, area, exato } = alcanceDe(j.range);
    if (!exato) livro.push(`Range ${txt(j.range)}`);
    const rq = reqsDe(j.req);
    if (!rq.exato) livro.push(`Requerimentos ${txt(j.req)}`);
    const p = txt(j.pa); const nP = p.match(/\d+/);
    if (p && p !== '-' && !/^\d+\s*PA$/i.test(p)) livro.push(`Custo de Ações ${p}`);
    const a = txt(j.apr); const ap = (a.match(/^[CITD]\b/i) || [''])[0].toUpperCase();
    if (a && a !== '-' && a.toUpperCase() !== ap) livro.push(`Aprendizado ${a.replace(/\s+/g, ' ')}`);
    const nota = livro.length ? `No livro: ${livro.join(' · ')}` : '';
    return Object.assign(j, {
      v: 2, reqs: rq.reqs, tipo: TIPO_CAT[j.cat] || '', rank: letra === '—' ? '' : letra, custoTipo: tipo, custoQtd: tipo === '-' ? 0 : (nC ? Number(nC[0]) : 0),
      paQtd: nP ? Number(nP[0]) : 0, range: alcance, area, apr: ap,
      notas: [nota, txt(j.notas)].filter(Boolean).join('\n'),
    });
  }
  // Dano do livro -> "-" ou quantidade "d" faces. Texto que não couber vai para "No livro: …".
  function estruturarDano(j) {
    if (j.danoTipo) return j;
    const t = String(j.dano == null ? '' : j.dano).trim();
    const m = t.match(/(\d+)\s*d\s*(\d+)/i);
    j.danoTipo = m ? 'd' : '-';
    j.danoQtd = m ? m[1] : '';
    j.danoFaces = m ? m[2] : '';
    if (t && !/^-+$/.test(t) && !/^\d+\s*d\s*\d+$/i.test(t)) notaLivro(j, `Dano ${t}`);
    return j;
  }
  const fmtDano = (j) => (j.danoTipo === 'd' ? `${j.danoQtd || ''}d${j.danoFaces || ''}` : '—');
  const jutsuDoCatalogo = (j) => marcarJutsu(estruturarDano(estruturarJutsu({
    id: uid(), n: j.n, cat: j.cat, grp: j.grp, rank: j.rank, custo: j.custo, efeito: j.efeito, dano: j.dano,
    req: j.req, range: j.range, apr: j.apr, pa: j.pa, aprim: 0, notas: '', origem: 'catalogo',
  })));
  // Texto de requerimento do livro -> opções da caixa (elementos, habilidades inatas, clãs, portões).
  // exato = tudo o que estava escrito virou opção; se não, o texto original vai para as anotações.
  function reqsDe(texto) {
    const reqs = []; let exato = true;
    String(texto || '').split(/[;/,\n]/).map((x) => x.trim().replace(/\.+$/, '').trim())
      .filter((x) => x && !/^-+$/.test(x)).forEach((seg) => {
        const achou = / ou /i.test(seg) ? [] : R.REQUERIMENTOS.filter(([, , re]) => re.test(seg));
        if (!achou.length || / e /i.test(seg)) exato = false;
        achou.forEach(([, n]) => { if (!reqs.includes(n)) reqs.push(n); });
      });
    return { reqs, exato };
  }
  const GRUPO_REQ = {};
  R.REQUERIMENTOS.forEach(([g, n]) => { GRUPO_REQ[n] = g; });
  CAT_J.forEach((j) => { j.reqs = reqsDe(j.req).reqs; });
  const ELEM_CAT = { KATON: 'katon', SUITON: 'suiton', FUUTON: 'fuuton', RAITON: 'raiton', DOTON: 'doton' };
  const ELEM_RE = {
    katon: /\bkaton\b|estilo do fogo|libera[çc][aã]o de fogo/i, suiton: /\bsuiton\b|libera[çc][aã]o de [aá]gua/i,
    fuuton: /\bf[uū]u?ton\b|libera[çc][aã]o de vento/i, raiton: /\braiton\b|libera[çc][aã]o de (raio|rel[aâ]mpago)/i,
    doton: /\bdoton\b|libera[çc][aã]o de terra/i,
  };
  function elementosDe(j) {
    const out = new Set();
    if (ELEM_CAT[j.cat]) out.add(ELEM_CAT[j.cat]);
    Object.entries(ELEM_RE).forEach(([id, re]) => { if (re.test(j.n || '')) out.add(id); });
    (j.reqs || []).forEach((r) => { const m = r.match(/^(Elemento|Máscara de) (\w+)/); if (m && ELEM_RE[m[2].toLowerCase()]) out.add(m[2].toLowerCase()); });
    return out;
  }
  const deCla = (j) => j.cat === 'CLÃS' || (j.reqs || []).some((r) => GRUPO_REQ[r] === 'Clã');
  const deInata = (j) => j.cat === 'HABILIDADES INATAS' || (j.reqs || []).some((r) => GRUPO_REQ[r] === 'Habilidade inata' || GRUPO_REQ[r] === 'Kinjutsu');
  function passaFiltros(j, orig, el) {
    if (orig === 'cla' && !deCla(j)) return false;
    if (orig === 'inata' && !deInata(j)) return false;
    if (el && !elementosDe(j).has(el)) return false;
    return true;
  }
  const filtrosHTML = (idO, idE, o, e) =>
    `<select id="${idO}" aria-label="Filtrar por origem" style="width:auto">${opt('', 'Todas as origens', o)}${opt('cla', 'Técnicas de clã', o)}${opt('inata', 'Técnicas de habilidade inata', o)}</select>
     <select id="${idE}" aria-label="Filtrar por elemento" style="width:auto">${opt('', 'Todos os elementos', e)}${R.ELEMENTOS.map((x) => opt(x.id, x.nome, e)).join('')}</select>`;
  const fmtCusto = (j) => (j.custoTipo === '-' || !j.custoTipo ? '—' : `${num(j.custoQtd)} ${j.custoTipo === 'vida' ? 'Vida' : 'Chakra'}${j.porTurno ? '/turno' : ''}`);
  // Marcações que o livro põe no começo do Efeito ("Defesa.", "Defesa Extra.", "Concentração.", "Estilo de Luta.")
  const MARCAS = [['defesa', 'Defesa'], ['defesaExtra', 'Defesa Extra'], ['concentracao', 'Concentração'], ['estilo', 'Estilo de Luta']];
  function marcarJutsu(j) {
    if (j.defesa !== undefined) return j;
    const inicio = String(j.efeito || '').split('.').slice(0, 3).map((x) => x.trim().toLowerCase());
    j.defesa = inicio.includes('defesa');
    j.defesaExtra = inicio.includes('defesa extra');
    j.concentracao = inicio.includes('concentração');
    j.estilo = inicio.includes('estilo de luta');
    j.porTurno = j.estilo || /turno/i.test(String(j.custo || '')) || /Custo [^·\n]*turno/i.test(String(j.notas || ''));
    return j;
  }
  // Custo por turno de chakra pelo rank (tabela de Chakra Mínimo/Máximo por Turno, Treinos)
  const CUSTO_TURNO = { D: [1, 2], C: [3, 5], B: [7, 10], A: [13, 22] };
  function ajustarCustoTurno(j) {
    if (!j.estilo) return;
    j.porTurno = true;
    if (j.custoTipo === '-' || !j.custoTipo) j.custoTipo = 'chakra';
    const faixa = CUSTO_TURNO[j.rank];
    if (j.custoTipo === 'chakra' && faixa) j.custoQtd = clamp(num(j.custoQtd), faixa[0], faixa[1]);
  }
  function estruturarItem(it) {
    if (it.v === 2) return it;
    const { alcance, exato } = alcanceDe(it.range);
    const rOrig = String(it.range || '').trim();
    it.v = 2;
    estruturarDano(it);
    if (!exato || /[aá]rea/i.test(rOrig)) notaLivro(it, `Range ${rOrig}`);
    it.range = alcance;
    return it;
  }
  const itemDoCatalogo = (i, qtd = 1) => estruturarItem({
    id: uid(), n: i.n, g: i.g, qtd, peso: i.peso == null ? 0 : i.peso, dano: i.dano || '', range: i.range || '',
    custo: i.custo || '', notas: i.obs || '',
  });

  // ---------------------------------------------------------------- armazenamento
  let db;
  function carregar() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { raw = null; }
    if (raw && raw.fichas && Object.keys(raw.fichas).length) {
      Object.keys(raw.fichas).forEach((k) => { raw.fichas[k] = normalizar(raw.fichas[k]); });
      if (!raw.fichas[raw.atual]) raw.atual = Object.keys(raw.fichas)[0];
      return raw;
    }
    const ex = fichaExemplo();
    return { atual: ex.id, fichas: { [ex.id]: ex }, aba: 'ficha' };
  }
  db = carregar();
  let F = db.fichas[db.atual];

  let tSalvar = null;
  function salvar() {
    clearTimeout(tSalvar);
    tSalvar = setTimeout(() => {
      let ok = true;
      try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { ok = false; }
      const s = $('#salvoStatus');
      if (s) s.textContent = ok ? 'Salvo neste navegador · ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Não foi possível salvar neste navegador. Exporte a ficha para não perder dados.';
    }, 250);
  }

  // ---------------------------------------------------------------- regras derivadas
  function rankDoNivel(n) { return n >= 20 ? 'S' : n >= 15 ? 'A' : n >= 10 ? 'B' : n >= 5 ? 'C' : 'D'; }
  function percepcaoBase(n) { return n >= 20 ? 16 : n >= 17 ? 14 : n >= 12 ? 12 : n >= 7 ? 10 : 8; }

  // Custo da tabela de distribuição de atributos: +1 por passo até 1; de 1 para 2 custa 2.
  function custoAtributo(inicio, pts) {
    let c = 0, v = inicio, acima = false;
    for (let i = 0; i < pts; i++) { c += v >= 1 ? 2 : 1; v++; if (v > 2) acima = true; }
    return { c, acima };
  }

  function temTalento(nome) { return F.talentos.some((t) => t.nome === nome) || F.talentosPericia.some((t) => t.nome === nome); }
  // menor número citado no custo ("1-2" → 1, "7/6/5/4" → 4)
  const custoMin = (c) => { const ns = String(c).match(/\d+/g); return ns ? Math.min(...ns.map(Number)) : 0; };

  function calc() {
    const D = { attr: {}, claB: {}, clsB: {}, custo: {}, n20: {}, avisos: [] };
    const cla = R.CLAS.find((c) => c.id === F.cla) || R.CLAS[0];
    const cls = R.CLASSES.find((c) => c.id === F.classe);
    D.cla = cla; D.cls = cls;
    R.ATRIBUTOS.forEach((a) => { D.claB[a.id] = cla.attrs[a.id] || 0; D.clsB[a.id] = 0; });
    if (cla.escolha && F.claEscolha) D.claB[F.claEscolha] += cla.escolha;
    if (cls) cls.bonus.forEach((g, i) => {
      const pick = g.op.length === 1 ? g.op[0] : (g.op.includes(F.classeEscolhas[i]) ? F.classeEscolhas[i] : g.op[0]);
      D.clsB[pick] += g.v;
    });
    // Perícias: só contam as vagas já liberadas pelo nível (4, 9, 14, 19)
    const PB = { vida: 0, chakra: 0, regen: 0, desl: 0, carga: 0, arremesso: 0, soco: 0, attrs: {} };
    const somar = (alvo, b) => {
      Object.entries(b || {}).forEach(([k, v]) => {
        if (k === 'attrs') Object.entries(v).forEach(([a, n2]) => { alvo.attrs[a] = (alvo.attrs[a] || 0) + n2; });
        else alvo[k] = (alvo[k] || 0) + v;
      });
    };
    D.periciaCont = {}; D.periciaSlots = [];
    F.pericias.forEach((p, i) => {
      if (!p || F.nivel < NIVEIS_PERICIA[i]) { D.periciaSlots[i] = null; return; }
      const k = (D.periciaCont[p] || 0) + 1; D.periciaCont[p] = k;
      const auto = R.PERICIAS_AUTO[p] || {};
      const esc = F.periciasEsc[i] || {};
      const slot = { id: p, k, escolhas: [], b: { attrs: {} } };
      [['g', auto.g], ['n', auto[k]]].forEach(([pre, def]) => {
        if (!def) return;
        somar(slot.b, def.fixo);
        (def.esc || []).forEach((ops, j) => {
          const key = pre + j;
          const sel = ops.find((o) => o[0] === esc[key]) || ops[0];
          somar(slot.b, sel[2]);
          slot.escolhas.push({ key, ops, sel: sel[0] });
        });
      });
      somar(PB, slot.b);
      D.periciaSlots[i] = slot;
    });
    D.periciaB = PB;

    let gasto = 0;
    R.ATRIBUTOS.forEach((a) => {
      const inicio = -1 + D.claB[a.id];
      const pts = Math.max(0, num(F.attrs[a.id].pts));
      const k = custoAtributo(inicio, pts);
      D.custo[a.id] = k.c; gasto += k.c;
      if (k.acima) D.avisos.push(`${a.nome} passou de 2 na distribuição inicial.`);
      D.n20[a.id] = F.nivel >= 20 ? 1 + (F.nivel20Attr === a.id ? 1 : 0) : 0;
      D.attr[a.id] = inicio + pts + D.clsB[a.id] + (PB.attrs[a.id] || 0) + D.n20[a.id];
    });
    D.pontosAttr = gasto;
    if (gasto > 9) D.avisos.push(`Foram gastos ${gasto} pontos; o limite na criação é 9.`);

    const A = D.attr, n = F.nivel;
    D.rank = rankDoNivel(n);
    D.vidaDado = cla.vidaFixa || (cls ? cls.vida : 0);
    D.chakraDado = cla.chakraFixo || (cls ? cls.chakra : 0);
    D.consNivel = A.cons >= 0 ? Math.floor(A.cons / 2) : A.cons;
    D.vidaNivel = D.vidaDado + (cla.vidaNivel || 0) + D.consNivel;
    D.vidaMax = Math.max(0, n * D.vidaNivel + num(F.bonus.vida) + PB.vida);
    let ch = n * (D.chakraDado + (cla.chakraNivel || 0)) + num(F.bonus.chakra) + PB.chakra;
    D.chakraBase = ch;
    D.mestreTai = temTalento('Mestre em Taijutsu');
    if (D.mestreTai) ch = Math.max(1, Math.floor(ch / 2));
    const bj = R.BIJUUS.find((b) => b.nome === F.bijuu.nome);
    D.bijuu = bj;
    D.bijuuRed = 0;
    if (bj) {
      const porNivel = bj.caudas <= 3 ? 2 : bj.caudas <= 6 ? 3 : 4;
      D.bijuuPorNivel = porNivel;
      if (!F.bijuu.aliado) { D.bijuuRed = porNivel * n; ch = Math.max(2, ch - D.bijuuRed); }
    }
    D.chakraMax = Math.max(0, ch);
    D.regen = 5 + (n >= 10 ? 5 : 0) + num(F.bonus.regen) + PB.regen;
    D.desl = 5 + A.des + num(F.bonus.desl) + PB.desl;
    D.percepcao = percepcaoBase(n) + A.int;
    D.carga = Math.max(0, 2.5 + A.cons) + num(F.bonus.carga) + PB.carga;
    D.arremesso = 500 + num(F.bonus.arremesso) + PB.arremesso;
    const b = num(F.bonus.dn);
    D.dn = {
      tai: 6 + A.tai + b, nin: 8 + A.nin + b, cons: 10 + A.cons + b, des: 6 + A.des + b,
      gen: 8 + A.gen + b, contra: 4 + (A[F.dn.contraAttr] || 0) + b, int: D.percepcao + b,
    };
    D.protMax = Math.max(0, A.car);
    D.espQtd = n >= 20 ? 7 : n >= 10 ? 3 : 1;
    D.espBonus = n >= 20 ? 4 : n >= 10 ? 2 : 1;
    D.espUsadas = R.ESPECIALIZACOES.filter((e) => F.esp[e.id] && F.esp[e.id].on).length;
    D.dadosDescanso = n >= 20 ? 6 : n >= 10 ? 3 : 1;
    D.pc = { cla: cla.pc || 0, inatas: 0, talentos: 0 };
    F.inatas.forEach((id) => { const h = R.INATAS.find((x) => x.id === id); D.pc.inatas += (h && h.pc) || 0; });
    F.talentos.forEach((t) => { D.pc.talentos += num(t.pc); });
    D.pc.total = D.pc.cla + D.pc.inatas + D.pc.talentos;
    D.peso = F.itens.reduce((s, i) => s + num(i.qtd) * num(i.peso), 0);
    D.pontosPericia = Object.entries(D.periciaCont).reduce((s, [id, c]) => (id === 'jiongu' ? s : s + (c >= 2 ? 4 : 0) + (c >= 4 ? 4 : 0)), 0);
    D.pontosPericiaGastos = F.talentosPericia.reduce((s, t) => s + num(t.pts), 0);
    D.jutsuExtra = A.car > 0 ? Math.ceil(A.car / 2) : 0;
    D.paMax = Math.min(5, 3 + (A.int >= 3 ? 1 + Math.floor((A.int - 3) / 2) : 0));
    if (temTalento('Um Passo à Frente') && A.int >= 1) D.paMax = Math.max(D.paMax, 4);
    // Soco: nível escolhido + níveis da perícia de Taijutsu; sem a 2ª perícia o máximo é o nível 4 (2d6)
    const socoMax = (D.periciaCont.taijutsu || 0) >= 2 ? 12 : 4;
    D.socoNv = clamp(clamp(num(F.soco, 1), 1, 12) + PB.soco, 1, socoMax);
    D.soco = R.SOCO[D.socoNv];
    const kug = D.periciaCont.kugutsu || 0;
    D.marionetesMax = 1 + (kug >= 2 ? 1 : 0) + (kug >= 3 ? 1 : 0) + (kug >= 4 ? 1 : 0);
    D.elementosFixos = [].concat(cla.elementos || [], ...F.inatas.map((id) => (R.INATAS.find((h) => h.id === id) || {}).elementos || []));
    return D;
  }

  let D = calc();

  function garantirAtuais() {
    if (F.pvAtual == null) F.pvAtual = D.vidaMax;
    if (F.chakraAtual == null) F.chakraAtual = D.chakraMax;
    if (F.protagonismo == null) F.protagonismo = D.protMax;
    if (num(F.pvAtual) > D.vidaMax) F.pvAtual = D.vidaMax;
    if (num(F.chakraAtual) > D.chakraMax) F.chakraAtual = D.chakraMax;
    if (num(F.protagonismo) > D.protMax) F.protagonismo = D.protMax;
  }

  // ---------------------------------------------------------------- UI: topo
  let aba = db.aba || 'ficha';

  function atualizarTopo() {
    $('#seloLetra').textContent = D.rank;
    $('#nivelVal').textContent = F.nivel;
    const nome = $('#topoNome');
    if (document.activeElement !== nome) nome.value = F.nome;
    const partes = [D.cla.id !== 'sem' ? D.cla.nome : 'Sem clã', D.cls ? D.cls.nome : '', F.patente].filter(Boolean);
    $('#topoSub').textContent = partes.join(' · ');
    const pv = num(F.pvAtual), ck = num(F.chakraAtual);
    $('#barVida').style.width = (D.vidaMax ? clamp(pv / D.vidaMax, 0, 1) * 100 : 0) + '%';
    $('#barChakra').style.width = (D.chakraMax ? clamp(ck / D.chakraMax, 0, 1) * 100 : 0) + '%';
    $('#barVidaTxt').textContent = `${pv} / ${D.vidaMax}` + (num(F.sobrevida) ? ` +${F.sobrevida}` : '');
    $('#barChakraTxt').textContent = `${ck} / ${D.chakraMax}` + (num(F.sobrechakra) ? ` +${F.sobrechakra}` : '');
    $('#barVidaSobre').hidden = true; $('#barChakraSobre').hidden = true;
    $$('.abas [role="tab"]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aba === aba)));
    document.title = F.nome ? `${F.nome} · Ficha Ninja` : 'Ficha Ninja';
  }

  function atualizarDerivados() {
    D = calc();
    atualizarTopo();
    $$('[data-d]').forEach((el) => {
      const v = getPath(D, el.dataset.d);
      let t = v == null ? '' : v;
      if (el.dataset.fmt === 'sinal') t = sinal(v);
      if (el.dataset.fmt === 'kg') t = fmtKg(v);
      if (el.dataset.fmt === 'g') t = fmtKg(v / 1000);
      el.textContent = t;
      if (el.classList.contains('mod')) el.classList.toggle('neg', v < 0);
    });
    $$('[data-v]').forEach((el) => {
      const v = getPath(F, el.dataset.v);
      if (document.activeElement !== el) el.textContent = v == null ? '' : v;
    });
    const pa = $('#avisosAttr');
    if (pa) {
      pa.hidden = !D.avisos.length;
      pa.innerHTML = D.avisos.map(esc).join('<br>');
    }
  }
  function modTitulo(id) {
    const partes = [];
    if (D.periciaB.attrs[id]) partes.push(`${sinal(D.periciaB.attrs[id])} das perícias`);
    if (D.n20[id]) partes.push(`${sinal(D.n20[id])} do nível 20`);
    return partes.length ? ` title="Inclui ${partes.join(' e ')}"` : '';
  }
  const fmtKg = (kg) => (Math.round(num(kg) * 100) / 100).toLocaleString('pt-BR') + ' kg';

  // ---------------------------------------------------------------- UI helpers
  const opt = (v, t, sel) => `<option value="${esc(v)}"${String(sel) === String(v) ? ' selected' : ''}>${esc(t)}</option>`;
  const inp = (k, val, extra = '') => `<input data-k="${k}" value="${esc(val)}" ${extra}>`;
  const numInp = (k, val, extra = '') => `<input type="number" data-k="${k}" value="${esc(val)}" ${extra}>`;
  const area = (k, val, extra = '') => `<textarea data-k="${k}" ${extra}>${esc(val)}</textarea>`;
  // caixa de seleção; se o valor salvo não estiver entre as opções, mostra "—" até o usuário escolher
  const selecao = (k, ops, val) => `<select data-k="${k}" data-r>${ops.includes(val) ? '' : opt('', '—', '')}${ops.map((o) => opt(o, o, val)).join('')}</select>`;
  // Dano "-" ou quantidade "d" faces, tudo numa caixa só
  const danoCampo = (k, o) => `<div class="campo"><span>Dano</span><div class="combo">
      ${o.danoTipo === 'd' ? `<input data-k="${k('danoQtd')}" class="so-digitos" inputmode="numeric" value="${esc(o.danoQtd)}" placeholder="0" aria-label="Quantidade de dados">` : ''}
      <select data-k="${k('danoTipo')}" data-r aria-label="Tipo de dano">${opt('-', '-', o.danoTipo)}${opt('d', 'd', o.danoTipo)}</select>
      ${o.danoTipo === 'd' ? `<input data-k="${k('danoFaces')}" class="so-digitos" inputmode="numeric" value="${esc(o.danoFaces)}" placeholder="0" aria-label="Faces do dado">` : ''}
    </div></div>`;
  const tecnicaDN = (k, val) => {
    const nomes = [...new Set(F.jutsus.filter((j) => j.defesa || j.defesaExtra).map((j) => j.n).filter(Boolean))];
    return `<select data-k="${k}">${opt('', '—', nomes.includes(val) ? val : '')}${nomes.map((n) => opt(n, n, val)).join('')}</select>`;
  };
  const campo = (rot, html) => `<label class="campo"><span>${rot}</span>${html}</label>`;
  const stat = (rot, valorHtml, det = '') => `<div class="stat"><span class="rotulo">${rot}</span><span class="valor">${valorHtml}</span>${det ? `<span class="det">${det}</span>` : ''}</div>`;

  // ---------------------------------------------------------------- ABA: Ficha
  function abaFicha() {
    const cla = D.cla, cls = D.cls;
    const inataOpts = R.INATAS.filter((h) => !F.inatas.includes(h.id))
      .map((h) => opt(h.id, `${h.nome}${h.pc != null ? ` (${h.pc} PC)` : ''}`)).join('');
    const clsSel = cls ? cls.bonus.map((g, i) => g.op.length === 1
      ? `<span class="tag">+${g.v} ${attrCurto[g.op[0]]}</span>`
      : `<select data-k="classeEscolhas.${i}" data-r aria-label="Bônus de classe ${i + 1}">${g.op.map((o) => opt(o, `+${g.v} ${attrNome(o)}`, g.op.includes(F.classeEscolhas[i]) ? F.classeEscolhas[i] : g.op[0])).join('')}</select>`).join('') : '';

    const identidade = `
    <section class="painel c7">
      <div class="painel-topo"><h2>Identidade</h2><span class="extra">Rank <b>${D.rank}</b> pelo nível ${F.nivel}</span></div>
      <div class="campos">
        ${campo('Jogador', inp('jogador', F.jogador))}
        <div class="pilha" style="gap:6px">${campo('Nível', numInp('nivel', F.nivel, 'min="1" max="20" data-r'))}${F.nivel >= 20 ? `<select data-k="nivel20Attr" data-r aria-label="Atributo que recebe o +1 extra do nível 20">${opt('', '+1 extra: escolha', F.nivel20Attr)}${R.ATRIBUTOS.map((a) => opt(a.id, `+1 ${a.nome}`, F.nivel20Attr)).join('')}</select>` : ''}</div>
        ${campo('Patente', `<select data-k="patente">${R.PATENTES.map((p) => opt(p, p, F.patente)).join('')}</select>`)}
      </div>
      <div class="campos">
        ${campo('Clã', `<select data-k="cla" data-r title="${esc(cla.desc)}">${R.CLAS.map((c) => `<option value="${c.id}" title="${esc(c.desc)}"${c.id === F.cla ? ' selected' : ''}>${esc(c.nome)}${c.pc != null ? ` · ${c.pc} PC` : ''}</option>`).join('')}</select>`)}
        ${cla.escolha ? campo('Atributo do clã', `<select data-k="claEscolha" data-r>${R.ATRIBUTOS.map((a) => opt(a.id, `+1 ${a.nome}`, F.claEscolha)).join('')}</select>`) : ''}
        ${campo('Classe', `<select data-k="classe" data-r>${R.CLASSES.map((c) => opt(c.id, c.nome, F.classe)).join('')}</select>`)}
      </div>
      ${cls ? `<div class="linha"><span class="rotulo">Classe</span><span class="sub">${cls.vida} vida/nível · ${cls.chakra} chakra/nível${cla.vidaFixa ? ' (Hoozuki: 6 vida e 6 chakra por nível)' : ''}</span>${clsSel}</div>` : ''}
      <div class="pilha">
        <span class="rotulo">Elementos</span>
        <div class="chips">${R.ELEMENTOS.map((e) => {
          const fixo = D.elementosFixos.includes(e.id);
          const on = fixo || F.elementos.includes(e.id);
          return `<button class="chip${fixo ? ' fixo' : ''}" aria-pressed="${on}" ${fixo ? 'disabled title="Vem do clã ou habilidade inata"' : `data-acao="elemento" data-id="${e.id}"`} title="${esc(e.efeito)}">${e.nome}</button>`;
        }).join('')}</div>
      </div>
      <div class="pilha">
        <span class="rotulo">Habilidades inatas</span>
        <div class="chips">${F.inatas.map((id) => { const h = R.INATAS.find((x) => x.id === id) || { nome: id }; return `<span class="chip fixo" title="${esc(h.desc)}">${esc(h.nome)}${h.kinjutsu ? ' <span class="tag aviso">Kinjutsu</span>' : ''}<button class="x" data-acao="remInata" data-id="${id}" aria-label="Remover ${esc(h.nome)}">×</button></span>`; }).join('') || '<span class="sub">Nenhuma.</span>'}</div>
        <select id="addInata" aria-label="Adicionar habilidade inata"><option value="">+ Adicionar habilidade inata…</option>${inataOpts}</select>
      </div>
      ${blocoPontosCriacao()}
    </section>`;

    const vit = painelVitalidade();

    const linhasAttr = R.ATRIBUTOS.map((a) => `
      <tr>
        <td><div class="attr-nome">${a.nome}</div></td>
        <td class="c num">${sinal(D.claB[a.id])}</td>
        <td class="c"><input type="number" class="micro" min="0" max="5" data-k="attrs.${a.id}.pts" value="${F.attrs[a.id].pts}" aria-label="Pontos distribuídos em ${a.nome}"><div class="attr-desc"><span data-d="custo.${a.id}">${D.custo[a.id]}</span> pt</div></td>
        <td class="c num">${sinal(D.clsB[a.id])}</td>
        <td class="c"><span class="mod${D.attr[a.id] < 0 ? ' neg' : ''}" data-d="attr.${a.id}" data-fmt="sinal"${modTitulo(a.id)}>${sinal(D.attr[a.id])}</span></td>
      </tr>`).join('');

    const atributos = `
    <section class="painel c7">
      <div class="painel-topo"><h2>Atributos</h2><span class="extra">Distribuídos: <b class="num" data-d="pontosAttr">${D.pontosAttr}</b> de 9</span></div>
      <div class="tabela-wrap"><table class="tab-attr">
        <thead><tr><th>Atributo</th><th class="c">Clã</th><th class="c">Pontos</th><th class="c">Classe</th><th class="c">Mod</th></tr></thead>
        <tbody>${linhasAttr}</tbody>
      </table></div>
      <div class="aviso" id="avisosAttr" ${D.avisos.length ? '' : 'hidden'}>${D.avisos.map(esc).join('<br>')}</div>
      <p class="sub">Todo atributo começa em −1. Na criação distribua 9 pontos (máximo 2 por atributo); passar de 1 para 2 custa 2 pontos.</p>
    </section>`;

    const dnCard = (id, nome, form) => `<div class="dn"><div class="dn-topo"><span class="dn-nome">${nome}</span><span class="dn-valor num" data-d="dn.${id}">${D.dn[id]}</span></div><span class="dn-form">${form}</span></div>`;
    const defesas = `
    <section class="painel c5">
      <div class="painel-topo"><h2>Defesa Ninja (DN)</h2></div>
      <div class="dns">
        ${dnCard('tai', 'Taijutsu', '6 + Tai')}
        ${dnCard('nin', 'Ninjutsu', '8 + Nin')}
        ${dnCard('cons', 'Constituição', '10 + Cons')}
        ${dnCard('des', 'Destreza', '6 + Des')}
        ${dnCard('gen', 'Genjutsu', '8 + Gen')}
        ${dnCard('int', 'Inteligência', '= percepção passiva')}
        ${dnCard('contra', 'Contra-ataque', `4 + <select data-k="dn.contraAttr" data-r aria-label="Atributo do contra-ataque" style="width:auto;padding:1px 4px">${R.ATRIBUTOS.map((a) => opt(a.id, attrCurto[a.id], F.dn.contraAttr)).join('')}</select>`)}
      </div>
      <div class="campos">
        ${campo('Técnica na DN de Ninjutsu', tecnicaDN('dn.nin', F.dn.nin))}
        ${campo('Técnica na DN de Genjutsu', tecnicaDN('dn.gen', F.dn.gen))}
        ${campo('Técnica de contra-ataque', tecnicaDN('dn.contra', F.dn.contra))}
        ${campo('Bônus em todas as DN', numInp('bonus.dn', F.bonus.dn))}
      </div>
    </section>`;

    const combate = `
    <section class="painel c7">
      <div class="painel-topo"><h2>Combate</h2></div>
      <div class="stats">
        ${stat('Deslocamento', `<span data-d="desl">${D.desl}</span> m`)}
        ${stat('Pontos de Ação', `${numInp('pa', F.pa, 'min="1" max="5" class="mini"')}`)}
        ${stat('Regen. de chakra', `<span data-d="regen">${D.regen}</span>`)}
        ${stat('Percepção passiva', `<span data-d="percepcao">${D.percepcao}</span>`)}
        <div class="stat"><span class="rotulo">Soco</span><span class="valor">${D.soco[1]} <small>Nv ${D.socoNv}</small></span><select class="stat-sel" data-k="soco" data-r aria-label="Nível base do soco">${R.SOCO.slice(1).map((s, i) => opt(i + 1, `Nível base ${i + 1}`, F.soco)).join('')}</select></div>
        ${stat('Carregamento', `<span data-d="peso" data-fmt="g">${fmtKg(D.peso / 1000)}</span> / <span data-d="carga" data-fmt="kg">${fmtKg(D.carga)}</span>`)}
        ${stat('Arremesso por PA', `<span data-d="arremesso">${D.arremesso}</span> g`)}
        ${stat('Protagonismo', `<span class="linha" style="gap:6px;flex-wrap:nowrap"><button class="btn-ico" data-acao="prot" data-d2="-1" aria-label="Usar ponto de protagonismo">−</button><span><span data-v="protagonismo">${F.protagonismo}</span>/<span data-d="protMax">${D.protMax}</span></span><button class="btn-ico" data-acao="prot" data-d2="1" aria-label="Recuperar ponto de protagonismo">+</button></span>`)}
      </div>
      <details class="item"><summary><span class="item-linha"><span class="item-nome">Bônus extras</span></span></summary>
        <div class="item-corpo">
          <div class="campos">
            ${campo('Vida máxima', numInp('bonus.vida', F.bonus.vida))}
            ${campo('Chakra máximo', numInp('bonus.chakra', F.bonus.chakra))}
            ${campo('Regeneração de chakra', numInp('bonus.regen', F.bonus.regen))}
            ${campo('Deslocamento', numInp('bonus.desl', F.bonus.desl))}
            ${campo('Carregamento (kg)', numInp('bonus.carga', F.bonus.carga, 'step="0.25"'))}
            ${campo('Arremesso por PA (g)', numInp('bonus.arremesso', F.bonus.arremesso, 'step="50"'))}
          </div>
        </div>
      </details>
    </section>`;

    const esp = `
    <section class="painel c5">
      <div class="painel-topo"><h2>Especializações</h2><span class="extra"><b data-d="espUsadas">${D.espUsadas}</b> de ${D.espQtd} · bônus +${D.espBonus}</span></div>
      <div class="esp">${R.ESPECIALIZACOES.map((e) => {
        const st = F.esp[e.id] || {};
        const at = e.attrs.includes(st.attr) ? st.attr : e.attrs[0];
        const tot = D.attr[at] + (st.on ? D.espBonus : 0);
        return `<input type="checkbox" id="esp-${e.id}" data-k="esp.${e.id}.on" data-r ${st.on ? 'checked' : ''}>
          <label for="esp-${e.id}" class="esp-n" title="${esc(e.desc)}">${e.nome}</label>
          <span class="esp-sel">${e.attrs.length > 1 ? `<select data-k="esp.${e.id}.attr" data-r aria-label="Atributo de ${e.nome}">${e.attrs.map((a) => opt(a, attrCurto[a], at)).join('')}</select>` : `<span class="tag">${attrCurto[at]}</span>`}</span>
          <span class="esp-t">${sinal(tot)}</span>`;
      }).join('')}</div>
      <p class="sub">Testes de especialização só são usados fora de batalha. ${D.espUsadas > D.espQtd ? '<span class="tag aviso">Acima do limite do nível</span>' : ''}</p>
    </section>`;

    return `<div class="grade">${identidade}${vit}${atributos}${defesas}${combate}${esp}</div>`;
  }

  function blocoPontosCriacao() {
    const talOpts = R.TALENTOS.filter((t) => !temTalento(t.nome)).map((t) => opt(t.nome, `${t.nome} (${t.pc} PC)`)).join('');
    return `
    <div class="secao">
      <div class="painel-topo"><h3>Pontos de Criação</h3><span class="extra"><b class="num">${D.pc.total}</b> de 20 PC</span></div>
      <div class="stats">
        ${stat('Clã', D.pc.cla)}${stat('Habilidades inatas', D.pc.inatas)}${stat('Talentos', D.pc.talentos)}
      </div>
      ${D.pc.total > 20 ? '<div class="aviso">Os PC gastos passaram de 20.</div>' : ''}
      <span class="rotulo">Talentos</span>
      <div class="lista">${F.talentos.map((t, i) => { const def = R.TALENTOS.find((x) => x.nome === t.nome) || {}; return `
        <div class="item"><div class="item-corpo">
          <div class="item-linha"><span class="item-nome">${esc(t.nome)}</span><label class="linha sub">PC ${numInp(`talentos.${i}.pc`, t.pc, 'class="micro" min="0" data-r')}</label><button class="btn-ico" data-acao="remTalento" data-i="${i}" aria-label="Remover talento">×</button></div>
          <p class="sub">${esc(def.desc || '')}${def.pc && /[-/]/.test(def.pc) ? ` <span class="tag">custo ${esc(def.pc)}</span>` : ''}</p>
        </div></div>`; }).join('') || '<div class="vazio">Nenhum talento.</div>'}</div>
      <select id="addTalento" aria-label="Adicionar talento"><option value="">+ Adicionar talento…</option>${talOpts}</select>
    </div>`;
  }

  function painelVitalidade() {
    const cond = R.CONDICOES.map((c) => `<button class="chip" aria-pressed="${!!F.condicoes[c.id]}" data-acao="condicao" data-id="${c.id}" title="${esc(c.desc)}">${c.nome}</button>`).join('');
    const recurso = (tipo, rot, atualK, maxD, sobreK, sobreRot) => `
      <div class="recurso ${tipo}">
        <div class="recurso-topo"><span class="rotulo">${rot}</span><span class="recurso-valor"><span data-v="${atualK}">${F[atualK]}</span><small> / <span data-d="${maxD}">${D[maxD]}</span></small></span></div>
        <div class="ajuste">
          <input type="number" id="aj-${tipo}" min="0" placeholder="qtd" aria-label="Quantidade de ${rot.toLowerCase()}">
          <button class="btn peq" data-acao="ajustar" data-alvo="${tipo}" data-s="-1">${tipo === 'vida' ? 'Dano' : 'Gastar'}</button>
          <button class="btn peq" data-acao="ajustar" data-alvo="${tipo}" data-s="1">${tipo === 'vida' ? 'Curar' : 'Recuperar'}</button>
          ${tipo === 'chakra' ? `<button class="btn peq" data-acao="regen" title="Ação de turno inteiro em Concentração">+Regen</button>` : ''}
        </div>
        <label class="linha sub">${sobreRot} ${numInp(sobreK, F[sobreK], 'class="mini" min="0"')}</label>
      </div>`;
    return `
    <section class="painel c5">
      <div class="painel-topo"><h2>Vitalidade</h2><span class="extra">Descanso curto: ${D.dadosDescanso} dado(s)</span></div>
      <div class="recursos">
        ${recurso('vida', 'Vida', 'pvAtual', 'vidaMax', 'sobrevida', 'Sobrevida')}
        ${recurso('chakra', 'Chakra', 'chakraAtual', 'chakraMax', 'sobrechakra', 'Sobrechakra')}
      </div>
      <div class="pilha">
        <span class="rotulo">Testes contra a morte</span>
        <div class="linha">
          <span class="trilha" aria-label="Sucessos">${[1, 2, 3].map((i) => `<input type="checkbox" data-acao="morte" data-t="v" data-i="${i}" ${F.morte.v >= i ? 'checked' : ''} aria-label="Sucesso ${i}">`).join('')} <span class="sub">sucessos</span></span>
          <span class="trilha falha" aria-label="Falhas">${[1, 2, 3].map((i) => `<input type="checkbox" data-acao="morte" data-t="d" data-i="${i}" ${F.morte.d >= i ? 'checked' : ''} aria-label="Falha ${i}">`).join('')} <span class="sub">falhas</span></span>
        </div>
      </div>
      <div class="pilha"><span class="rotulo">Condições</span><div class="chips">${cond}</div></div>
      <div class="linha">
        <button class="btn" data-acao="descansoCurto">Descanso curto</button>
        <button class="btn" data-acao="descansoLongo">Descanso longo</button>
      </div>
    </section>`;
  }

  // ---------------------------------------------------------------- ABA: Jutsus
  const ui = { jq: '', jrank: '', jorig: '', jel: '', cat: { q: '', cat: '', rank: '', meu: false, orig: '', el: '', lim: 40 }, loja: { q: '', g: '' }, criat: { g: '' } };

  function gruposMeus() {
    const g = [].concat(D.cla.grupos || []);
    F.inatas.forEach((id) => { const h = R.INATAS.find((x) => x.id === id); if (h && h.grupos) g.push(...h.grupos); });
    return g;
  }

  function caixaReqs(j, i) {
    const reqs = j.reqs || [];
    const grupos = {};
    R.REQUERIMENTOS.forEach(([g, n]) => { if (!reqs.includes(n)) (grupos[g] = grupos[g] || []).push(n); });
    return `<div class="campo campo-largo"><span>Requerimentos</span><div class="multi">
      ${reqs.map((r, ri) => `<span class="chip fixo">${esc(r)}<button class="x" data-acao="remReq" data-i="${i}" data-ri="${ri}" aria-label="Remover ${esc(r)}">×</button></span>`).join('')}
      <select class="addReq" data-i="${i}" aria-label="Adicionar requerimento"><option value="">${reqs.length ? '+ Adicionar requerimento' : 'Nenhum · escolha para adicionar'}</option>${Object.entries(grupos).map(([g, ns]) => `<optgroup label="${esc(g)}">${ns.map((n) => opt(n, n)).join('')}</optgroup>`).join('')}</select>
    </div></div>`;
  }

  function cartaoJutsu(j, i) {
    const k = (f) => `jutsus.${i}.${f}`;
    if (!j.id) j.id = uid();
    return `<details class="item" data-id="${esc(j.id)}">
      <summary>
        <span class="item-linha"><span class="rank">${rankLetra(j.rank)}</span><span class="item-nome">${esc(j.n) || '<i>Sem nome</i>'}</span>${MARCAS.filter(([m]) => j[m]).map(([, t]) => `<span class="tag">${t}</span>`).join('')}${num(j.aprim) && j.rank !== 'S' ? `<span class="tag">Aprim. ${j.aprim}</span>` : ''}</span>
        <span class="item-meta"><span>Custo <b>${esc(fmtCusto(j))}</b></span><span>PA <b>${num(j.paQtd)}</b></span><span>Range <b>${esc(j.range && j.range !== '-' ? j.range : '—')}</b></span>${j.area && j.area !== '-' ? `<span>Área <b>${esc(j.area)}</b></span>` : ''}<span>Dano <b>${esc(fmtDano(j))}</b></span>${j.cat ? `<span>${esc(j.grp || j.cat)}</span>` : ''}</span>
      </summary>
      <div class="item-corpo">
        <div class="campos">
          ${campo('Nome', inp(k('n'), j.n))}
          ${campo('Rank', selecao(k('rank'), RANKS_JUTSU, j.rank))}
          ${campo('Tipo', selecao(k('tipo'), TIPOS_JUTSU, j.tipo))}
          <div class="campo"><span>Custo</span><div class="linha" style="gap:6px;flex-wrap:nowrap">
            ${j.custoTipo !== '-' ? numInp(k('custoQtd'), num(j.custoQtd), `${j.estilo && j.custoTipo === 'chakra' && CUSTO_TURNO[j.rank] ? `min="${CUSTO_TURNO[j.rank][0]}" max="${CUSTO_TURNO[j.rank][1]}" title="Rank ${j.rank}: ${CUSTO_TURNO[j.rank][0]} a ${CUSTO_TURNO[j.rank][1]} de chakra por turno"` : 'min="0"'} class="mini" aria-label="Quantidade de ${j.custoTipo === 'vida' ? 'vida' : 'chakra'}"`) : ''}
            <select data-k="${k('custoTipo')}" data-r aria-label="Tipo de custo" style="width:auto">${[['chakra', 'Chakra'], ['vida', 'Vida'], ['-', '-']].map(([v, t]) => opt(v, t, j.custoTipo)).join('')}</select>
            ${j.porTurno && j.custoTipo !== '-' ? '<span class="sub">/turno</span>' : ''}
          </div></div>
          <div class="campo"><span>Custo de Ações</span><div class="linha" style="gap:6px;flex-wrap:nowrap">${numInp(k('paQtd'), num(j.paQtd), 'min="0" class="mini" aria-label="Custo de ações em PA"')}<span class="sub">PA</span></div></div>
          ${campo('Range', selecao(k('range'), ALCANCES, j.range))}
          ${campo('Área', selecao(k('area'), AREAS, j.area))}
          ${danoCampo(k, j)}
          ${campo('Aprendizado', selecao(k('apr'), APRENDIZADOS, j.apr))}
          ${caixaReqs(j, i)}
          <div class="campo-largo marcas">${MARCAS.map(([m, t]) => `<label class="marca"><input type="checkbox" data-k="${k(m)}" data-r ${j[m] ? 'checked' : ''}> ${t}</label>`).join('')}</div>
          ${j.rank === 'S' ? '' : `<div class="campo-linha"><label class="linha" style="gap:10px"><span>Rank de aprimoramento</span>${numInp(k('aprim'), j.aprim || 0, 'min="0" max="6" class="mini" data-r')}</label>${num(j.aprim) >= 6 && j.rank ? `<button class="btn peq primario" data-acao="upar" data-i="${i}">Upar</button>` : ''}</div>`}
        </div>
        ${campo('Efeito', area(k('efeito'), j.efeito, 'rows="4"'))}
        ${campo('Anotações', area(k('notas'), j.notas, 'rows="2" placeholder="Aprimoramentos feitos, combinações, etc."'))}
        <div class="linha"><button class="btn peq perigo" data-acao="remJutsu" data-i="${i}">Remover técnica</button></div>
      </div>
    </details>`;
  }

  function abaJutsus() {
    const q = ui.jq.toLowerCase();
    const lista = F.jutsus.map((j, i) => [j, i])
      .filter(([j]) => (!q || (j.n + ' ' + j.efeito + ' ' + j.grp + ' ' + j.cat + ' ' + (j.reqs || []).join(' ')).toLowerCase().includes(q)) && (!ui.jrank || rankLetra(j.rank) === ui.jrank) && passaFiltros(j, ui.jorig, ui.jel))
      .sort((a, b) => (RANK_ORD[rankLetra(a[0].rank)] ?? 9) - (RANK_ORD[rankLetra(b[0].rank)] ?? 9));
    const iniciais = CAT_J.filter((j) => gruposMeus().includes(j.grp) && /^I\b/.test(String(j.apr).trim()));
    const compra = NIVEIS_COMPRA.includes(F.nivel);
    return `<div class="grade">
      <section class="painel c12">
        <div class="painel-topo"><h2>Técnicas conhecidas</h2><span class="extra">${F.jutsus.length} técnica(s)</span></div>
        <div class="barra-ferr">
          <input type="search" id="jBusca" placeholder="Buscar nas suas técnicas" value="${esc(ui.jq)}" aria-label="Buscar nas suas técnicas">
          <select id="jRank" aria-label="Filtrar por rank" style="width:auto">${opt('', 'Todos os ranks', ui.jrank)}${RANKS_JUTSU.map((r) => opt(r, 'Rank ' + r, ui.jrank)).join('')}</select>
          ${filtrosHTML('jOrig', 'jEl', ui.jorig, ui.jel)}
          <button class="btn primario" data-acao="abrirCatalogo">Adicionar do livro de jutsus</button>
          <button class="btn" data-acao="novaTecnica">Técnica criada em treino</button>
          ${iniciais.length ? `<button class="btn" data-acao="iniciais">Técnicas iniciais (I) do clã/habilidade · ${iniciais.length}</button>` : ''}
        </div>
        ${compra ? `<p><span class="tag aviso">Nível ${F.nivel} permite compra de jutsus</span></p>` : ''}
        <div class="lista" id="listaJutsus">${lista.map(([j, i]) => cartaoJutsu(j, i)).join('') || '<div class="vazio">Nenhuma técnica. Adicione pelo livro de jutsus ou registre uma técnica criada.</div>'}</div>
      </section>
    </div>`;
  }

  function modalCatalogo() {
    const c = ui.cat;
    const cats = [...new Set(CAT_J.map((j) => j.cat))].filter(Boolean);
    abrirModal('Livro de jutsus', `
      <div class="barra-ferr">
        <input type="search" id="catQ" placeholder="Nome, efeito, requerimento…" value="${esc(c.q)}" aria-label="Buscar no livro de jutsus">
      </div>
      <div class="barra-ferr">
        <select id="catCat" aria-label="Categoria" style="flex:1 1 180px">${opt('', 'Todas as categorias', c.cat)}${cats.map((x) => opt(x, x.charAt(0) + x.slice(1).toLowerCase(), c.cat)).join('')}</select>
        <select id="catRank" aria-label="Rank" style="flex:0 1 140px">${opt('', 'Todos os ranks', c.rank)}${R.RANKS.map((r) => opt(r, 'Rank ' + r, c.rank)).join('')}</select>
        ${filtrosHTML('catOrig', 'catEl', c.orig, c.el)}
        <label class="linha sub"><input type="checkbox" id="catMeu" ${c.meu ? 'checked' : ''}> Só do meu clã e habilidades</label>
      </div>
      <div class="lista" id="catLista"></div>`);
    renderCatalogo();
  }

  function renderCatalogo() {
    const c = ui.cat, q = c.q.toLowerCase(), meus = gruposMeus();
    const achados = CAT_J.map((j, idx) => [j, idx]).filter(([j]) =>
      (!q || (j.n + ' ' + j.efeito + ' ' + j.req + ' ' + j.grp).toLowerCase().includes(q)) &&
      (!c.cat || j.cat === c.cat) && (!c.rank || rankLetra(j.rank) === c.rank) && (!c.meu || meus.includes(j.grp)) && passaFiltros(j, c.orig, c.el));
    const tem = new Set(F.jutsus.map((j) => j.n));
    const el = $('#catLista'); if (!el) return;
    el.innerHTML = `<p class="sub">${achados.length} técnica(s) encontradas.</p>` + achados.slice(0, c.lim).map(([j, idx]) => `
      <details class="item">
        <summary>
          <span class="item-linha"><span class="rank">${rankLetra(j.rank)}</span><span class="item-nome">${esc(j.n)}</span>
            ${tem.has(j.n) ? '<span class="tag">Na ficha</span>' : `<button class="btn peq primario" data-acao="addJutsu" data-idx="${idx}">Adicionar</button>`}</span>
          <span class="item-meta"><span>${esc(j.grp || j.cat)}</span><span>Custo <b>${esc(j.custo) || '—'}</b></span><span>PA <b>${esc(j.pa) || '—'}</b></span><span>Range <b>${esc(j.range) || '—'}</b></span><span>Aprendizado <b>${esc(j.apr) || '—'}</b></span></span>
        </summary>
        <div class="item-corpo">
          <p class="efeito">${esc(j.efeito)}</p>
          <div class="item-meta"><span>Dano <b>${esc(j.dano) || '—'}</b></span><span>Requerimentos <b>${esc(j.req) || '—'}</b></span></div>
        </div>
      </details>`).join('') + (achados.length > c.lim ? `<button class="btn" data-acao="catMais">Mostrar mais (${achados.length - c.lim})</button>` : '');
  }

  // ---------------------------------------------------------------- ABA: Inventário
  function abaInventario() {
    const acima = D.peso / 1000 > D.carga;
    const linhas = F.itens.map((it, i) => {
      const k = (f) => `itens.${i}.${f}`;
      return `<details class="item">
        <summary>
          <span class="item-linha"><span class="item-nome">${esc(it.n) || '<i>Sem nome</i>'}</span>
            <span class="linha" style="gap:4px"><button class="btn-ico" data-acao="qtd" data-i="${i}" data-s="-1" aria-label="Menos">−</button><span class="num" style="min-width:26px;text-align:center" data-v="itens.${i}.qtd">${it.qtd}</span><button class="btn-ico" data-acao="qtd" data-i="${i}" data-s="1" aria-label="Mais">+</button></span></span>
          <span class="item-meta">${it.danoTipo === 'd' ? `<span>Dano <b>${esc(fmtDano(it))}</b></span>` : ''}${it.range && it.range !== '-' ? `<span>Range <b>${esc(it.range)}</b></span>` : ''}<span>Peso <b>${num(it.peso)} g</b></span>${it.g ? `<span>${esc(it.g)}</span>` : ''}</span>
        </summary>
        <div class="item-corpo">
          <div class="campos">
            ${campo('Nome', inp(k('n'), it.n))}
            ${campo('Quantidade', numInp(k('qtd'), it.qtd, 'min="0"'))}
            ${campo('Peso unitário (g)', numInp(k('peso'), it.peso, 'min="0" step="5"'))}
            ${danoCampo(k, it)}
            ${campo('Range', selecao(k('range'), ALCANCES, it.range))}
            ${campo('Custo', inp(k('custo'), it.custo))}
          </div>
          ${campo('Efeito / observação', area(k('notas'), it.notas, 'rows="2"'))}
          <div class="linha"><button class="btn peq perigo" data-acao="remItem" data-i="${i}">Remover item</button></div>
        </div>
      </details>`;
    }).join('');
    return `<div class="grade">
      <section class="painel c8">
        <div class="painel-topo"><h2>Equipamento</h2><span class="extra">${F.itens.length} item(ns)</span></div>
        <div class="barra-ferr">
          <button class="btn primario" data-acao="abrirLoja">Adicionar da loja</button>
          <button class="btn" data-acao="novoItem">Item personalizado</button>
        </div>
        <div class="lista">${linhas || '<div class="vazio">Nenhum item.</div>'}</div>
      </section>
      <section class="painel c4">
        <h2>Carga e dinheiro</h2>
        <div class="stats">
          ${stat('Ryo', numInp('ryo', F.ryo, 'min="0" step="10"'))}
          ${stat('Peso carregado', `<span data-d="peso" data-fmt="g">${fmtKg(D.peso / 1000)}</span>`, `Limite <span data-d="carga" data-fmt="kg">${fmtKg(D.carga)}</span>`)}
        </div>
        ${acima ? '<div class="aviso">Peso acima do limite de carregamento.</div>' : ''}
        <p class="sub">O ninja carrega 2,5 kg + Constituição (mínimo 0). Roupas básicas não contam. Arma de uma mão: até metade do carregamento máximo (${fmtKg(D.carga / 2)}).</p>
        <p class="sub">Embainhar ou guardar arma: 1 PA. Pegar arma no chão: 2 PA. Ao coletar itens usados em combate, recupera metade (mín. 1).</p>
      </section>
    </div>`;
  }

  function modalLoja() {
    const gs = [...new Set(CAT_I.map((i) => i.g))];
    abrirModal('Loja: Armas & Mercadorias', `
      <div class="barra-ferr">
        <input type="search" id="lojaQ" placeholder="Buscar item" value="${esc(ui.loja.q)}" aria-label="Buscar item">
        <select id="lojaG" aria-label="Seção" style="flex:0 1 200px">${opt('', 'Todas as seções', ui.loja.g)}${gs.map((g) => opt(g, g, ui.loja.g)).join('')}</select>
      </div>
      <div class="lista" id="lojaLista"></div>`);
    renderLoja();
  }
  function renderLoja() {
    const q = ui.loja.q.toLowerCase();
    const el = $('#lojaLista'); if (!el) return;
    el.innerHTML = CAT_I.map((it, idx) => [it, idx]).filter(([it]) => (!ui.loja.g || it.g === ui.loja.g) && (!q || (it.n + ' ' + (it.obs || '')).toLowerCase().includes(q)))
      .map(([it, idx]) => `<details class="item"><summary>
        <span class="item-linha"><span class="item-nome">${esc(it.n)}</span><button class="btn peq primario" data-acao="addItem" data-idx="${idx}">Adicionar</button></span>
        <span class="item-meta"><span>${esc(it.g)}</span>${it.dano ? `<span>Dano <b>${esc(it.dano)}</b></span>` : ''}${it.range ? `<span>Range <b>${esc(it.range)}</b></span>` : ''}<span>Custo <b>${esc(it.custo) || '—'}</b></span><span>Peso <b>${it.peso == null ? '—' : it.peso + ' g'}</b></span></span>
      </summary>${it.obs ? `<div class="item-corpo"><p class="efeito">${esc(it.obs)}</p></div>` : ''}</details>`).join('');
  }

  // ---------------------------------------------------------------- ABA: Evolução
  function abaEvolucao() {

    const slots = F.pericias.map((p, i) => {
      const slot = D.periciaSlots[i];
      const sel = campo(`Perícia ${i + 1} · nível ${NIVEIS_PERICIA[i]}${F.nivel < NIVEIS_PERICIA[i] ? ' (bloqueada)' : ''}`,
        `<select data-k="pericias.${i}" data-r${F.nivel < NIVEIS_PERICIA[i] ? ' disabled' : ''}>${opt('', '—', p)}${R.PERICIAS.filter((x) => !x.soJiongu || F.inatas.includes('jiongu')).map((x) => opt(x.id, x.nome, p)).join('')}</select>`);
      const escs = slot ? slot.escolhas.map((e) => `<select data-k="periciasEsc.${i}.${e.key}" data-r aria-label="Escolha da perícia ${i + 1}">${e.ops.map((o) => opt(o[0], o[1], e.sel)).join('')}</select>`).join('') : '';
      return `<div class="pilha" style="gap:6px">${sel}${escs}</div>`;
    }).join('');
    const resumo = Object.entries(D.periciaCont).map(([id, c]) => {
      const p = R.PERICIAS.find((x) => x.id === id); if (!p) return '';
      return `<div class="item"><div class="item-corpo">
        <div class="item-linha"><span class="item-nome">${p.nome}</span><span class="tag">${c}×</span></div>
        <p class="sub"><b>Garante (cada vez):</b> ${esc(p.garante)}</p>
        <ol class="sub" style="margin:0;padding-left:20px">${p.niveis.slice(0, c).map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
      </div></div>`;
    }).join('');
    // Pontos só existem a partir da 2ª vez de uma perícia; servem para talentos dela
    // ou para talentos iniciais de até 4 pontos.
    const restante = D.pontosPericia - D.pontosPericiaGastos;
    const grupos = [];
    Object.entries(D.periciaCont).filter(([id, c]) => c >= 2 && id !== 'jiongu').forEach(([id]) => {
      const p = R.PERICIAS.find((x) => x.id === id);
      const ops = p.talentos.filter(([n, c]) => !temTalento(n) && custoMin(c) <= restante).map(([n, c]) => opt(`p|${n}`, `${n} (${c})`));
      if (ops.length) grupos.push(`<optgroup label="${esc(p.nome)}">${ops.join('')}</optgroup>`);
    });
    if (D.pontosPericia) {
      const ops = R.TALENTOS.filter((t) => custoMin(t.pc) <= 4 && custoMin(t.pc) <= restante && !temTalento(t.nome)).map((t) => opt(`i|${t.nome}`, `${t.nome} (${t.pc})`));
      if (ops.length) grupos.push(`<optgroup label="Talentos iniciais (até 4 pontos)">${ops.join('')}</optgroup>`);
    }
    const addTalPer = grupos.length
      ? `<select id="addTalPer" aria-label="Adicionar talento de perícia"><option value="">+ Adicionar talento de perícia…</option>${grupos.join('')}</select>`
      : `<select disabled aria-label="Adicionar talento de perícia"><option>${D.pontosPericia ? 'Sem pontos de perícia disponíveis' : 'Liberado na 2ª vez de uma perícia'}</option></select>`;
    const pericias = `
    <section class="painel c6">
      <div class="painel-topo"><h2>Perícias</h2></div>
      <div class="campos">${slots}</div>
      <div class="lista">${resumo || '<div class="vazio">Nenhuma perícia escolhida.</div>'}</div>
      <div class="painel-topo"><span class="rotulo">Talentos de perícia</span><span class="extra">Pontos: <b class="num">${D.pontosPericiaGastos}</b> de ${D.pontosPericia}</span></div>
      <div class="lista">${F.talentosPericia.map((t, i) => {
        let desc = ''; R.PERICIAS.forEach((p) => p.talentos.forEach(([n, , d]) => { if (n === t.nome) desc = d; }));
        if (t.origem === 'inicial') desc = (R.TALENTOS.find((x) => x.nome === t.nome) || {}).desc || desc;
        return `<div class="item"><div class="item-corpo"><div class="item-linha"><span class="item-nome">${esc(t.nome)}</span>${t.origem === 'inicial' ? '<span class="tag">Talento inicial</span>' : ''}<label class="linha sub">pts ${numInp(`talentosPericia.${i}.pts`, t.pts, 'class="micro" min="0" data-r')}</label><button class="btn-ico" data-acao="remTalPer" data-i="${i}" aria-label="Remover">×</button></div><p class="sub">${esc(desc)}</p></div></div>`;
      }).join('')}</div>
      ${restante < 0 ? '<div class="aviso">Os talentos passaram dos pontos de perícia disponíveis.</div>' : ''}
      ${addTalPer}
    </section>`;

    const upgrades = `
    <section class="painel c6">
      <div class="painel-topo"><h2>Upgrades de clã</h2><span class="extra">Níveis 5, 10, 15 e 20</span></div>
      ${NIVEIS_UPGRADE.map((n) => campo(`Nível ${n}${F.nivel < n ? ' · ainda não alcançado' : ''}`, area(`upgrades.${n}`, F.upgrades[n], 'rows="2" placeholder="Aprimoramento, novo jutsu, técnica criada, despertar…"'))).join('')}
    </section>`;

    const tc = F.treinoCalc;
    const rankT = tc.rank || D.rank;
    const intK = String(clamp(D.attr.int, -2, 5));
    const pontos = R.PONTOS_TREINO[intK][tc.dur][R.RANKS.indexOf(rankT)];
    const treinos = `
    <section class="painel c5">
      <div class="painel-topo"><h2>Treinos</h2><span class="extra">Int ${sinal(D.attr.int)}</span></div>
      <div class="campos">
        ${campo('Duração', `<select data-k="treinoCalc.dur" data-r>${opt('curto', 'Curto (semanas)', tc.dur)}${opt('medio', 'Médio (meses)', tc.dur)}${opt('longo', 'Longo (anos)', tc.dur)}</select>`)}
        ${campo('Rank', `<select data-k="treinoCalc.rank" data-r>${opt('', `Atual (${D.rank})`, tc.rank)}${R.RANKS.map((r) => opt(r, r, tc.rank)).join('')}</select>`)}
        ${stat('Pontos de treino', pontos)}
      </div>
      <span class="rotulo">Registro</span>
      <div class="lista">${F.treinos.map((t, i) => `<div class="linha">${inp(`treinos.${i}.desc`, t.desc, 'placeholder="O que foi feito" style="flex:1 1 200px"')}${numInp(`treinos.${i}.pts`, t.pts, 'class="mini" aria-label="Pontos"')}<button class="btn-ico" data-acao="remTreino" data-i="${i}" aria-label="Remover">×</button></div>`).join('')}</div>
      <div class="linha"><button class="btn peq" data-acao="addTreino" data-pts="${pontos}">Registrar treino (${pontos} pts)</button></div>
      <details class="item"><summary><span class="item-linha"><span class="item-nome">Tabela de treino</span><span class="sub">custos</span></span></summary>
        <div class="item-corpo tabela-wrap"><table><thead><tr><th>Atividade</th><th class="c">Pontos</th><th>Benefício</th></tr></thead><tbody>
        ${R.TABELA_TREINO.map(([a, p, b]) => `<tr><td>${esc(a)}</td><td class="c num">${p}</td><td class="sub">${esc(b)}</td></tr>`).join('')}
        </tbody></table><p class="sub">Sensei: 20 pontos na primeira vez, 10 nas seguintes. Com sensei é possível aprender técnicas até 1 rank acima.</p></div>
      </details>
    </section>`;

    const escal = `
    <section class="painel c7">
      <div class="painel-topo"><h2>Escalonamento de nível</h2><span class="extra">Nível atual destacado</span></div>
      <div class="tabela-wrap"><table class="nivel-tab"><tbody>
        ${Object.entries(R.ESCALONAMENTO).map(([lv, t]) => `<tr class="${Number(lv) === F.nivel ? 'atual' : Number(lv) < F.nivel ? 'passado' : ''}"><td>${lv}</td><td>${esc(t) || '—'}</td></tr>`).join('')}
      </tbody></table></div>
    </section>`;

    return `<div class="grade">${pericias}${upgrades}${treinos}${escal}</div>`;
  }

  // ---------------------------------------------------------------- ABA: Aliados
  function abaAliados() {
    const comps = F.companheiros.map((c, i) => {
      const k = (f) => `companheiros.${i}.${f}`;
      return `<details class="item" open>
        <summary><span class="item-linha"><span class="item-nome">${esc(c.n) || '<i>Sem nome</i>'}</span><span class="sub">${esc(c.g || '')}</span></span>
          <span class="item-meta"><span>Vida <b>${num(c.pv)}/${num(c.pvMax)}</b></span><span>DN <b>${esc(c.dn)}</b></span><span>Ataque <b>${esc(c.atk)}</b></span><span>Dano <b>${esc(c.dano) || '—'}</b></span><span>Desl. <b>${esc(c.desl) || '—'}</b></span></span></summary>
        <div class="item-corpo">
          <div class="campos">
            ${campo('Nome', inp(k('n'), c.n))}${campo('Tipo', inp(k('g'), c.g))}
            ${campo('Vida atual', numInp(k('pv'), c.pv))}${campo('Vida máxima', numInp(k('pvMax'), c.pvMax))}
            ${campo('DN', inp(k('dn'), c.dn))}${campo('Mod. de ataque', inp(k('atk'), c.atk))}
            ${campo('Dano do ataque', inp(k('dano'), c.dano))}${campo('Deslocamento', inp(k('desl'), c.desl))}
          </div>
          ${campo('Habilidade especial', area(k('hab'), c.hab, 'rows="2"'))}
          <div class="linha"><button class="btn peq perigo" data-acao="remComp" data-i="${i}">Remover</button></div>
        </div></details>`;
    }).join('');

    const marios = F.marionetes.map((m, i) => {
      const k = (f) => `marionetes.${i}.${f}`;
      const usados = (m.componentes || []).reduce((s, c) => s + num(c.slots), 0);
      return `<details class="item" open>
        <summary><span class="item-linha"><span class="item-nome">${esc(m.n) || '<i>Marionete</i>'}</span><span class="tag${usados > num(m.comp) ? ' aviso' : ''}">${usados}/${num(m.comp)} compartimentos</span></span>
          <span class="item-meta"><span>Vida <b>${num(m.pv)}/${num(m.pvMax)}</b></span><span>Ataque <b>${sinal(num(m.atk) + D.attr.nin)}</b> (${sinal(num(m.atk))} + Nin)</span><span>DN <b>${D.dn.nin}</b></span><span>Desl. <b>${num(m.desl)} m/PA</b></span></span></summary>
        <div class="item-corpo">
          <div class="campos">
            ${campo('Nome', inp(k('n'), m.n))}
            ${campo('Vida atual', numInp(k('pv'), m.pv))}${campo('Vida máxima', numInp(k('pvMax'), m.pvMax))}
            ${campo('Mod. de ataque', numInp(k('atk'), m.atk, 'data-r'))}${campo('Deslocamento', numInp(k('desl'), m.desl))}
            ${campo('Compartimentos', numInp(k('comp'), m.comp, 'data-r'))}
          </div>
          <span class="rotulo">Componentes</span>
          <div class="chips">${(m.componentes || []).map((c, ci) => `<span class="chip fixo" title="${esc(c.desc)}">${esc(c.n)} <span class="tag">${c.slots}</span>${c.dano && c.dano !== '-' ? ` <span class="sub">${esc(c.dano)}</span>` : ''}<button class="x" data-acao="remCompon" data-i="${i}" data-ci="${ci}" aria-label="Remover componente">×</button></span>`).join('') || '<span class="sub">Nenhum.</span>'}</div>
          <select class="addCompon" data-i="${i}" aria-label="Adicionar componente"><option value="">+ Adicionar componente…</option>${CAT_COMP.map((c, ci) => opt(ci, `${c[0]} · ${c[1]} comp. · ${c[3] || 's/ custo'}`)).join('')}</select>
          <div class="linha"><button class="btn peq perigo" data-acao="remMario" data-i="${i}">Remover marionete</button></div>
        </div></details>`;
    }).join('');

    return `<div class="grade">
      <section class="painel c7">
        <div class="painel-topo"><h2>Invocações e companheiros</h2><span class="extra">${F.companheiros.length}</span></div>
        <div class="barra-ferr"><button class="btn primario" data-acao="abrirCriaturas">Adicionar criatura</button><button class="btn" data-acao="novoComp">Em branco</button></div>
        <div class="lista">${comps || '<div class="vazio">Nenhuma invocação ou companheiro.</div>'}</div>
        <details class="item"><summary><span class="item-linha"><span class="item-nome">Invocação reversa (d20)</span></span></summary>
          <div class="item-corpo tabela-wrap"><table><tbody>${(window.INVOCACAO_REVERSA || []).map(([d, n]) => `<tr><td class="num">${d}</td><td>${esc(n)}</td></tr>`).join('')}</tbody></table></div></details>
      </section>
      <section class="painel c5">
        <div class="painel-topo"><h2>Marionetes</h2><span class="extra">Controla até ${D.marionetesMax}</span></div>
        <div class="barra-ferr">
          <select id="addMario" aria-label="Adicionar marionete"><option value="">+ Adicionar marionete…</option>${CAT_M.map((m, i) => opt(i, `${m.n} · ${m.custo}`)).join('')}${opt('novo', 'Marionete criada em treino (em branco)')}</select>
        </div>
        <div class="lista">${marios || '<div class="vazio">Nenhuma marionete. Exige “Kugutsu no Jutsu”.</div>'}</div>
      </section>
    </div>`;
  }

  function modalCriaturas() {
    const gs = [...new Set(CAT_C.map((c) => c.g))];
    abrirModal('Criaturas & Invocações', `
      <div class="barra-ferr"><select id="criatG" aria-label="Grupo">${opt('', 'Todos os grupos', ui.criat.g)}${gs.map((g) => opt(g, g, ui.criat.g)).join('')}</select></div>
      <div class="lista" id="criatLista"></div>`);
    renderCriaturas();
  }
  function renderCriaturas() {
    const el = $('#criatLista'); if (!el) return;
    el.innerHTML = CAT_C.map((c, idx) => [c, idx]).filter(([c]) => !ui.criat.g || c.g === ui.criat.g).map(([c, idx]) => `
      <div class="item"><div class="item-corpo">
        <div class="item-linha"><span class="item-nome">${esc(c.n)}</span><span class="sub">${esc(c.g)}</span><button class="btn peq primario" data-acao="addCriatura" data-idx="${idx}">Adicionar</button></div>
        <div class="item-meta"><span>Vida <b>${c.pvNivel ? c.pvNivel + '/nível' : c.pv}</b></span><span>DN <b>${c.dn}</b></span><span>Ataque <b>${esc(c.atk)}</b></span><span>Dano <b>${esc(c.dano) || '—'}</b></span><span>Desl. <b>${esc(c.desl) || '—'}</b></span></div>
        <p class="sub">${esc(c.hab)}</p>
      </div></div>`).join('');
  }

  // ---------------------------------------------------------------- ABA: Especial
  function abaEspecial() {
    const bj = D.bijuu;
    const jin = `
    <details class="modulo" ${bj ? 'open' : ''}>
      <summary><h2>Jinchuuriki</h2><span class="sub">${bj ? esc(bj.nome) : 'Sem bijuu'}</span></summary>
      <div class="modulo-corpo">
        <div class="campos">
          ${campo('Bijuu selada', `<select data-k="bijuu.nome" data-r>${opt('', 'Nenhuma', F.bijuu.nome)}${R.BIJUUS.map((b) => opt(b.nome, `${b.nome} (${b.caudas} cauda${b.caudas > 1 ? 's' : ''})`, F.bijuu.nome)).join('')}</select>`)}
          ${campo('Pontos de relação', numInp('bijuu.papinho', F.bijuu.papinho, 'min="0"'))}
          <label class="campo"><span>Laço de amizade</span><span class="linha"><input type="checkbox" data-k="bijuu.aliado" data-r ${F.bijuu.aliado ? 'checked' : ''}> Aliado da bijuu</span></label>
        </div>
        ${bj ? `<div class="stats">
          ${stat('Custo do selo', F.bijuu.aliado ? '0' : `−${D.bijuuRed}`, `${D.bijuuPorNivel} de chakra por nível (mín. 2 de chakra)`)}
          ${stat('Vida', bj.pv)}${stat('Chakra', bj.chakra)}${stat('DN', bj.dn)}${stat('Ataque', bj.atk)}${stat('Relação (ref.)', bj.papinho)}
        </div>` : ''}
        <p class="sub">Uma vez aliado da bijuu, o custo de chakra se torna nulo. A cada nível a relação soma 2 + Carisma (mínimo 2). Manto versão 1: +3 em todos atributos menos Carisma, 20 de sobrechakra e 5 de sobrevida por cauda, +1d6 de dano por cauda, 2 de dano por turno por cauda.</p>
      </div>
    </details>`;

    const sh = F.sharingan;
    const sharingan = `
    <details class="modulo" ${F.cla === 'uchiha' ? 'open' : ''}>
      <summary><h2>Sharingan</h2><span class="sub">${['Não despertado', '1 tomoe', '2 tomoe', '3 tomoe', 'Mangekyou'][sh.nivel] || ''}</span></summary>
      <div class="modulo-corpo">
        <div class="campos">
          ${campo('Estágio', `<select data-k="sharingan.nivel" data-r>${['Não despertado', '1 tomoe', '2 tomoe', '3 tomoe', 'Mangekyou Sharingan'].map((t, i) => opt(i, t, sh.nivel)).join('')}</select>`)}
        </div>
        <ul class="sub" style="margin:0;padding-left:18px">
          ${sh.nivel >= 1 ? '<li>1 tomoe: +2 Nin e +2 Gen; vê o fluxo de chakra, anula cegueira de fumaça, percebe Genjutsus, lê lábios.</li>' : ''}
          ${sh.nivel >= 2 ? '<li>2 tomoe: +2 em todas as DN; decide a defesa após ver a rolagem; soma Genjutsu na DN de Int contra Genjutsus; ignora contra-ataques.</li>' : ''}
          ${sh.nivel >= 3 ? '<li>3 tomoe: copia jutsus; usa “Genjutsu: Interrogatório” e “Genjutsu: Atordoamento” com vantagem.</li>' : ''}
          ${sh.nivel >= 4 ? '<li>Mangekyou: +2 Nin e +2 Gen adicionais (+4 ao todo); custo 2× o Sharingan por turno.</li>' : ''}
          <li>Custo: 10 de chakra por turno. Sem despertar, os tomoe chegam nos níveis 5, 10 e 15; o Mangekyou no nível 20.</li>
        </ul>
        <p class="sub">Some o bônus de DN do estágio em “Bônus em todas as DN” enquanto estiver ativo.</p>
        <div class="pilha">
          <div class="painel-topo"><span class="rotulo">Medidor de cegueira (Mangekyou)</span><span class="num"><b data-v="sharingan.cegueira">${sh.cegueira}</b> / 100</span></div>
          <div class="medidor"><div style="width:${clamp(sh.cegueira, 0, 100)}%"></div></div>
          <div class="linha">${[10, 15, 20, 30].map((v) => `<button class="btn peq" data-acao="cegueira" data-v2="${v}">+${v}</button>`).join('')}<button class="btn peq" data-acao="cegueira" data-v2="-20">−20 (descanso longo)</button></div>
          <p class="sub">Custos de cegueira: Mangekyou 10 · Susanoo Esqueleto 15 · Escamado 20 · Completo 30. Aos 100 pontos o usuário fica cego permanentemente. O descanso longo desta ficha já subtrai 20.</p>
        </div>
      </div>
    </details>`;

    const abertos = F.portoes.filter((p) => p.ativo);
    const custoTurno = F.portoes.reduce((s, p, i) => {
      if (!p.ativo) return s;
      const m = R.PORTOES[i][1].match(/^(\d+)\s*\((\d+)\)/);
      return s + (m ? Number(p.treinado ? m[2] : m[1]) : 0);
    }, 0);
    const portoes = `
    <details class="modulo" ${F.portoes.some((p) => p.aprendido) || D.periciaCont.taijutsu ? 'open' : ''}>
      <summary><h2>8 Portões</h2><span class="sub">${abertos.length ? `${abertos.length} aberto(s) · ${custoTurno} PV/turno` : `${F.portoes.filter((p) => p.aprendido).length} aprendido(s)`}</span></summary>
      <div class="modulo-corpo">
        <div class="tabela-wrap"><table>
          <thead><tr><th>Portão</th><th class="c">Aprendido</th><th class="c">Custo treinado</th><th class="c">Treinos p/ penalidade</th><th class="c">Aberto</th></tr></thead>
          <tbody>${R.PORTOES.map((p, i) => `<tr>
            <td><div class="attr-nome">${esc(p[0])}</div><div class="attr-desc">${esc(p[1])} · ${esc(p[2])}<br><b>Penalidade:</b> ${esc(p[3])} <b>Descanso:</b> ${esc(p[4])}</div></td>
            <td class="c"><input type="checkbox" data-k="portoes.${i}.aprendido" data-r ${F.portoes[i].aprendido ? 'checked' : ''} aria-label="Aprendido"></td>
            <td class="c">${i < 7 ? `<input type="checkbox" data-k="portoes.${i}.treinado" data-r ${F.portoes[i].treinado ? 'checked' : ''} aria-label="Custo reduzido por treino">` : '—'}</td>
            <td class="c">${i < 7 ? `<select data-k="portoes.${i}.penal" data-r style="width:auto">${[0, 1, 2].map((v) => opt(v, v === 2 ? '2 (retirada)' : String(v), F.portoes[i].penal)).join('')}</select>` : '—'}</td>
            <td class="c"><input type="checkbox" data-k="portoes.${i}.ativo" data-r ${F.portoes[i].ativo ? 'checked' : ''} aria-label="Aberto"></td>
          </tr>`).join('')}</tbody></table></div>
        <p class="sub">Tudo é cumulativo. Abrir cada portão custa 1 PA e exige o anterior aberto. Requer a 1ª perícia de Taijutsu. Um portão nunca custa menos de 1 de vida por turno; a penalidade do 8º não pode ser retirada.</p>
      </div>
    </details>`;

    const jashin = `
    <details class="modulo" ${F.inatas.includes('jashin') ? 'open' : ''}>
      <summary><h2>Jashin</h2><span class="sub">${F.jashin ? `${F.jashin} desvantagem(ns)` : 'Em dia com o culto'}</span></summary>
      <div class="modulo-corpo">
        <ol class="sub" style="margin:0;padding-left:20px">${R.JASHIN_PENALIDADES.map((t, i) => `<li style="${i < F.jashin ? 'color:var(--seal);font-weight:700' : ''}">${esc(t)}</li>`).join('')}</ol>
        <div class="linha"><button class="btn peq" data-acao="jashin" data-v2="1">Descanso longo sem sacrifício (+1)</button><button class="btn peq" data-acao="jashin" data-v2="0">Sacrifício realizado (reiniciar)</button></div>
        <p class="sub">Sempre que a vida chegar a zero, o ninja a recupera completamente e recebe mais uma desvantagem. O chakra nunca fica abaixo de 1.</p>
      </div>
    </details>`;

    const jiongu = `
    <details class="modulo" ${F.inatas.includes('jiongu') ? 'open' : ''}>
      <summary><h2>Jiongu · máscaras</h2><span class="sub">${F.mascaras.length} máscara(s)</span></summary>
      <div class="modulo-corpo">
        <div class="lista">${F.mascaras.map((m, i) => `<div class="item"><div class="item-corpo"><div class="campos">
          ${campo('Elemento', `<select data-k="mascaras.${i}.el">${R.ELEMENTOS.map((e) => opt(e.id, e.nome, m.el)).join('')}</select>`)}
          ${campo(`Vida (máx. ${4 * F.nivel})`, numInp(`mascaras.${i}.pv`, m.pv))}
          ${campo(`Chakra (máx. ${4 * F.nivel})`, numInp(`mascaras.${i}.ck`, m.ck))}
          ${campo('Notas', inp(`mascaras.${i}.notas`, m.notas))}
        </div><div class="linha"><button class="btn peq perigo" data-acao="remMascara" data-i="${i}">Quebrar/remover</button></div></div></div>`).join('')}</div>
        <div class="linha"><button class="btn peq" data-acao="addMascara">Adicionar máscara</button></div>
        <p class="sub">Máscara: 4 de vida e 4 de chakra por nível do ninja, modificador de ataque 0, DN 10, deslocamento 8 m, soco nível 1 (1d4). Não há máscaras de mesmo elemento. Recuperam 5 de chakra por turno acopladas.</p>
      </div>
    </details>`;

    return `<div class="pilha" style="gap:12px">${jin}${sharingan}${portoes}${jashin}${jiongu}
      <p class="sub">Módulos de mecânicas especiais dos documentos de Clãs, Kinjutsus e GodModes. Os relevantes ao personagem abrem sozinhos.</p></div>`;
  }

  // ---------------------------------------------------------------- ABA: História
  function abaHistoria() {
    return `<div class="grade">
      <section class="painel c5">
        <h2>Interpretação</h2>
        ${campo('Alinhamento', `<select data-k="alinhamento">${opt('', '—', F.alinhamento)}${R.ALINHAMENTOS.map(([s, n]) => opt(s, `${n} (${s})`, F.alinhamento)).join('')}</select>`)}
        ${campo('Ideal', area('ideal', F.ideal, 'rows="2"'))}
        ${campo('Fraqueza', area('fraqueza', F.fraqueza, 'rows="2"'))}
        ${campo('Vínculo', area('vinculo', F.vinculo, 'rows="2"'))}
      </section>
      <section class="painel c7">
        <h2>História</h2>
        ${area('historia', F.historia, 'rows="12" aria-label="História" placeholder="Origem, família, vila, objetivos…"')}
        ${campo('Anotações da sessão', area('notas', F.notas, 'rows="6"'))}
      </section>
    </div>`;
  }

  // ---------------------------------------------------------------- render
  const ABAS = { ficha: abaFicha, jutsus: abaJutsus, inventario: abaInventario, evolucao: abaEvolucao, aliados: abaAliados, especial: abaEspecial, historia: abaHistoria };
  function render() {
    D = calc();
    garantirAtuais();
    const y = window.scrollY;
    const antes = $$('#conteudo details').map((d) => d.open);
    const abertosId = new Set($$('#conteudo details[data-id][open]').map((d) => d.dataset.id));
    $('#conteudo').innerHTML = (ABAS[aba] || abaFicha)();
    const todos = $$('#conteudo details');
    if (todos.length === antes.length) todos.forEach((d, i) => { d.open = antes[i]; });
    else antes.forEach((o, i) => { if (o && todos[i] && todos[i].classList.contains('item')) todos[i].open = true; });
    // cartões com id (jutsus) lembram o estado pelo próprio id, mesmo se a lista for reordenada
    todos.forEach((d) => { if (d.dataset.id) d.open = abertosId.has(d.dataset.id); });
    atualizarDerivados();
    window.scrollTo(0, y);
  }

  function trocarAba(a) {
    aba = a; db.aba = a; salvar();
    try { history.replaceState(null, '', '#' + a); } catch (e) { /* sem histórico */ }
    $('#conteudo').innerHTML = '';
    render();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- modal / toast
  function abrirModal(titulo, html) {
    $('#modalTitulo').textContent = titulo;
    $('#modalCorpo').innerHTML = html;
    $('#modal').hidden = false;
    const f = $('#modalCorpo input, #modalCorpo select, #modalCorpo button');
    if (f && window.matchMedia('(min-width: 700px)').matches) f.focus();
  }
  function fecharModal() { $('#modal').hidden = true; $('#modalCorpo').innerHTML = ''; }

  let tToast;
  function toast(html, ms = 3200) {
    const t = $('#toast');
    t.innerHTML = html; t.hidden = false;
    clearTimeout(tToast); tToast = setTimeout(() => { t.hidden = true; }, ms);
  }
  // ---------------------------------------------------------------- fichas
  function modalFichas() {
    const ids = Object.keys(db.fichas);
    abrirModal('Fichas', `
      <div class="fichas-lista">${ids.map((id) => { const f = db.fichas[id]; const c = R.CLAS.find((x) => x.id === f.cla); return `
        <button class="ficha-op" data-acao="trocarFicha" data-id="${id}" ${id === db.atual ? 'aria-current="true"' : ''}>
          <span><b>${esc(f.nome || 'Sem nome')}</b><br><span class="sub">Nível ${f.nivel} · ${esc(c ? c.nome : '')}</span></span><span class="rank">${rankDoNivel(f.nivel)}</span>
        </button>`; }).join('')}</div>
      <div class="linha">
        <button class="btn primario" data-acao="novaFicha">Nova ficha</button>
        <button class="btn" data-acao="duplicarFicha">Duplicar atual</button>
      </div>
      <div class="pilha">
        <span class="rotulo">Compartilhar e backup</span>
        <div class="linha">
          <button class="btn" data-acao="exportar">Baixar .json</button>
          <button class="btn" data-acao="copiarJson">Copiar JSON</button>
          <label class="btn" for="arqImport">Importar arquivo</label>
          <input type="file" id="arqImport" accept="application/json,.json" hidden>
        </div>
        <textarea id="jsonImport" rows="3" placeholder="…ou cole aqui o JSON de uma ficha e clique em Importar texto"></textarea>
        <div class="linha"><button class="btn peq" data-acao="importarTexto">Importar texto</button></div>
      </div>
      <div class="pilha">
        <span class="rotulo">Zona de perigo</span>
        <div class="linha" id="zonaExcluir"><button class="btn perigo" data-acao="excluirPedir">Excluir ficha atual</button></div>
      </div>
      <p class="sub">As fichas ficam salvas só neste navegador. Baixe o .json para guardar ou mandar para o mestre.</p>`);
  }

  function usarFicha(f) {
    f = normalizar(f);
    if (db.fichas[f.id] && f.id !== db.atual) f.id = uid();
    db.fichas[f.id] = f; db.atual = f.id; F = f;
    salvar(); fecharModal(); render();
  }
  function importarJSON(txt) {
    try {
      const o = JSON.parse(txt);
      const f = o.fichas ? Object.values(o.fichas)[0] : o;
      if (!f || typeof f !== 'object' || !f.attrs) throw new Error('formato');
      f.id = uid();
      usarFicha(f);
      toast('Ficha importada.');
    } catch (e) {
      toast('Não foi possível ler esse JSON. Confira se é uma ficha exportada por este site.', 4500);
    }
  }

  // ---------------------------------------------------------------- ações
  const ACOES = {
    elemento(el) { const id = el.dataset.id; const i = F.elementos.indexOf(id); if (i >= 0) F.elementos.splice(i, 1); else F.elementos.push(id); return true; },
    remInata(el) { F.inatas = F.inatas.filter((x) => x !== el.dataset.id); return true; },
    remTalento(el) { F.talentos.splice(+el.dataset.i, 1); return true; },
    remTalPer(el) { F.talentosPericia.splice(+el.dataset.i, 1); return true; },
    morte(el) { const t = el.dataset.t, i = +el.dataset.i; F.morte[t] = F.morte[t] >= i ? i - 1 : i; return true; },
    condicao(el) { const id = el.dataset.id; F.condicoes[id] = !F.condicoes[id]; return true; },
    prot(el) { F.protagonismo = clamp(num(F.protagonismo) + Number(el.dataset.d2), 0, D.protMax); },
    ajustar(el) {
      const tipo = el.dataset.alvo, s = Number(el.dataset.s);
      const campoQ = $('#aj-' + tipo); let q = Math.abs(num(campoQ && campoQ.value));
      if (!q) { toast('Digite a quantidade antes.'); return; }
      const sobreK = tipo === 'vida' ? 'sobrevida' : 'sobrechakra';
      const atualK = tipo === 'vida' ? 'pvAtual' : 'chakraAtual';
      const max = tipo === 'vida' ? D.vidaMax : D.chakraMax;
      if (s < 0) {
        const s0 = num(F[sobreK]); const usa = Math.min(s0, q); F[sobreK] = s0 - usa; q -= usa;
        F[atualK] = num(F[atualK]) - q;
      } else {
        F[atualK] = Math.min(max, num(F[atualK]) + q);
      }
      campoQ.value = '';
      return true;
    },
    regen() { F.chakraAtual = Math.min(D.chakraMax, num(F.chakraAtual) + D.regen); toast(`Recuperou ${D.regen} de chakra.`); return true; },
    descansoCurto() {
      const mult = (D.periciaCont.resistencia || 0) >= 3 ? 2 : 1;
      const v = D.dadosDescanso * D.vidaDado * mult, c = D.dadosDescanso * D.chakraDado * mult;
      F.pvAtual = Math.min(D.vidaMax, Math.max(0, num(F.pvAtual)) + v);
      F.chakraAtual = Math.min(D.chakraMax, Math.max(0, num(F.chakraAtual)) + c);
      F.protagonismo = Math.min(D.protMax, num(F.protagonismo) + 1);
      toast(`Descanso curto: +${v} vida, +${c} chakra, +1 protagonismo.`);
      return true;
    },
    descansoLongo() {
      F.pvAtual = D.vidaMax; F.chakraAtual = D.chakraMax; F.protagonismo = D.protMax;
      F.morte = { v: 0, d: 0 };
      F.sharingan.cegueira = Math.max(0, num(F.sharingan.cegueira) - 20);
      F.marionetes.forEach((m) => { m.pv = m.pvMax; });
      toast('Descanso longo: vida, chakra e protagonismo recuperados.');
      return true;
    },
    abrirCatalogo() { modalCatalogo(); },
    catMais() { ui.cat.lim += 40; renderCatalogo(); },
    addJutsu(el) {
      const j = CAT_J[+el.dataset.idx]; F.jutsus.push(jutsuDoCatalogo(j));
      salvar(); renderCatalogo(); toast(`${esc(j.n)} adicionada.`);
      if (aba === 'jutsus') render();
    },
    novaTecnica() {
      F.jutsus.push({ v: 2, id: uid(), n: 'Nova técnica', cat: '', grp: 'Criada em treino', rank: D.rank, tipo: '', custoTipo: 'chakra', custoQtd: 0, porTurno: false, defesa: false, defesaExtra: false, concentracao: false, estilo: false, efeito: '', danoTipo: '-', danoQtd: '', danoFaces: '', reqs: [], range: '-', area: '-', apr: '', paQtd: 2, aprim: 0, notas: '', origem: 'criada' });
      ui.jq = ''; ui.jrank = '';
      render();
      const d = $$('#listaJutsus details'); const alvo = d.find((x) => x.querySelector('.item-nome').textContent === 'Nova técnica');
      if (alvo) { alvo.open = true; alvo.scrollIntoView({ block: 'center' }); }
      return false;
    },
    iniciais() {
      const tem = new Set(F.jutsus.map((j) => j.n));
      const novos = CAT_J.filter((j) => gruposMeus().includes(j.grp) && /^I\b/.test(String(j.apr).trim()) && !tem.has(j.n));
      novos.forEach((j) => F.jutsus.push(jutsuDoCatalogo(j)));
      toast(novos.length ? `${novos.length} técnica(s) inicial(is) adicionada(s).` : 'As técnicas iniciais já estão na ficha.');
      return true;
    },
    upar(el) {
      const j = F.jutsus[+el.dataset.i];
      const idx = RANKS_JUTSU.indexOf(j.rank);
      if (idx < 0 || idx >= RANKS_JUTSU.length - 1) return;
      j.rank = RANKS_JUTSU[idx + 1]; j.aprim = 0;
      ajustarCustoTurno(j);
      toast(`${esc(j.n)} subiu para o rank ${j.rank}.`);
      return true;
    },
    remReq(el) { F.jutsus[+el.dataset.i].reqs.splice(+el.dataset.ri, 1); return true; },
    remJutsu(el) { F.jutsus.splice(+el.dataset.i, 1); return true; },
    abrirLoja() { modalLoja(); },
    addItem(el) {
      const it = CAT_I[+el.dataset.idx];
      const ex = F.itens.find((x) => x.n === it.n);
      if (ex) ex.qtd = num(ex.qtd) + 1; else F.itens.push(itemDoCatalogo(it));
      salvar(); toast(`${esc(it.n)} adicionado.`); if (aba === 'inventario') render();
    },
    novoItem() { F.itens.push({ v: 2, id: uid(), n: 'Novo item', g: '', qtd: 1, peso: 0, danoTipo: '-', danoQtd: '', danoFaces: '', range: '-', custo: '', notas: '' }); return true; },
    remItem(el) { F.itens.splice(+el.dataset.i, 1); return true; },
    qtd(el) { const it = F.itens[+el.dataset.i]; it.qtd = Math.max(0, num(it.qtd) + Number(el.dataset.s)); atualizarDerivados(); salvar(); },
    abrirCriaturas() { modalCriaturas(); },
    addCriatura(el) {
      const c = CAT_C[+el.dataset.idx];
      const pv = c.pvNivel ? c.pvNivel * F.nivel : c.pv;
      F.companheiros.push({ id: uid(), n: c.n, g: c.g, pv, pvMax: pv, dn: c.dn, atk: c.atk, dano: c.dano, desl: c.desl, hab: c.hab });
      salvar(); toast(`${esc(c.n)} adicionado.`); if (aba === 'aliados') render();
    },
    novoComp() { F.companheiros.push({ id: uid(), n: '', g: '', pv: 0, pvMax: 0, dn: '', atk: '', dano: '', desl: '', hab: '' }); return true; },
    remComp(el) { F.companheiros.splice(+el.dataset.i, 1); return true; },
    remMario(el) { F.marionetes.splice(+el.dataset.i, 1); return true; },
    remCompon(el) { F.marionetes[+el.dataset.i].componentes.splice(+el.dataset.ci, 1); return true; },
    cegueira(el) { F.sharingan.cegueira = clamp(num(F.sharingan.cegueira) + Number(el.dataset.v2), 0, 100); return true; },
    jashin(el) { F.jashin = el.dataset.v2 === '0' ? 0 : clamp(F.jashin + 1, 0, 5); return true; },
    addMascara() { F.mascaras.push({ el: 'katon', pv: 4 * F.nivel, ck: 4 * F.nivel, notas: '' }); return true; },
    remMascara(el) { F.mascaras.splice(+el.dataset.i, 1); return true; },
    addTreino(el) { F.treinos.push({ desc: '', pts: Number(el.dataset.pts) }); return true; },
    remTreino(el) { F.treinos.splice(+el.dataset.i, 1); return true; },
    trocarFicha(el) { db.atual = el.dataset.id; F = db.fichas[db.atual]; salvar(); fecharModal(); render(); },
    novaFicha() { usarFicha(fichaVazia()); toast('Nova ficha criada.'); },
    duplicarFicha() { const c = JSON.parse(JSON.stringify(F)); c.id = uid(); c.nome = (c.nome || 'Ficha') + ' (cópia)'; usarFicha(c); },
    exportar() {
      const blob = new Blob([JSON.stringify(F, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (F.nome || 'ficha').replace(/[^\w\-]+/g, '_') + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    copiarJson() {
      const txt = JSON.stringify(F);
      const fallback = () => { const t = $('#jsonImport'); if (t) { t.value = txt; t.select(); } toast('Selecionei o JSON no campo abaixo. Copie com Ctrl+C.'); };
      try { navigator.clipboard.writeText(txt).then(() => toast('JSON copiado.'), fallback); } catch (e) { fallback(); }
    },
    importarTexto() { const t = $('#jsonImport'); if (t && t.value.trim()) importarJSON(t.value); },
    excluirPedir() {
      $('#zonaExcluir').innerHTML = `<span class="sub">Excluir “${esc(F.nome || 'Sem nome')}” para sempre?</span><button class="btn perigo" data-acao="excluirConfirmar">Sim, excluir</button><button class="btn" data-acao="excluirCancelar">Cancelar</button>`;
    },
    excluirCancelar() { modalFichas(); },
    excluirConfirmar() {
      delete db.fichas[F.id];
      const ids = Object.keys(db.fichas);
      if (!ids.length) { const f = fichaVazia(); db.fichas[f.id] = f; db.atual = f.id; } else db.atual = ids[0];
      F = db.fichas[db.atual]; salvar(); fecharModal(); render(); toast('Ficha excluída.');
    },
  };

  // ---------------------------------------------------------------- eventos
  function aplicarCampo(el) {
    const k = el.dataset.k;
    let v;
    if (el.type === 'checkbox') v = el.checked;
    else if (el.type === 'number') v = el.value === '' ? 0 : Number(el.value);
    else v = el.value;
    if (k === 'nivel') v = clamp(num(v, 1), 1, 20);
    if (/^jutsus\.\d+\.aprim$/.test(k)) { v = clamp(num(v), 0, 6); el.value = v; }
    if (k === 'pa' && el.value !== '') { v = clamp(num(v, 3), 1, 5); el.value = v; }
    setPath(F, k, v);
    salvar();
    return el.hasAttribute('data-r');
  }

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'jBusca') { ui.jq = el.value; const pos = el.selectionStart; render(); const n = $('#jBusca'); n.focus(); n.setSelectionRange(pos, pos); return; }
    if (el.id === 'catQ') { ui.cat.q = el.value; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.id === 'lojaQ') { ui.loja.q = el.value; renderLoja(); return; }
    if (!el.dataset || !el.dataset.k) return;
    if (el.tagName === 'SELECT' || el.type === 'checkbox') return; // tratados em change
    if (el.classList.contains('so-digitos') && /\D/.test(el.value)) el.value = el.value.replace(/\D/g, '');
    const re = aplicarCampo(el);
    if (re && el.type !== 'number') render(); else atualizarDerivados();
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.id === 'addInata' && el.value) { F.inatas.push(el.value); salvar(); render(); return; }
    if (el.id === 'addTalento' && el.value) { const t = R.TALENTOS.find((x) => x.nome === el.value); F.talentos.push({ nome: t.nome, pc: parseInt(t.pc, 10) || 0 }); salvar(); render(); return; }
    if (el.id === 'addTalPer' && el.value) {
      const [tipo, nome] = [el.value.slice(0, 1), el.value.slice(2)];
      let custo = '0';
      if (tipo === 'i') custo = (R.TALENTOS.find((t) => t.nome === nome) || {}).pc;
      else R.PERICIAS.forEach((p) => p.talentos.forEach(([n, c]) => { if (n === nome) custo = c; }));
      F.talentosPericia.push({ nome, pts: custoMin(custo), origem: tipo === 'i' ? 'inicial' : 'pericia' });
      salvar(); render(); return;
    }
    if (el.id === 'jRank') { ui.jrank = el.value; render(); return; }
    if (el.id === 'jOrig') { ui.jorig = el.value; render(); return; }
    if (el.id === 'jEl') { ui.jel = el.value; render(); return; }
    if (el.id === 'catOrig') { ui.cat.orig = el.value; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.id === 'catEl') { ui.cat.el = el.value; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.classList.contains('addReq') && el.value) {
      const j = F.jutsus[+el.dataset.i]; j.reqs = j.reqs || [];
      if (!j.reqs.includes(el.value)) j.reqs.push(el.value);
      salvar(); render(); return;
    }
    if (el.id === 'catCat') { ui.cat.cat = el.value; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.id === 'catRank') { ui.cat.rank = el.value; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.id === 'catMeu') { ui.cat.meu = el.checked; ui.cat.lim = 40; renderCatalogo(); return; }
    if (el.id === 'lojaG') { ui.loja.g = el.value; renderLoja(); return; }
    if (el.id === 'criatG') { ui.criat.g = el.value; renderCriaturas(); return; }
    if (el.id === 'addMario' && el.value !== '') {
      if (el.value === 'novo') F.marionetes.push({ id: uid(), n: 'Marionete', pv: 5, pvMax: 5, atk: -2, desl: 1, comp: 0, componentes: [] });
      else { const m = CAT_M[+el.value]; F.marionetes.push({ id: uid(), n: m.n, pv: m.pv, pvMax: m.pv, atk: m.atk, desl: m.desl, comp: m.comp, componentes: [] }); }
      salvar(); render(); return;
    }
    if (el.classList.contains('addCompon') && el.value !== '') {
      const c = CAT_COMP[+el.value]; const m = F.marionetes[+el.dataset.i];
      m.componentes = m.componentes || [];
      m.componentes.push({ n: c[0], slots: c[1], dano: c[2], desc: c[4] });
      salvar(); render(); return;
    }
    if (el.id === 'arqImport' && el.files && el.files[0]) {
      const r = new FileReader(); r.onload = () => importarJSON(String(r.result)); r.readAsText(el.files[0]); return;
    }
    if (!el.dataset || !el.dataset.k) return;
    const re = aplicarCampo(el);
    const mj = el.dataset.k.match(/^jutsus\.(\d+)\.(estilo|rank|custoTipo|custoQtd)$/);
    if (mj) {
      const j = F.jutsus[+mj[1]];
      if (mj[2] === 'estilo' && !j.estilo) j.porTurno = /turno/i.test(String(j.custo || ''));
      ajustarCustoTurno(j); salvar();
      if (mj[2] === 'custoQtd') el.value = j.custoQtd;
    }
    if (re) render(); else atualizarDerivados();
  });

  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-aba]');
    if (tab) { trocarAba(tab.dataset.aba); return; }
    if (e.target.closest('[data-fechar]')) { fecharModal(); return; }
    const el = e.target.closest('[data-acao]');
    if (!el) return;
    const fn = ACOES[el.dataset.acao];
    if (!fn) return;
    if (el.closest('summary') || el.tagName === 'BUTTON') e.preventDefault();
    const re = fn(el);
    salvar();
    if (re === true) render(); else atualizarDerivados();
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) fecharModal(); });

  $('#nivelMenos').addEventListener('click', () => { F.nivel = clamp(F.nivel - 1, 1, 20); salvar(); render(); });
  $('#nivelMais').addEventListener('click', () => { F.nivel = clamp(F.nivel + 1, 1, 20); salvar(); render(); });
  $('#btnFichas').addEventListener('click', modalFichas);

  const hash = (location.hash || '').slice(1);
  if (ABAS[hash]) aba = hash;
  render();
})();

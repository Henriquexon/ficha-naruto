#!/usr/bin/env python3
"""Gera js/data/jutsus.js a partir do texto exportado do Google Doc
"RPG Naruto - Jutsus e Habilidades de Clãs".

Uso:
  1. No Google Docs: Arquivo > Fazer download > Markdown (.md)
  2. python3 tools/gerar_jutsus.py caminho/para/jutsus.md

Cada técnica do documento segue o modelo:
  - Nome (tradução)
  Custo / Rank / Efeito / Dano / Requerimentos / Range / Aprendizado / Custo de Ações
"""
import json, re, sys, os

FIELDS = ['Custo', 'Rank', 'Efeito', 'Dano', 'Requerimentos', 'Range', 'Aprendizado', 'Custo de Ações']
ALIAS = {'custo de aprendizado': 'Aprendizado', 'custo de ação': 'Custo de Ações',
         'requerimento': 'Requerimentos', 'alcance': 'Range', 'pa': 'Custo de Ações'}
FIELD_RE = re.compile(r'(?i)^(Custo de Aprendizado|Custo de Ações|Custo de Ação|Custo|Rank|Efeito|Dano|'
                      r'Requerimentos|Requerimento|Range|Alcance|Aprendizado|PA)\s*:\s*(.*)$')


def clean(s):
    for a, b in (('\\*', '*'), ('\\-', '-'), ('\\!', '!'), ('\\+', '+'), ('\\#', '#')):
        s = s.replace(a, b)
    s = re.sub(r'\*\*+', '', s)
    s = re.sub(r'(?<!\w)\*(?!\s)([^*]+?)\*(?!\w)', r'\1', s)
    return s.strip()


def key(k):
    k2 = ALIAS.get(k.lower())
    if k2:
        return k2
    for f in FIELDS:
        if f.lower() == k.lower():
            return f
    return k


def parse(text):
    # alguns títulos do documento ficam quebrados em duas linhas ("## **" + "****--Nome--**")
    text = re.sub(r'^(#{1,2}) \*\*\s*\n\*\*\*\*', r'\1 **', text, flags=re.M)
    lines = text.split('\n')
    cat = grp = None
    out, cur, field = [], None, None

    def flush():
        nonlocal cur
        if cur and ('Custo' in cur or 'Rank' in cur) and cur['nome'] != 'Nome (possível tradução)':
            out.append(cur)
        cur = None

    for i, raw in enumerate(lines):
        s = raw.rstrip()
        if s.startswith('# '):
            t = clean(s).strip('#').strip().strip('-–').strip()
            if t:
                cat, grp = t.strip('-– '), None
            flush()
            continue
        if s.startswith('## ') or re.match(r'^\*\*--.*--\*\*\s*$', s):
            t = clean(s).strip('#').strip().strip('-–').strip()
            if t and not re.match(r'^Rank\s+[DCBAS]', t):
                grp = t
            flush()
            continue
        m = re.match(r'^\s{0,4}-\s+(.+)$', s)
        if m:
            nxt = [x for x in lines[i + 1:i + 8] if x.strip()][:1]
            if nxt and re.match(r'^\s*(Custo|Rank|Efeito)\s*:', clean(nxt[0])):
                flush()
                cur = {'nome': clean(m.group(1)), 'categoria': cat, 'grupo': grp}
                field = None
                continue
        if cur is not None:
            c = clean(s)
            f = FIELD_RE.match(c)
            if f:
                field = key(f.group(1))
                cur[field] = f.group(2).strip()
            elif c and field and not c.startswith('|'):
                cur[field] = (cur[field] + '\n' + c).strip()
    flush()
    return out


def main():
    src = sys.argv[1]
    data = parse(open(src, encoding='utf-8').read())
    compact = [{
        'n': j['nome'], 'cat': j.get('categoria') or '', 'grp': j.get('grupo') or '',
        'rank': j.get('Rank', ''), 'custo': j.get('Custo', ''), 'efeito': j.get('Efeito', ''),
        'dano': j.get('Dano', ''), 'req': j.get('Requerimentos', ''), 'range': j.get('Range', ''),
        'apr': j.get('Aprendizado', ''), 'pa': j.get('Custo de Ações', ''),
    } for j in data]
    dest = os.path.join(os.path.dirname(__file__), '..', 'js', 'data', 'jutsus.js')
    with open(dest, 'w', encoding='utf-8') as fh:
        fh.write('// Gerado por tools/gerar_jutsus.py a partir de "RPG Naruto - Jutsus e Habilidades de Clãs".\n')
        fh.write('// Não edite à mão: regenere a partir do documento.\n')
        fh.write('window.CATALOGO_JUTSUS = ')
        json.dump(compact, fh, ensure_ascii=False, separators=(',', ':'))
        fh.write(';\n')
    print(f'{len(compact)} técnicas gravadas em {os.path.normpath(dest)}')


if __name__ == '__main__':
    main()

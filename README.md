# Portfólio — Bruno Moreira Dutra

Portfólio pessoal em HTML, CSS e JavaScript puro, sem build e sem dependências.
Tema de videogame retrô (menu de RPG), bilíngue PT-BR/EN, pronto para o GitHub Pages.

**Demo:** https://dutrabrun0.github.io/portfolio/

---

## Estrutura

```
portfolio/
├─ index.html                     # todo o conteúdo (PT-BR é o padrão, bom para SEO)
├─ css/
│  └─ style.css                   # tema, layout e responsividade
├─ js/
│  ├─ content.js                  # ← dados que você edita: skills e projetos em destaque
│  ├─ i18n.js                     # ← textos em português e inglês
│  └─ app.js                      # comportamento (intro, idioma, GitHub, menu, easter egg)
├─ assets/
│  ├─ favicon.svg                 # ícone da aba
│  ├─ og-image.png                # imagem de link (1200×630)
│  └─ cv/
│     └─ Curriculo-Bruno-Dutra.pdf  # arquivo do botão "Baixar CV"
├─ .nojekyll                      # faz o GitHub Pages servir os arquivos como estão
└─ README.md
```

---

## Rodar na sua máquina

Abrir o `index.html` com dois cliques funciona, mas a busca de repositórios no
GitHub e o `sessionStorage` se comportam melhor em um servidor local:

```bash
# Python (já instalado na maioria das máquinas)
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

No VS Code, a extensão **Live Server** faz a mesma coisa com um clique.

---

## Deploy no GitHub Pages

### Opção A — repositório de projeto (`.../portfolio`)

1. Crie um repositório público chamado `portfolio` na sua conta.
2. Suba os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Portfólio"
   git branch -M main
   git remote add origin https://github.com/DutraBrun0/portfolio.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment**
   → Source: `Deploy from a branch`
   → Branch: `main`, pasta `/ (root)` → **Save**.
4. Em um ou dois minutos o site fica em `https://dutrabrun0.github.io/portfolio/`.

### Opção B — site principal da conta (`dutrabrun0.github.io`)

Mesmos passos, mas o repositório precisa se chamar exatamente
`DutraBrun0.github.io`. O endereço fica `https://dutrabrun0.github.io/`.

### Depois do primeiro deploy

Troque o endereço nas três linhas do `index.html` que apontam para o site, para
o link do WhatsApp/LinkedIn mostrar o título e a imagem certos:

```html
<link rel="canonical" href="https://dutrabrun0.github.io/portfolio/">
<meta property="og:url"   content="https://dutrabrun0.github.io/portfolio/">
<meta property="og:image" content="https://dutrabrun0.github.io/portfolio/assets/og-image.png">
```

Dá para conferir como o link aparece em https://www.opengraph.xyz.

---

## Como editar o conteúdo

### Trocar o currículo

Substitua `assets/cv/Curriculo-Bruno-Dutra.pdf` por um PDF com **o mesmo nome**.
Se mudar o nome do arquivo, atualize os dois links `href="assets/cv/..."` no
`index.html` (um no topo, outro no fim da página).

### Skills (atributos)

Em `js/content.js`, no bloco `stats`. Cada item tem um nome e um nível de 1 a 5:

```js
{ name: 'Python', lv: 4 },
{ name: { pt: 'Testes automatizados', en: 'Automated testing' }, lv: 2 },
```

O nome pode ser um texto só (igual nos dois idiomas) ou um objeto `{ pt, en }`.
Para criar um grupo novo, copie um bloco inteiro de `group` + `items`.

### Projetos em destaque (missões principais)

Ainda em `js/content.js`, no bloco `featured`:

```js
{
  name: 'ProdManager',      // título que aparece no card
  repo: 'ProdManager',      // nome do repositório no GitHub (o link é montado sozinho)
  demo: '',                 // link da demo online; deixe '' se não tiver
  rare: true,               // true mostra a tag rosa "item raro"
  desc: { pt: '...', en: '...' },
  loot: ['Python', 'Flask', 'MySQL']   // tecnologias usadas
}
```

### Demais repositórios (missões secundárias)

São buscados na API pública do GitHub a cada visita, usando o usuário definido
em `js/content.js`:

```js
github: 'DutraBrun0',
maxRepos: 6,
```

Forks, repositórios arquivados e os que já estão em destaque ficam de fora, e a
ordem é do push mais recente para o mais antigo. **Se a API falhar ou estourar o
limite de requisições** (60 por hora por IP, sem login), a seção some sozinha e a
página continua mostrando as missões principais, com um aviso discreto.

Para um repositório aparecer bem aqui, escreva a descrição dele no GitHub — é o
texto que o card mostra.

### Textos da página

Toda frase está em `js/i18n.js`, nos blocos `pt` e `en`, com a mesma chave.
A versão em português também está escrita no `index.html` (é o que o Google lê e o
que aparece se o JavaScript não carregar), então **ao mudar uma frase em português,
mude nos dois lugares** — procure pelo `data-i18n="chave"` correspondente.

Exemplo: para mudar o texto da caixa de diálogo do topo, edite
`'hero.pitch'` no `js/i18n.js` e o `<p id="hero-dialogue">` no `index.html`.

### Idioma padrão

O site abre em português e guarda a escolha do visitante no `localStorage`.

Para mandar o link já em inglês, use `?lang=en`:
`https://dutrabrun0.github.io/portfolio/?lang=en`.

Para abrir no idioma do navegador, troque a linha em `js/app.js` (função `init`)
pela que está no comentário logo acima dela.

### Cores

Todas as cores são variáveis no topo do `css/style.css`, em `:root`.
Se trocar `--line`, troque também o `fill='%23243040'` dentro de `--frame` —
é o SVG que desenha as molduras pixeladas de cantos chanfrados.

### Imagem de link (Open Graph)

`assets/og-image.png` precisa ter 1200×630. Qualquer editor serve; use o fundo
`#0B0F14` e o verde `#5AF78E` para manter a identidade.

---

## O que a intro faz

Na **primeira visita de cada sessão**, a página abre numa tela de título com o
nome em pixel e "Pressione START" piscando.

- Sai sozinha depois de **3 segundos**, sem ninguém tocar em nada.
- Enter, Espaço, Esc, clique ou toque passam na hora; há um botão **Pular intro**
  navegável por teclado.
- Nas visitas seguintes da mesma sessão (`sessionStorage`), a página abre direto no Hero.
- Quem chega por um link com âncora (`...#missoes`) não vê a intro.
- Com **`prefers-reduced-motion`** ligado no sistema, não há intro, nem texto
  digitado, nem animação nenhuma.
- Todo o conteúdo já está no HTML desde o começo: a intro é só uma camada por
  cima, então buscadores e leitores de tela não dependem dela.

Ao terminar, o foco do teclado vai para o Hero.

**Easter egg:** digite o Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) em qualquer lugar da
página para desbloquear uma conquista.

---

## Acessibilidade e performance

- Contraste AA em todos os textos (texto escuro sobre os botões verde e âmbar).
- Navegação por teclado completa, com foco visível em âmbar.
- Níveis de skill têm rótulo para leitor de tela ("Nível 4 de 5"), não só os quadradinhos.
- Enquanto a intro está na tela, o resto da página fica `inert` — o Tab não escapa para trás dela.
- Sem framework, sem imagem pesada: só duas fontes do Google Fonts, um CSS e três JS pequenos.
- Animações todas desligadas com `prefers-reduced-motion: reduce`.

---

## Créditos

Fontes: [Silkscreen](https://fonts.google.com/specimen/Silkscreen) (títulos e UI) e
[IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (corpo do texto),
via Google Fonts.

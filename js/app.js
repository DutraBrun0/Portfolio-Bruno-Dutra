
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = { lang: 'pt', repos: null, typing: null };

  /* ---------------------------------------------------------------- utils */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function txt(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[state.lang] || value.pt || '';
  }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* modo privado: segue sem salvar */ }
    return null;
  }


  function applyLang(lang) {
    cancelTyping();
    state.lang = lang === 'en' ? 'en' : 'pt';
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'pt-BR';

    var ogLocale = $('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', state.lang === 'en' ? 'en_US' : 'pt_BR');

    $$('[data-i18n]').forEach(function (node) {
      var value = t(node.getAttribute('data-i18n'));
      if (node.tagName === 'META') node.setAttribute('content', value);
      else node.textContent = value;
    });

    $$('[data-stage]').forEach(function (node) {
      node.textContent = t('phase.word') + ' ' + node.getAttribute('data-stage');
    });

    $$('.lang__btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === state.lang;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    renderStats();
    renderFeatured();
    renderRepos();
    store('lang', state.lang);
  }

  function pips(level) {
    var wrap = el('span', 'pips');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', t('skills.level', { n: level }));
    for (var i = 1; i <= 5; i++) {
      wrap.appendChild(el('i', 'pip' + (i <= level ? ' is-on' : '')));
    }
    return wrap;
  }

  function renderStats() {
    var host = $('#stats');
    if (!host) return;
    host.textContent = '';

    CONTENT.stats.forEach(function (group) {
      var box = el('section', 'statgroup panel');
      box.appendChild(el('h3', 'statgroup__title', txt(group.group)));

      var list = el('ul', 'statgroup__list');
      group.items.forEach(function (item) {
        var row = el('li', 'stat');
        row.appendChild(el('span', 'stat__name', txt(item.name)));
        row.appendChild(pips(item.lv));
        row.appendChild(el('span', 'stat__lv', 'Lv.' + item.lv));
        list.appendChild(row);
      });

      box.appendChild(list);
      host.appendChild(box);
    });
  }

  function repoUrl(name) {
    return 'https://github.com/' + CONTENT.github + '/' + name;
  }

  function findRepo(name) {
    if (!state.repos) return null;
    var wanted = String(name).toLowerCase();
    for (var i = 0; i < state.repos.length; i++) {
      if (state.repos[i].name.toLowerCase() === wanted) return state.repos[i];
    }
    return null;
  }

  function linkTo(href, label) {
    var a = el('a', 'quest__link');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.appendChild(el('span', null, label));
    var arrow = el('span', null, '↗');
    arrow.setAttribute('aria-hidden', 'true');
    a.appendChild(arrow);
    return a;
  }

  function renderFeatured() {
    var host = $('#quests-featured');
    if (!host) return;
    host.textContent = '';

    CONTENT.featured.forEach(function (project) {
      var live = findRepo(project.repo);
      var card = el('article', 'quest panel quest--main');

      var head = el('div', 'quest__head');
      head.appendChild(el('h4', 'quest__title', project.name));
      if (project.rare) {
        head.appendChild(el('span', 'tag tag--rare', t('projects.rare')));
      }
      card.appendChild(head);

      var description = txt(project.desc) || (live && live.description) || t('projects.noDesc');
      card.appendChild(el('p', 'quest__desc', description));

      if (project.loot && project.loot.length) {
        var loot = el('ul', 'quest__loot');
        loot.setAttribute('aria-label', t('projects.loot'));
        project.loot.forEach(function (item) { loot.appendChild(el('li', null, item)); });
        card.appendChild(loot);
      }

      var links = el('div', 'quest__links');
      links.appendChild(linkTo(live ? live.html_url : repoUrl(project.repo), t('projects.repo')));
      var demo = project.demo || (live && live.homepage) || '';
      if (demo) links.appendChild(linkTo(demo, t('projects.demo')));
      card.appendChild(links);

      host.appendChild(card);
    });
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date)) return '';
    return date.toLocaleDateString(state.lang === 'en' ? 'en-GB' : 'pt-BR', {
      month: 'short', year: 'numeric'
    });
  }

  function renderRepos() {
    var host = $('#quests-repos');
    var section = $('#side-quests');
    if (!host || !section || !state.repos) return;

    var featuredNames = CONTENT.featured.map(function (p) { return p.repo.toLowerCase(); });
    var list = state.repos
      .filter(function (repo) { return featuredNames.indexOf(repo.name.toLowerCase()) === -1; })
      .slice(0, CONTENT.maxRepos);

    if (!list.length) { section.hidden = true; return; }

    host.textContent = '';
    list.forEach(function (repo) {
      var card = el('article', 'quest panel');

      var head = el('div', 'quest__head');
      head.appendChild(el('h4', 'quest__title', repo.name));
      card.appendChild(head);

      card.appendChild(el('p', 'quest__desc', repo.description || t('projects.noDesc')));

      var meta = el('p', 'quest__meta');
      if (repo.language) meta.appendChild(el('span', null, repo.language));
      if (repo.stargazers_count > 0) {
        meta.appendChild(el('span', null, t('projects.stars', { n: repo.stargazers_count })));
      }
      var when = formatDate(repo.pushed_at);
      if (when) meta.appendChild(el('span', null, t('projects.updated', { date: when })));
      if (meta.childNodes.length) card.appendChild(meta);

      var links = el('div', 'quest__links');
      links.appendChild(linkTo(repo.html_url, t('projects.repo')));
      if (repo.homepage) links.appendChild(linkTo(repo.homepage, t('projects.demo')));
      card.appendChild(links);

      host.appendChild(card);
    });

    section.hidden = false;
  }

  function loadRepos() {
    var status = $('#repos-status');
    if (!window.fetch || !CONTENT.github) return;
    if (status) status.textContent = t('repos.loading');

    var url = 'https://api.github.com/users/' + encodeURIComponent(CONTENT.github) +
      '/repos?per_page=100&sort=pushed&type=owner';

    fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('resposta inesperada');
        state.repos = data
          .filter(function (repo) { return !repo.fork && !repo.archived && !repo.private; })
          .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); });

        if (status) status.textContent = '';
        renderFeatured();  
        renderRepos();
      })
      .catch(function () {
       
        if (status) status.textContent = t('repos.error');
      });
  }


  function cancelTyping() {
    if (!state.typing) return;
    state.typing = null;
    var box = $('.dialogue');
    var line = $('#hero-dialogue');
    if (box) {
      box.classList.remove('is-typing');
      var shadow = $('.sr-only', box);
      if (shadow) shadow.remove();
    }
    if (line) {
      line.removeAttribute('aria-hidden');
      line.style.minHeight = '';
    }
  }

  function typeDialogue() {
    var box = $('.dialogue');
    var line = $('#hero-dialogue');
    if (!box || !line || reduceMotion) return;

    var full = line.textContent;
    line.style.minHeight = line.offsetHeight + 'px';   

    var shadow = el('span', 'sr-only', full);         
    box.appendChild(shadow);
    line.setAttribute('aria-hidden', 'true');
    line.textContent = '';
    box.classList.add('is-typing');

    var index = 0;
    var token = {};
    state.typing = token;

    function finish() {
      if (state.typing !== token) return;
      state.typing = null;
      line.textContent = full;
      box.classList.remove('is-typing');
      line.removeAttribute('aria-hidden');
      line.style.minHeight = '';
      shadow.remove();
    }

  
    window.setTimeout(finish, 4000);

    (function step() {
      if (state.typing !== token) return;             
      index = Math.min(full.length, index + 3);
      line.textContent = full.slice(0, index);
      if (index < full.length) requestAnimationFrame(step);
      else finish();
    })();
  }

  

  function setupIntro() {
    var intro = $('#intro');
    if (!intro) return;

    var seen = false;
    try { seen = window.sessionStorage.getItem('intro') === 'done'; } catch (e) { /* ignora */ }

    var deepLink = window.location.hash && window.location.hash !== '#inicio';
    if (reduceMotion || seen || deepLink) return;

    var behind = $$('main, .topbar, .rail, .footer, .skip-link');
    var dissolve = $('#dissolve');
    var timer = null;
    var closed = false;

    intro.hidden = false;
    document.body.classList.add('is-intro');
    behind.forEach(function (node) { node.setAttribute('inert', ''); });
    $('#intro-start').focus({ preventScroll: true });

    function buildDissolve() {
      var size = 44;
      var cols = Math.min(40, Math.ceil(window.innerWidth / size));
      var rows = Math.min(30, Math.ceil(window.innerHeight / size));
      dissolve.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
      dissolve.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
      var frag = document.createDocumentFragment();
      for (var i = 0; i < cols * rows; i++) {
        var cell = document.createElement('i');
        cell.style.transitionDelay = (Math.random() * 280).toFixed(0) + 'ms';
        frag.appendChild(cell);
      }
      dissolve.appendChild(frag);
    }

    function close() {
      if (closed) return;
      closed = true;
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      try { window.sessionStorage.setItem('intro', 'done'); } catch (e) { /* ignora */ }

      buildDissolve();
      dissolve.classList.add('is-active');

      requestAnimationFrame(function () {
        requestAnimationFrame(function () { dissolve.classList.add('is-off'); });
      });

      window.setTimeout(function () {
        intro.hidden = true;
        document.body.classList.remove('is-intro');
        behind.forEach(function (node) { node.removeAttribute('inert'); });
        var hero = $('#inicio');
        if (hero) hero.focus({ preventScroll: true });
        typeDialogue();
      }, 520);
    }

    function onKey(event) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar' || event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener('keydown', onKey);
    intro.addEventListener('click', close);
    intro.addEventListener('touchstart', close, { passive: true });
    timer = window.setTimeout(close, 3000);
  }


  function setupNav() {
    var links = $$('.rail__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });

    var topbar = document.querySelector('.topbar');
    var offset = (topbar ? topbar.offsetHeight : 56) + 40;

    function setCurrent(id) {
      links.forEach(function (link) {
        link.classList.toggle('is-current', link === byId[id]);
      });
      var rail = $('#rail');
      var active = byId[id];
      if (rail && active && rail.scrollWidth > rail.clientWidth) {
        rail.scrollTo({ left: Math.max(0, active.offsetLeft - 24), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: '-' + offset + 'px 0px -55% 0px', threshold: 0 });

    $$('main .section').forEach(function (section) { observer.observe(section); });
  }


  function setupKonami() {
    var code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var at = 0;
    var toast = $('#toast');
    var hideTimer = null;
    if (!toast) return;

    document.addEventListener('keydown', function (event) {
      var key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      at = key === code[at] ? at + 1 : (key === code[0] ? 1 : 0);
      if (at < code.length) return;
      at = 0;

      toast.textContent = '';
      toast.appendChild(el('b', null, t('egg.title')));
      toast.appendChild(document.createElement('br'));
      toast.appendChild(el('span', null, t('egg.text')));
      toast.classList.add('is-on');

      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () { toast.classList.remove('is-on'); }, 6000);
    });
  }

 

  function init() {
    
    var param = (window.location.search.match(/[?&]lang=(pt|en)\b/) || [])[1];
    var saved = param || store('lang') || 'pt';
    applyLang(saved);

    $$('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
    });

    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    loadRepos();
    setupNav();
    setupKonami();
    setupIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

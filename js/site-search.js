/* Site search: a button in the nav bar and Ctrl/⌘ + K (or "/") open a
   dialog that searches every note's title, summary, category, tags and body
   in both languages (index: /search.json from scripts/search-index.js,
   loaded on first use). Results show the category and the matching passage.
   Styles in custom.css ("Site search"). */
(function () {
  'use strict'

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  const lang = () => (window.siteI18n && window.siteI18n.lang() === 'en' ? 'en' : 'zh')
  const say = (zh, en) => (lang() === 'en' ? en : zh)
  const other = l => (l === 'en' ? 'zh' : 'en')

  let index = null
  let loading = null
  let dialog = null
  let input = null
  let list = null
  let status = null
  let results = []
  let active = 0
  let lastFocus = null

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  /* ---------- Nav button ---------- */
  function addButton () {
    const host = document.getElementById('menus')
    if (!host || host.querySelector('.site-search-button')) return
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'site-search-button'
    button.setAttribute('aria-label', '搜索')
    button.innerHTML = '<i class="fas fa-search" aria-hidden="true"></i>'
    button.addEventListener('click', open)
    host.insertBefore(button, document.getElementById('toggle-menu'))
  }

  /* ---------- Dialog ---------- */
  function build () {
    dialog = document.createElement('div')
    dialog.className = 'site-search'
    dialog.hidden = true
    dialog.innerHTML =
      '<div class="site-search-mask"></div>' +
      '<div class="site-search-panel" role="dialog" aria-modal="true" aria-label="搜索">' +
        '<label class="site-search-field"><i class="fas fa-search" aria-hidden="true"></i>' +
          '<input type="search" autocomplete="off" spellcheck="false" placeholder="搜索标题、摘要和正文">' +
          '<kbd class="site-search-esc">Esc</kbd></label>' +
        '<p class="site-search-status" aria-live="polite"></p>' +
        '<ul class="site-search-results" role="listbox"></ul>' +
        '<p class="site-search-help"><span><kbd>↑</kbd><kbd>↓</kbd> 选择</span><span><kbd>↵</kbd> 打开</span><span><kbd>Esc</kbd> 关闭</span></p>' +
      '</div>'
    document.body.appendChild(dialog)
    input = dialog.querySelector('input')
    list = dialog.querySelector('.site-search-results')
    status = dialog.querySelector('.site-search-status')

    dialog.querySelector('.site-search-mask').addEventListener('click', close)
    dialog.querySelector('.site-search-esc').addEventListener('click', close)
    input.addEventListener('input', () => run(input.value))
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        move(event.key === 'ArrowDown' ? 1 : -1)
      } else if (event.key === 'Enter' && results[active]) {
        event.preventDefault()
        window.location.href = results[active].item.path
      }
    })
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    })
  }

  function open () {
    if (!dialog) build()
    if (!dialog.hidden) return
    lastFocus = document.activeElement
    dialog.hidden = false
    document.documentElement.classList.add('site-search-open')
    input.value = ''
    list.textContent = ''
    status.textContent = say('输入关键词，中英文都可以搜。', 'Type to search, in Chinese or English.')
    input.focus()
    load()
  }

  function close () {
    if (!dialog || dialog.hidden) return
    dialog.hidden = true
    document.documentElement.classList.remove('site-search-open')
    if (lastFocus && lastFocus.focus) lastFocus.focus()
  }

  function load () {
    if (index || loading) return loading
    loading = fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        index = data
        if (input.value) run(input.value)
      })
      .catch(() => {
        loading = null
        status.textContent = say('搜索索引加载失败，请稍后再试。', 'The search index could not be loaded. Please try again.')
      })
    return loading
  }

  /* ---------- Matching ---------- */
  function score (item, terms) {
    const fields = l => ({
      title: (item.title[l] || '').toLowerCase(),
      meta: [item.category[l], ...(item.tags[l] || [])].join(' ').toLowerCase(),
      description: (item.description[l] || '').toLowerCase(),
      text: (item.text[l] || '').toLowerCase()
    })
    const f = { zh: fields('zh'), en: fields('en') }
    let total = 0
    for (const term of terms) {
      let best = 0
      for (const l of ['zh', 'en']) {
        const x = f[l]
        let s = 0
        if (x.title.includes(term)) s += x.title.startsWith(term) ? 20 : 12
        if (x.meta.includes(term)) s += 5
        if (x.description.includes(term)) s += 4
        if (x.text.includes(term)) s += Math.min(6, x.text.split(term).length - 1)
        best = Math.max(best, s)
      }
      if (!best) return 0
      total += best
    }
    return total
  }

  // The passage around the first match, preferring the current language.
  function passage (item, terms) {
    for (const l of [lang(), other(lang())]) {
      for (const field of ['text', 'description']) {
        const text = item[field][l] || ''
        const lower = text.toLowerCase()
        const at = terms.map(t => lower.indexOf(t)).filter(i => i !== -1).sort((a, b) => a - b)[0]
        if (at === undefined) continue
        const start = Math.max(0, at - 36)
        const end = Math.min(text.length, at + 84)
        return { lang: l, text: (start ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '') }
      }
    }
    return { lang: lang(), text: item.description[lang()] || item.description.zh || '' }
  }

  function mark (text, terms) {
    const safe = escapeHtml(text)
    if (!terms.length) return safe
    return safe.replace(new RegExp(`(${terms.map(t => escapeRe(escapeHtml(t))).join('|')})`, 'gi'), '<mark>$1</mark>')
  }

  function run (value) {
    const terms = value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    list.textContent = ''
    results = []
    active = 0
    if (!terms.length) {
      status.textContent = say('输入关键词，中英文都可以搜。', 'Type to search, in Chinese or English.')
      return
    }
    if (!index) {
      status.textContent = say('正在加载索引……', 'Loading the index…')
      return
    }
    results = index
      .map(item => ({ item, score: score(item, terms) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
    status.textContent = results.length
      ? say(`找到 ${results.length} 篇笔记`, `${results.length} ${results.length === 1 ? 'note' : 'notes'} found`)
      : say('没有找到相关笔记，换个关键词试试。', 'No notes match. Try another word.')

    results.forEach((r, i) => {
      const l = r.item.title[lang()] ? lang() : 'zh'
      const found = passage(r.item, terms)
      const li = document.createElement('li')
      li.setAttribute('role', 'option')
      li.innerHTML =
        `<a href="${escapeHtml(r.item.path)}">` +
          `<span class="site-search-meta"><span class="site-search-category">${escapeHtml(r.item.category[l] || r.item.category.zh)}</span>` +
          `<time>${escapeHtml(r.item.date)}</time>` +
          (found.lang !== lang() ? `<span class="site-search-lang">${found.lang === 'en' ? 'EN' : '中'}</span>` : '') + '</span>' +
          `<span class="site-search-title">${mark(r.item.title[l] || r.item.title.zh, terms)}</span>` +
          `<span class="site-search-passage">${mark(found.text, terms)}</span>` +
        '</a>'
      li.addEventListener('mousemove', () => select(i))
      list.appendChild(li)
    })
    select(0)
  }

  function select (i) {
    active = i
    Array.from(list.children).forEach((li, j) => {
      li.classList.toggle('is-active', j === i)
      li.setAttribute('aria-selected', String(j === i))
    })
  }

  function move (step) {
    if (!results.length) return
    select((active + step + results.length) % results.length)
    const li = list.children[active]
    if (li) li.scrollIntoView({ block: 'nearest' })
  }

  /* ---------- Shortcuts ---------- */
  document.addEventListener('keydown', event => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      if (dialog && !dialog.hidden) close()
      else open()
    } else if (event.key === '/' && !typing) {
      event.preventDefault()
      open()
    }
  })

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton, { once: true })
  else addButton()
})()

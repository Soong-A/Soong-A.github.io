/* Post pages on phones and tablets: a "目录" pill at the bottom shows the
   section being read; tapping it opens a bottom sheet listing the headings
   (h2 and h3 of the visible language), the current one marked in gold.
   Replaces the theme's unlabeled floating TOC button below 900px. Styles in
   custom.css ("Mobile table of contents"). */
(function () {
  'use strict'

  const article = document.getElementById('article-container')
  if (!article || !document.getElementById('post')) return

  const small = window.matchMedia('(max-width: 900px)')
  const lang = () => (window.siteI18n && window.siteI18n.lang() === 'en' ? 'en' : 'zh')
  const say = (zh, en) => (lang() === 'en' ? en : zh)

  const pill = document.createElement('button')
  pill.type = 'button'
  pill.className = 'toc-pill'
  pill.setAttribute('aria-haspopup', 'dialog')
  pill.innerHTML = '<i class="fas fa-list-ul" aria-hidden="true"></i><span class="toc-pill-label"></span><span class="toc-pill-current"></span>'

  const sheet = document.createElement('div')
  sheet.className = 'toc-sheet'
  sheet.hidden = true
  sheet.innerHTML =
    '<div class="toc-sheet-mask"></div>' +
    '<div class="toc-sheet-panel" role="dialog" aria-modal="true">' +
      '<div class="toc-sheet-head"><b class="toc-sheet-title"></b><button type="button" class="toc-sheet-close"><i class="fas fa-times" aria-hidden="true"></i></button></div>' +
      '<ol class="toc-sheet-list"></ol>' +
    '</div>'
  document.body.appendChild(pill)
  document.body.appendChild(sheet)

  const list = sheet.querySelector('.toc-sheet-list')
  const current = pill.querySelector('.toc-pill-current')
  let headings = []
  let at = -1
  let frame = 0

  const headingText = heading => {
    const copy = heading.cloneNode(true)
    copy.querySelectorAll('.headerlink, .toc-number').forEach(n => n.remove())
    return copy.textContent.trim()
  }

  function build () {
    headings = Array.from(article.querySelectorAll('h2[id], h3[id]')).filter(h => h.offsetParent !== null)
    // Indent only below the article's own top level (some notes start at h3).
    const top = Math.min(...headings.map(h => Number(h.tagName[1])))
    list.textContent = ''
    headings.forEach(h => {
      const li = document.createElement('li')
      li.className = Number(h.tagName[1]) > top ? 'is-sub' : ''
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = headingText(h)
      button.addEventListener('click', () => {
        close()
        h.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      li.appendChild(button)
      list.appendChild(li)
    })
    pill.querySelector('.toc-pill-label').textContent = say('目录', 'Contents')
    sheet.querySelector('.toc-sheet-title').textContent = say('目录', 'Contents')
    sheet.querySelector('.toc-sheet-close').setAttribute('aria-label', say('关闭目录', 'Close contents'))
    pill.setAttribute('aria-label', say('打开目录', 'Open contents'))
    at = -1
    update()
  }

  function update () {
    frame = 0
    const box = article.getBoundingClientRect()
    // Show the pill once the article has started, and hide it after the end.
    const reading = small.matches && headings.length > 1 && box.top < window.innerHeight * 0.5 && box.bottom > window.innerHeight * 0.6
    pill.classList.toggle('is-shown', reading)

    let now = -1
    headings.forEach((h, i) => {
      if (h.getBoundingClientRect().top <= window.innerHeight * 0.3) now = i
    })
    if (now === at) return
    at = now
    current.textContent = now >= 0 ? headingText(headings[now]) : ''
    Array.from(list.children).forEach((li, i) => li.classList.toggle('is-current', i === now))
  }

  function open () {
    sheet.hidden = false
    document.documentElement.classList.add('toc-sheet-open')
    const here = list.children[Math.max(0, at)]
    if (here) here.scrollIntoView({ block: 'center' })
    sheet.querySelector('.toc-sheet-close').focus()
  }

  function close () {
    sheet.hidden = true
    document.documentElement.classList.remove('toc-sheet-open')
  }

  pill.addEventListener('click', open)
  sheet.querySelector('.toc-sheet-mask').addEventListener('click', close)
  sheet.querySelector('.toc-sheet-close').addEventListener('click', () => { close(); pill.focus() })
  sheet.addEventListener('keydown', event => { if (event.key === 'Escape') close() })

  const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  window.addEventListener('load', build)
  document.addEventListener('site-lang-change', build)
  build()
})()

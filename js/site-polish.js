(function () {
  'use strict'

  const counters = [
    {
      id: 'busuanzi_value_site_uv',
      baseline: 628,
      zh: '累计独立访客；同一浏览器首次访问本站时计为 1 位',
      en: 'All-time unique visitors; one browser is counted once'
    },
    {
      id: 'busuanzi_value_site_pv',
      baseline: 898,
      zh: '累计页面浏览；每次打开或切换页面计为 1 次',
      en: 'All-time page views; each page load counts once'
    },
    {
      id: 'busuanzi_value_page_pv',
      zh: '当前文章的累计浏览次数',
      en: 'All-time views for this article'
    }
  ]

  const language = () => document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh'

  function decorateCounter(item) {
    const element = document.getElementById(item.id)
    if (!element) return

    element.setAttribute('aria-live', 'polite')
    element.setAttribute('title', item[language()])

    const render = () => {
      const raw = element.dataset.counterRaw || element.textContent.replace(/[^0-9]/g, '')
      if (!raw) return false

      const serviceValue = Number(raw)
      if (!Number.isSafeInteger(serviceValue)) return false

      const value = serviceValue + (item.baseline || 0)

      const formatted = new Intl.NumberFormat(language() === 'en' ? 'en-GB' : 'zh-CN').format(value)
      if (element.textContent.trim() !== formatted) element.textContent = formatted
      element.dataset.counterRaw = String(serviceValue)
      element.dataset.counterReady = 'true'
      element.setAttribute('aria-label', `${item[language()]}：${formatted}`)
      return true
    }

    if (render()) return

    const observer = new MutationObserver(() => {
      if (render()) observer.disconnect()
    })
    observer.observe(element, { childList: true, characterData: true, subtree: true })

    window.setTimeout(() => {
      observer.disconnect()
      if (element.dataset.counterReady === 'true') return
      element.textContent = '—'
      element.setAttribute('title', language() === 'en' ? 'Statistics are temporarily unavailable' : '统计服务暂时不可用')
      element.setAttribute('aria-label', element.getAttribute('title'))
    }, 9000)
  }

  // Tablets and phones: the sidebar research index starts folded and its
  // heading toggles it. The button is hidden above 900px (see custom.css).
  function foldIndex() {
    const card = document.querySelector('#aside-content .card-index')
    if (!card || card.dataset.foldReady === 'true') return
    const heading = card.querySelector('.item-headline')
    const body = card.querySelector('.index-body')
    if (!heading || !body) return

    card.dataset.foldReady = 'true'
    card.classList.add('is-folded')

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'card-fold-toggle'
    button.setAttribute('aria-controls', body.id)
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', '展开或收起索引')
    button.innerHTML = '<i class="fas fa-chevron-down" aria-hidden="true"></i>'
    button.addEventListener('click', () => {
      const open = card.classList.toggle('is-folded') === false
      button.setAttribute('aria-expanded', String(open))
    })
    heading.appendChild(button)
  }

  // Home page, desktop: the sidebar group below the author card is sticky,
  // 76px from the top (custom.css). In a window too short for that, only its
  // lower part stays in view: it sticks by its bottom edge, 20px above the
  // window's, so its last card is never cut off.
  function fitStickyAside() {
    const group = document.querySelector('#content-inner > #aside-content > .sticky_layout')
    if (!group || !document.getElementById('recent-posts')) return

    const TOP = 76
    const fit = () => {
      const room = window.innerHeight - group.offsetHeight - 20
      group.style.setProperty('--aside-sticky-top', `${Math.min(TOP, room)}px`)
    }
    fit()
    window.addEventListener('resize', fit, { passive: true })
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(group)
  }

  // Tablets and phones: the floating buttons wait until the reader is past
  // most of the first screen, and fade after a few idle seconds
  // (is-far / is-idle, styled in custom.css up to 900px).
  function calmRightside() {
    const side = document.getElementById('rightside')
    if (!side) return

    let timer = 0
    const wake = () => {
      side.classList.remove('is-idle')
      window.clearTimeout(timer)
      timer = window.setTimeout(() => side.classList.add('is-idle'), 2500)
    }
    const update = () => {
      side.classList.toggle('is-far', window.scrollY > window.innerHeight * 0.6)
      wake()
    }
    window.addEventListener('scroll', update, { passive: true })
    side.addEventListener('pointerdown', wake)
    side.addEventListener('focusin', wake)
    update()
  }

  // A back button at the left of the nav bar, on every page but the home
  // page. It steps back when the reader came from this site; arriving from
  // elsewhere (a search, a shared link), it goes to the page's parent:
  // a post to the library, a tag to the constellation, the rest home.
  // It goes just before #blog-info, not inside: the theme swaps the site name
  // for the post title by hiding #blog-info's first link.
  function addBackButton() {
    const info = document.getElementById('blog-info')
    const path = location.pathname
    if (!info || path === '/' || document.querySelector('#nav .nav-back')) return

    const parent = /^\/tags\/.+/.test(path) ? '/tags/'
      : /^\/\d{4}\/\d{2}\/\d{2}\//.test(path) || /^\/(categories|archives)\/.+/.test(path) ? '/archives/'
        : '/'
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'nav-back'
    button.title = '返回'
    button.setAttribute('aria-label', '返回')
    button.innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i>'
    button.addEventListener('click', () => {
      let fromHere = false
      try { fromHere = new URL(document.referrer).origin === location.origin } catch (e) {}
      if (fromHere && history.length > 1) history.back()
      else location.href = parent
    })
    info.parentNode.insertBefore(button, info)
  }

  // The slide-out menu's dark-mode button (includes/sidebar.pug) passes the
  // click on to the theme's own #darkmode button.
  function bindMenuDarkmode() {
    const button = document.querySelector('#sidebar-menus .sidebar-darkmode')
    const theme = document.getElementById('darkmode')
    if (!button || !theme) {
      if (button) button.hidden = true
      return
    }
    button.addEventListener('click', () => theme.click())
  }

  function enhance() {
    counters.forEach(decorateCounter)
    foldIndex()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true })
    document.addEventListener('DOMContentLoaded', fitStickyAside, { once: true })
    document.addEventListener('DOMContentLoaded', calmRightside, { once: true })
    document.addEventListener('DOMContentLoaded', bindMenuDarkmode, { once: true })
    document.addEventListener('DOMContentLoaded', addBackButton, { once: true })
  } else {
    enhance()
    fitStickyAside()
    calmRightside()
    bindMenuDarkmode()
    addBackButton()
  }

  document.addEventListener('pjax:complete', enhance)
  document.addEventListener('site-lang-change', enhance)

  // Subscribe page (source/subscribe/index.md): click-to-copy the feed URL.
  // Delegated on document so it needs no re-binding after pjax navigation.
  function fallbackCopy(text) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(ta)
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('.subscribe-copy')
    if (!btn) return
    const src = document.getElementById(btn.dataset.copyTarget)
    if (!src) return
    const text = src.textContent.trim()
    const copied = () => {
      const was = btn.textContent
      btn.textContent = btn.closest('[data-lang="en"]') ? 'Copied' : '已复制'
      btn.disabled = true
      setTimeout(() => { btn.textContent = was; btn.disabled = false }, 1600)
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(copied, () => { fallbackCopy(text); copied() })
    } else {
      fallbackCopy(text)
      copied()
    }
  })
})()

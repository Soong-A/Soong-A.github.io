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

  // Phones: the sidebar tag card starts folded and its heading toggles it.
  // The button is hidden on wider screens (see custom.css).
  function foldTags() {
    const card = document.querySelector('#aside-content .card-tags')
    if (!card || card.dataset.foldReady === 'true') return
    const heading = card.querySelector('.item-headline')
    const cloud = card.querySelector('.card-tag-cloud')
    if (!heading || !cloud) return

    card.dataset.foldReady = 'true'
    card.classList.add('is-folded')
    cloud.id = cloud.id || 'card-tag-cloud'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'card-fold-toggle'
    button.setAttribute('aria-controls', cloud.id)
    button.setAttribute('aria-expanded', 'false')
    button.setAttribute('aria-label', '展开或收起标签')
    button.innerHTML = '<i class="fas fa-chevron-down" aria-hidden="true"></i>'
    button.addEventListener('click', () => {
      const open = card.classList.toggle('is-folded') === false
      button.setAttribute('aria-expanded', String(open))
    })
    heading.appendChild(button)
  }

  // Home page, desktop: the sidebar group below the author card is sticky
  // (custom.css). When it is taller than the window it sticks by its bottom
  // edge, so its last card is never cut off.
  function fitStickyAside() {
    const group = document.querySelector('#content-inner > #aside-content > .sticky_layout')
    if (!group || !document.getElementById('recent-posts')) return

    const fit = () => {
      const room = window.innerHeight - group.offsetHeight - 20
      group.style.setProperty('--aside-sticky-top', `${Math.min(20, room)}px`)
      group.style.setProperty('--aside-sticky-top-nav', `${Math.min(70, room)}px`)
    }
    fit()
    window.addEventListener('resize', fit, { passive: true })
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(group)
  }

  function enhance() {
    counters.forEach(decorateCounter)
    foldTags()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true })
    document.addEventListener('DOMContentLoaded', fitStickyAside, { once: true })
  } else {
    enhance()
    fitStickyAside()
  }

  document.addEventListener('pjax:complete', enhance)
  document.addEventListener('site-lang-change', enhance)
})()

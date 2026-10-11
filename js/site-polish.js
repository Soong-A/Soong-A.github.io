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

  function enhance() {
    counters.forEach(decorateCounter)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance, { once: true })
  } else {
    enhance()
  }

  document.addEventListener('pjax:complete', enhance)
  document.addEventListener('site-lang-change', enhance)
})()

;(function () {
  'use strict'

  function updateAsideToggle(aside, button) {
    const expanded = aside.classList.contains('aside-expanded')
    const english = document.documentElement.getAttribute('data-lang') === 'en'
    const label = expanded
      ? (english ? 'Collapse sidebar' : '收起右侧栏')
      : (english ? 'Expand sidebar' : '展开右侧栏')
    const icon = button.querySelector('i')

    button.setAttribute('aria-expanded', String(expanded))
    button.setAttribute('aria-label', label)
    button.setAttribute('title', label)
    if (icon) {
      icon.classList.toggle('fa-chevron-right', expanded)
      icon.classList.toggle('fa-chevron-left', !expanded)
    }
  }

  function initAsideToggle() {
    const aside = document.getElementById('aside-content')
    const button = document.getElementById('aside-collapse-toggle')
    if (!aside || !button) return

    if (!aside.classList.contains('aside-expanded') && !aside.classList.contains('aside-collapsed')) {
      const home = location.pathname === '/' || /^\/page\/\d+\/?$/.test(location.pathname)
      aside.classList.add(home ? 'aside-expanded' : 'aside-collapsed')
    }

    if (button.dataset.toggleReady !== 'true') {
      button.dataset.toggleReady = 'true'
      button.addEventListener('click', () => {
        const shouldExpand = aside.classList.contains('aside-collapsed')
        aside.classList.toggle('aside-expanded', shouldExpand)
        aside.classList.toggle('aside-collapsed', !shouldExpand)
        updateAsideToggle(aside, button)
        window.setTimeout(() => window.dispatchEvent(new Event('resize')), 280)
      })
    }

    updateAsideToggle(aside, button)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsideToggle, { once: true })
  } else {
    initAsideToggle()
  }

  document.addEventListener('pjax:complete', initAsideToggle)
  document.addEventListener('site-lang-change', initAsideToggle)
})()

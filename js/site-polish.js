(function () {
  'use strict'

  const counters = [
    {
      id: 'busuanzi_value_site_uv',
      zh: '累计独立访客；同一浏览器首次访问本站时计为 1 位',
      en: 'All-time unique visitors; one browser is counted once'
    },
    {
      id: 'busuanzi_value_site_pv',
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
      const raw = element.textContent.replace(/[^0-9]/g, '')
      if (!raw) return false

      const value = Number(raw)
      if (!Number.isSafeInteger(value)) return false

      const formatted = new Intl.NumberFormat(language() === 'en' ? 'en-GB' : 'zh-CN').format(value)
      if (element.textContent.trim() !== formatted) element.textContent = formatted
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

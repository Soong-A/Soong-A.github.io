/* Privacy-conscious engagement tracking for article pages.
 *
 * Events sent to GA4 on the production site only:
 * - article_read_75: the reader reaches 75% of the article
 * - related_article_click: the reader opens a related article
 * - series_next_click: the reader continues to the next article
 *
 * Localhost is disabled in the Analytics loader, so local design/testing
 * sessions never enter the production property.
 */
(function () {
  'use strict'

  let article = null
  let articlePath = ''
  let hasTrackedRead = false
  let frame = 0

  const contentLanguage = () => {
    const active = document.querySelector('.lang-switch-btn.active, .lang-switch-btn[aria-pressed="true"]')
    return active && active.dataset.lang
      ? active.dataset.lang
      : (document.documentElement.lang || 'zh-CN')
  }

  const canTrack = () => window.soongAnalyticsEnabled === true && typeof window.gtag === 'function'

  const send = (name, parameters) => {
    if (!canTrack()) return
    window.gtag('event', name, Object.assign({
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_language: contentLanguage()
    }, parameters || {}))
  }

  const storageKey = path => `soong:article-read-75:${path}`

  const readStoredState = path => {
    try {
      return window.sessionStorage.getItem(storageKey(path)) === '1'
    } catch (error) {
      return false
    }
  }

  const storeReadState = path => {
    try {
      window.sessionStorage.setItem(storageKey(path), '1')
    } catch (error) {}
  }

  const resetArticle = () => {
    article = document.querySelector('#post #article-container')
    articlePath = window.location.pathname
    hasTrackedRead = readStoredState(articlePath)
    scheduleProgressCheck()
  }

  const checkProgress = () => {
    frame = 0
    if (!article || hasTrackedRead || !document.documentElement.contains(article)) return

    const box = article.getBoundingClientRect()
    const top = box.top + window.scrollY
    const height = Math.max(1, article.offsetHeight)
    const readingPoint = window.scrollY + window.innerHeight * 0.75
    const progress = Math.min(1, Math.max(0, (readingPoint - top) / height))

    if (progress < 0.75) return

    hasTrackedRead = true
    storeReadState(articlePath)
    send('article_read_75', {
      article_path: articlePath,
      article_title: document.querySelector('#post-info .post-title')?.textContent.trim() || document.title,
      percent_scrolled: 75
    })
  }

  function scheduleProgressCheck () {
    if (!frame) frame = window.requestAnimationFrame(checkProgress)
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a')
    if (!link || !document.getElementById('post')) return

    if (link.matches('#article-container .seo-related a')) {
      send('related_article_click', {
        link_url: link.href,
        destination_title: link.textContent.trim()
      })
      return
    }

    if (link.matches('#pagination a.pagination-related[data-article-nav="next"]')) {
      send('series_next_click', {
        link_url: link.href,
        destination_title: link.getAttribute('title') || link.textContent.trim()
      })
    }
  })

  window.addEventListener('scroll', scheduleProgressCheck, { passive: true })
  window.addEventListener('resize', scheduleProgressCheck, { passive: true })
  window.addEventListener('load', resetArticle)
  document.addEventListener('pjax:complete', resetArticle)
  document.addEventListener('site-lang-change', scheduleProgressCheck)
  resetArticle()
})()

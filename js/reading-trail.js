/* Post pages: a thin gold reading trail beside the article. It fills as the
   article is read, and each section heading (h2) is a node on it: passed
   nodes turn gold, hovering shows the heading, clicking jumps there. Only
   the visible language's headings count (see .lang-block in scripts/i18n.js).
   Styles in custom.css; hidden below 1100px, where the TOC button serves. */
(function () {
  'use strict'

  const article = document.getElementById('article-container')
  if (!article || !document.getElementById('post')) return

  const trail = document.createElement('nav')
  trail.className = 'reading-trail'
  trail.setAttribute('aria-label', '阅读轨迹')
  trail.innerHTML = '<span class="reading-trail-line"></span><span class="reading-trail-fill"></span>'
  document.body.appendChild(trail)
  const fill = trail.querySelector('.reading-trail-fill')

  let marks = []
  let frame = 0

  const headingText = heading => {
    const copy = heading.cloneNode(true)
    copy.querySelectorAll('.headerlink, .toc-number').forEach(n => n.remove())
    return copy.textContent.trim()
  }

  function build () {
    trail.querySelectorAll('.reading-trail-node').forEach(n => n.remove())
    marks = Array.from(article.querySelectorAll('h2[id]'))
      .filter(h => h.offsetParent !== null)
      .map(h => {
        const node = document.createElement('a')
        node.className = 'reading-trail-node'
        node.href = `#${encodeURIComponent(h.id)}`
        const text = headingText(h)
        node.setAttribute('aria-label', text)
        node.dataset.label = text
        node.addEventListener('click', event => {
          event.preventDefault()
          h.scrollIntoView({ behavior: 'smooth', block: 'start' })
          history.replaceState(null, '', node.getAttribute('href'))
        })
        trail.appendChild(node)
        return { heading: h, node }
      })
    update()
  }

  function update () {
    frame = 0
    const box = article.getBoundingClientRect()
    const top = box.top + window.scrollY
    const length = Math.max(1, article.offsetHeight)
    const reading = window.scrollY + window.innerHeight * 0.3
    const progress = Math.min(1, Math.max(0, (reading - top) / length))
    fill.style.transform = `scaleY(${progress.toFixed(4)})`
    marks.forEach(({ heading, node }) => {
      const at = Math.min(1, Math.max(0, (heading.getBoundingClientRect().top + window.scrollY - top) / length))
      node.style.top = `${(at * 100).toFixed(2)}%`
      node.classList.toggle('is-passed', progress >= at)
    })
  }

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  build()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  window.addEventListener('load', build)
  document.addEventListener('site-lang-change', build)
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(article)
})()

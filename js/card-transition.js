/* Opening a post from the home page: the card's cover and title morph into
   the post's header and title (cross-document View Transitions; browsers
   without them just navigate). Post pages name their header and title in
   custom.css; this script names the matching card on the home page, both
   when leaving it and when coming back. Loaded in <head>, not deferred, so
   `pagereveal` is caught before the first frame. */
(function () {
  'use strict'

  if (!('onpagereveal' in window)) return

  const pathOf = url => {
    try {
      return decodeURI(new URL(url, location.href).pathname)
    } catch (e) {
      return ''
    }
  }

  const cardFor = url => {
    const target = pathOf(url)
    return Array.from(document.querySelectorAll('#recent-posts .recent-post-item')).find(card => {
      const link = card.querySelector('.article-title')
      return link && pathOf(link.href) === target
    })
  }

  const nameCard = (card, on) => {
    const cover = card.querySelector('.post_cover')
    const title = card.querySelector('.article-title')
    if (cover) cover.style.viewTransitionName = on ? 'post-cover' : ''
    if (title) title.style.viewTransitionName = on ? 'post-title' : ''
  }

  let named = null
  const clear = () => {
    if (named) nameCard(named, false)
    named = null
  }

  // Leaving the home page for a post: name the card that was opened.
  window.addEventListener('pageswap', event => {
    if (!event.viewTransition || !event.activation) return
    const card = cardFor(event.activation.entry.url)
    if (!card) return
    named = card
    nameCard(card, true)
  })

  // Back on the home page from the back/forward cache: drop the old names.
  window.addEventListener('pageshow', event => {
    if (event.persisted) clear()
  })

  // Arriving on the home page from a post: name that post's card.
  window.addEventListener('pagereveal', event => {
    const from = window.navigation && navigation.activation && navigation.activation.from
    if (!event.viewTransition || !from) return
    const card = cardFor(from.url)
    if (!card) return
    named = card
    nameCard(card, true)
    event.viewTransition.finished.finally(clear)
  })
})()

/* Knowledge map on /explore/ (source/explore/index.md), data from
   /explore/graph.json (scripts/knowledge-map.js, configured in
   source/_data/knowledge_map.yml).

   A radial layout, the same every time for the same data:
   - each category is an arc of the ring, sized by how much it holds;
   - its notes (and any papers, projects or resources) sit just outside
     the arc, labelled outwards;
   - related items are joined by gold curves bundled towards the centre.
   Hovering, searching or choosing an item lights up its neighbourhood; the
   panel shows the overview, a category, or one item. The map draws both
   languages itself (the site translator skips .km). */
(function () {
  'use strict'

  const root = document.getElementById('km')
  if (!root) return

  const NS = 'http://www.w3.org/2000/svg'
  const svg = root.querySelector('.km-svg')
  const svgTitle = svg.querySelector('title')
  const stage = root.querySelector('.km-stage')
  const panel = root.querySelector('.km-panel')
  const legend = root.querySelector('.km-legend')
  const search = root.querySelector('.km-search input')

  const PALETTE = ['#F2C4D0', '#C9DFEE', '#CFEBD6', '#E2D7F4', '#F8DDA9', '#F5CFBC', '#D3E6E2', '#EBD3E8']
  const TYPES = {
    note: ['笔记', 'Note'],
    paper: ['论文', 'Paper'],
    project: ['项目', 'Project'],
    resource: ['资源', 'Resource']
  }

  const lang = () => (window.siteI18n && window.siteI18n.lang() === 'en' ? 'en' : 'zh')
  const say = (zh, en) => (lang() === 'en' ? en : zh)
  const text = value => (value && typeof value === 'object' ? value[lang()] || value.zh || '' : value || '')
  const typeName = type => say(...(TYPES[type] || [type, type]))

  let categories = []
  let items = []
  let links = []
  let byId = new Map()
  let selected = null
  let hovered = null
  let query = ''
  let drawnWidth = 0

  /* ---------- Data ---------- */
  fetch('/explore/graph.json')
    .then(response => response.json())
    .then(init)
    .catch(() => {
      panel.textContent = say('关系图暂时无法加载。', 'The map could not be loaded.')
    })

  function init (data) {
    categories = data.categories.map((c, i) => Object.assign({}, c, { color: c.color || PALETTE[i % PALETTE.length], members: [] }))
    byId = new Map(categories.map(c => [c.id, c]))

    items = data.nodes.map(n => Object.assign({}, n, { neighbours: new Set() }))
    items.forEach(item => {
      byId.set(item.id, item)
      let home = byId.get(item.category)
      if (!home) home = otherCategory()
      item.home = home
      home.members.push(item)
    })
    // Within a category: notes in the order they were written, other items after.
    categories.forEach(c => c.members.sort((a, b) => (a.type === 'note') === (b.type === 'note')
      ? String(a.date).localeCompare(String(b.date))
      : a.type === 'note' ? -1 : 1))

    links = data.links
      .map(l => ({ a: byId.get(l.source), b: byId.get(l.target), weight: l.weight || 1 }))
      .filter(l => l.a && l.b)
    links.forEach(l => { l.a.neighbours.add(l.b); l.b.neighbours.add(l.a) })

    bindControls()
    render()
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        if (Math.abs(stage.clientWidth - drawnWidth) > 4) render()
      }).observe(stage)
    }
    document.addEventListener('site-lang-change', () => render())
  }

  function otherCategory () {
    let other = byId.get('category:__other')
    if (!other) {
      other = { id: 'category:__other', type: 'category', name: { zh: '其他', en: 'Other' }, path: '', color: '#E5E1DA', count: 0, members: [] }
      categories.push(other)
      byId.set(other.id, other)
    }
    return other
  }

  /* ---------- Drawing ---------- */
  const el = (name, attrs, parent) => {
    const node = document.createElementNS(NS, name)
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value))
    if (parent) parent.appendChild(node)
    return node
  }

  const polar = (cx, cy, r, angle) => [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]

  function arcPath (cx, cy, r, a0, a1) {
    const [x0, y0] = polar(cx, cy, r, a0)
    const [x1, y1] = polar(cx, cy, r, a1)
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0
    const sweep = a1 > a0 ? 1 : 0
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(2)} ${y1.toFixed(2)}`
  }

  // Shorten a label with "…" until it fits.
  function fit (node, value, max) {
    node.textContent = value
    if (node.getComputedTextLength() <= max) return
    let cut = value.length
    while (cut > 1) {
      cut--
      node.textContent = `${value.slice(0, cut).trim()}…`
      if (node.getComputedTextLength() <= max) return
    }
  }

  // Share the circle between categories by size, with a floor so a small
  // category still has room for its name.
  function sectorAngles () {
    const gap = 0.04
    const room = Math.PI * 2 - gap * categories.length
    const floor = Math.min(0.7, room / categories.length)
    const weights = categories.map(c => Math.max(1, c.members.length) + 0.6)
    let angles = weights.map(w => room * w / weights.reduce((s, x) => s + x, 0))
    for (let pass = 0; pass < 4; pass++) {
      const small = angles.map(a => a < floor)
      const fixed = small.filter(Boolean).length * floor
      const free = weights.reduce((s, w, i) => (small[i] ? s : s + w), 0)
      angles = weights.map((w, i) => (small[i] ? floor : (room - fixed) * w / free))
    }
    return { gap, angles }
  }

  function render () {
    const width = stage.clientWidth
    if (!width) return
    drawnWidth = width
    const size = Math.min(width, 860)
    const compact = width < 600
    const cx = width / 2
    const cy = size / 2
    const R = size / 2 - 6

    svg.textContent = ''
    svg.appendChild(svgTitle)
    svgTitle.textContent = say('笔记关系图', 'Map of notes')
    svg.setAttribute('viewBox', `0 0 ${width} ${size}`)
    svg.style.height = `${size}px`
    svg.classList.toggle('is-compact', compact)

    const layers = {}
    ;['guides', 'links', 'bands', 'labels', 'nodes', 'centre'].forEach(name => { layers[name] = el('g', { class: `km-${name}` }, svg) })

    // Room for labels: as long as the longest one, within limits.
    const probe = el('text', { class: 'km-label' }, layers.labels)
    let longest = 0
    items.forEach(item => {
      probe.textContent = text(item.label)
      longest = Math.max(longest, probe.getComputedTextLength())
    })
    probe.remove()
    const labelRoom = compact ? 0 : Math.min(longest + 4, R * 0.42)
    const rDot = R - labelRoom - (compact ? 10 : 18)
    const bandOuter = rDot - 12
    const bandInner = bandOuter - 20
    const rLink = bandInner - 6

    el('circle', { class: 'km-guide', cx, cy, r: rLink }, layers.guides)
    el('circle', { class: 'km-guide is-dots', cx, cy, r: rDot }, layers.guides)

    // Category arcs and item positions.
    const { gap, angles } = sectorAngles()
    let angle = -Math.PI / 2 + gap / 2
    categories.forEach((c, i) => {
      const a0 = angle
      const a1 = angle + angles[i]
      angle = a1 + gap
      c.a0 = a0
      c.a1 = a1
      const step = (a1 - a0) / Math.max(1, c.members.length)
      c.members.forEach((item, j) => {
        item.angle = a0 + step * (j + 0.5)
        ;[item.x, item.y] = polar(cx, cy, rDot, item.angle)
        ;[item.lx, item.ly] = polar(cx, cy, rLink, item.angle)
      })

      const band = el('path', { class: 'km-band', d: arcPath(cx, cy, (bandInner + bandOuter) / 2, a0, a1), 'stroke-width': bandOuter - bandInner }, layers.bands)
      band.style.setProperty('--km-fill', c.color)
      c.band = band
      bindHover(band, c)
      band.addEventListener('click', () => choose(c))

      // Its name runs along the arc, turned to read left to right.
      const mid = (a0 + a1) / 2
      const flip = Math.sin(mid) > 0.05
      const guide = el('path', {
        id: `km-arc-${i}`,
        class: 'km-arc-guide',
        d: flip ? arcPath(cx, cy, (bandInner + bandOuter) / 2, a1, a0) : arcPath(cx, cy, (bandInner + bandOuter) / 2, a0, a1)
      }, layers.bands)
      const label = el('text', { class: 'km-band-label', dy: '.35em' }, layers.bands)
      const along = el('textPath', { href: `#km-arc-${i}`, startOffset: '50%', 'text-anchor': 'middle' }, label)
      const arcLength = guide.getTotalLength() - 12
      const full = `${text(c.name)} · ${c.members.length}`
      // Longest form that fits: name and count, the name, the name a size
      // smaller, then just the count.
      along.textContent = full
      if (label.getComputedTextLength() > arcLength) along.textContent = text(c.name)
      if (label.getComputedTextLength() > arcLength) label.classList.add('is-small')
      if (label.getComputedTextLength() > arcLength) {
        label.classList.remove('is-small')
        along.textContent = String(c.members.length)
      }
      c.label = label
    })

    // Links, bundled towards the centre.
    links.forEach(l => {
      const mx = (l.a.lx + l.b.lx) / 2
      const my = (l.a.ly + l.b.ly) / 2
      const qx = cx + (mx - cx) * 0.25
      const qy = cy + (my - cy) * 0.25
      l.path = el('path', {
        class: 'km-link',
        d: `M${l.a.lx.toFixed(1)} ${l.a.ly.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${l.b.lx.toFixed(1)} ${l.b.ly.toFixed(1)}`,
        'stroke-width': (1 + (l.weight - 1) * 0.6).toFixed(2)
      }, layers.links)
    })

    // Items and their labels.
    items.forEach(item => {
      const g = el('g', {
        class: `km-node is-${item.type}`,
        transform: `translate(${item.x.toFixed(1)} ${item.y.toFixed(1)})`,
        tabindex: '0',
        role: 'button',
        'aria-label': `${text(item.name)} · ${text(item.home.name)}`
      }, layers.nodes)
      g.style.setProperty('--km-fill', item.home.color)
      el('circle', { class: 'km-hit', r: 11 }, g)
      marker(item.type, g)
      item.g = g

      const deg = (item.angle * 180) / Math.PI
      const left = Math.cos(item.angle) < 0
      const [tx, ty] = polar(cx, cy, rDot + 11, item.angle)
      const label = el('text', {
        class: 'km-label',
        x: tx.toFixed(1),
        y: ty.toFixed(1),
        dy: '.35em',
        'text-anchor': left ? 'end' : 'start',
        transform: `rotate(${left ? deg + 180 : deg} ${tx.toFixed(1)} ${ty.toFixed(1)})`
      }, layers.labels)
      if (!compact) fit(label, text(item.label), labelRoom)
      item.label$ = label

      bindHover(g, item)
      bindHover(label, item)
      g.addEventListener('click', () => choose(item))
      label.addEventListener('click', () => choose(item))
      g.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          choose(item)
        }
      })
    })

    // Centre: how much the map holds.
    const notes = items.filter(i => i.type === 'note').length
    el('circle', { class: 'km-centre-dot', cx, cy, r: 3.5 }, layers.centre)
    el('text', { class: 'km-centre-number', x: cx, y: cy - 6, 'text-anchor': 'middle' }, layers.centre).textContent = notes
    el('text', { class: 'km-centre-caption', x: cx, y: cy + 14, 'text-anchor': 'middle' }, layers.centre).textContent = say('篇笔记', notes === 1 ? 'note' : 'notes')

    svg.onclick = event => {
      if (event.target === svg) choose(null)
    }

    renderLegend()
    search.placeholder = say('搜索笔记', 'Search notes')
    search.setAttribute('aria-label', search.placeholder)
    applyState()
    renderPanel()
  }

  // Marker shapes: notes are dots; other kinds of content get their own shape.
  function marker (type, g) {
    if (type === 'paper') return el('rect', { class: 'km-mark', x: -5, y: -5, width: 10, height: 10, rx: 2 }, g)
    if (type === 'project') return el('rect', { class: 'km-mark', x: -5, y: -5, width: 10, height: 10, rx: 1.5, transform: 'rotate(45)' }, g)
    if (type === 'resource') return el('path', { class: 'km-mark', d: 'M0 -6L5.5 4.5L-5.5 4.5Z' }, g)
    return el('circle', { class: 'km-mark', r: 5.5 }, g)
  }

  /* ---------- State ---------- */
  function bindHover (node, target) {
    node.addEventListener('pointerenter', () => { hovered = target; applyState() })
    node.addEventListener('pointerleave', () => { if (hovered === target) { hovered = null; applyState() } })
    node.addEventListener('focus', () => { hovered = target; applyState() })
    node.addEventListener('blur', () => { if (hovered === target) { hovered = null; applyState() } })
  }

  function matches (item) {
    if (!query) return false
    const hay = [item.name.zh, item.name.en, item.label.zh, item.label.en].join(' ').toLowerCase()
    return hay.includes(query)
  }

  // What is lit: the hovered or chosen item with its neighbours, a category
  // with its members, or the search results.
  function activeSet () {
    const focus = hovered || selected
    if (focus && focus.type === 'category') return { items: new Set(focus.members), cats: new Set([focus]) }
    if (focus) return { items: new Set([focus, ...focus.neighbours]), cats: new Set([focus.home]) }
    if (query) {
      const found = new Set(items.filter(matches))
      return { items: found, cats: new Set([...found].map(i => i.home)) }
    }
    return null
  }

  function applyState () {
    const active = activeSet()
    svg.classList.toggle('is-dim', !!active)
    items.forEach(item => {
      const on = !!active && active.items.has(item)
      item.g.classList.toggle('is-on', on)
      item.g.classList.toggle('is-current', item === hovered)
      item.g.classList.toggle('is-selected', item === selected)
      item.label$.classList.toggle('is-on', on)
      item.label$.classList.toggle('is-current', item === hovered || item === selected)
    })
    categories.forEach(c => {
      const on = !!active && active.cats.has(c)
      c.band.classList.toggle('is-on', on)
      c.label.classList.toggle('is-on', on)
      c.band.classList.toggle('is-selected', c === selected)
    })
    // An item lights its own links; a category or a search lights the links
    // within the lit group.
    const focus = hovered || selected
    links.forEach(l => {
      const on = focus && focus.type !== 'category'
        ? l.a === focus || l.b === focus
        : !!active && active.items.has(l.a) && active.items.has(l.b)
      l.path.classList.toggle('is-on', on)
    })
    legend.querySelectorAll('[data-id]').forEach(chip => {
      chip.classList.toggle('is-selected', !!selected && selected.id === chip.dataset.id)
    })
  }

  // First choice selects; choosing a selected note again opens it.
  function choose (target) {
    if (target && target === selected && target.type !== 'category' && target.path) {
      open(target)
      return
    }
    selected = target
    // The panel is about to be redrawn, so a hover that started on one of
    // its buttons would never see its pointerleave.
    hovered = null
    applyState()
    renderPanel()
  }

  function open (item) {
    if (item.external) window.open(item.path, '_blank', 'noopener')
    else window.location.href = item.path
  }

  function bindControls () {
    search.addEventListener('input', () => {
      query = search.value.trim().toLowerCase()
      if (query) selected = null
      applyState()
      renderPanel()
    })
    search.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const first = items.find(matches)
        if (first) choose(first)
      }
    })
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        search.value = ''
        query = ''
        choose(null)
      }
    })
  }

  /* ---------- Legend ---------- */
  function renderLegend () {
    legend.textContent = ''
    categories.forEach(c => {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'km-chip'
      chip.dataset.id = c.id
      chip.style.setProperty('--km-fill', c.color)
      chip.innerHTML = '<span class="km-swatch"></span><span class="km-chip-name"></span><span class="km-chip-count"></span>'
      chip.querySelector('.km-chip-name').textContent = text(c.name)
      chip.querySelector('.km-chip-count').textContent = c.members.length
      chip.addEventListener('click', () => choose(selected === c ? null : c))
      bindHover(chip, c)
      legend.appendChild(chip)
    })
    const kinds = [...new Set(items.map(i => i.type))]
    if (kinds.length > 1) {
      kinds.forEach(kind => {
        const key = document.createElement('span')
        key.className = `km-kind is-${kind}`
        key.textContent = typeName(kind)
        legend.appendChild(key)
      })
    }
  }

  /* ---------- Panel ---------- */
  function renderPanel () {
    panel.textContent = ''
    const add = (tag, className, content, parent) => {
      const node = document.createElement(tag)
      if (className) node.className = className
      if (content != null) node.textContent = content
      ;(parent || panel).appendChild(node)
      return node
    }
    const itemButton = (item, parent) => {
      const li = add('li', null, null, parent)
      const button = add('button', 'km-item', null, li)
      button.type = 'button'
      button.style.setProperty('--km-fill', item.home.color)
      add('span', 'km-swatch', null, button)
      add('span', null, text(item.name), button)
      button.addEventListener('click', () => choose(item))
      bindHover(button, item)
    }
    const back = () => {
      const button = add('button', 'km-back', say('← 总览', '← Overview'))
      button.type = 'button'
      button.addEventListener('click', () => choose(null))
    }

    if (!selected && query) {
      const found = items.filter(matches)
      add('p', 'km-kicker', say('搜索结果', 'Search results'))
      add('p', 'km-lead', found.length ? say(`找到 ${found.length} 项`, `${found.length} found`) : say('没有找到匹配的笔记。', 'Nothing matches.'))
      const list = add('ul', 'km-items')
      found.forEach(item => itemButton(item, list))
      return
    }

    if (!selected) {
      const notes = items.filter(i => i.type === 'note').length
      add('p', 'km-kicker', say('知识星图', 'Knowledge map'))
      const stats = add('div', 'km-stats')
      ;[[notes, say('篇笔记', 'notes')], [categories.length, say('个分类', 'categories')], [links.length, say('条主题关联', 'topic links')]].forEach(([n, label]) => {
        const cell = add('div', 'km-stat', null, stats)
        add('strong', null, n, cell)
        add('span', null, label, cell)
      })
      const list = add('ul', 'km-items is-categories')
      categories.forEach(c => {
        const li = add('li', null, null, list)
        const button = add('button', 'km-item', null, li)
        button.type = 'button'
        button.style.setProperty('--km-fill', c.color)
        add('span', 'km-swatch', null, button)
        add('span', null, text(c.name), button)
        add('em', null, c.members.length, button)
        button.addEventListener('click', () => choose(c))
        bindHover(button, c)
      })
      add('p', 'km-hint', say('悬停查看关联，点一下查看简介，再点一下进入文章。按 Esc 回到总览。', 'Hover to see links, tap for a summary, tap again to open. Esc returns here.'))
      return
    }

    back()

    if (selected.type === 'category') {
      add('p', 'km-kicker', say('分类', 'Category'))
      add('h3', 'km-title', text(selected.name))
      add('p', 'km-meta', say(`${selected.members.length} 项`, `${selected.members.length} items`))
      const list = add('ul', 'km-items')
      selected.members.forEach(item => itemButton(item, list))
      if (selected.path) {
        const link = add('a', 'km-action is-quiet', say('打开分类页 →', 'Open the category →'))
        link.href = selected.path
      }
      return
    }

    if (selected.cover) {
      const img = add('img', 'km-cover')
      img.src = selected.cover
      img.alt = ''
      img.loading = 'lazy'
    }
    const kicker = add('p', 'km-kicker', null)
    const swatch = add('span', 'km-swatch', null, kicker)
    swatch.style.setProperty('--km-fill', selected.home.color)
    add('span', null, text(selected.home.name), kicker)
    if (selected.type !== 'note') add('span', 'km-type', typeName(selected.type), kicker)
    add('h3', 'km-title', text(selected.name))
    if (selected.date) add('p', 'km-meta', selected.date)
    if (text(selected.description)) add('p', 'km-desc', text(selected.description))
    if (selected.neighbours.size) {
      add('p', 'km-subhead', say('相关', 'Related'))
      const list = add('ul', 'km-items')
      selected.neighbours.forEach(item => itemButton(item, list))
    }
    if (selected.path) {
      const action = add('a', 'km-action', selected.external ? say('打开链接 ↗', 'Open link ↗') : say('阅读全文 →', 'Read the note →'))
      action.href = selected.path
      if (selected.external) {
        action.target = '_blank'
        action.rel = 'noopener'
      }
    }
  }
})()

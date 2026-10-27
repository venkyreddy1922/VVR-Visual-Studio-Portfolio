import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

// ===================== EDIT HERE =====================
const CONTACT = { email: '', whatsapp: '', instagram: '', linkedin: '', behance: '', x: '' }
// Contact-form notifications use EmailJS. The keys come from .env (see README); this address receives every enquiry.
const NOTIFY_EMAIL = 'vangavenkateshwarreddy19@gmail.com'
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const EMAIL_READY = !!(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey)
const SOCIAL = [ // fallbacks are DEMO links; set the real ones in CONTACT
  ['Instagram', CONTACT.instagram || 'https://www.instagram.com/'],
  ['WhatsApp', CONTACT.whatsapp || 'https://wa.me/'],
  ['X', CONTACT.x || 'https://x.com/'],
]
// {cat:'motion'|'poster'|'illustration'|'invitation', sub:'Wedding Invitations', title, desc, image, video}
const PROJECTS = []
const STACK = [
  ['After Effects', 'Creating motion graphics, animated visuals and smooth transitions.', '#9999FF'],
  ['Premiere Pro', 'Editing videos, arranging sequences and refining visual storytelling.', '#9999FF'],
  ['Instagram', 'Sharing creative projects, poster designs and short-form content.', '#E1306C'],
  ['Claude', 'Helping organise ideas, develop concepts and support creative workflows.', '#D97757'],
  ['ChatGPT', 'Supporting brainstorming, content development and creative problem-solving.', '#10A37F'],
  ['Figma', 'Designing layouts, visual compositions and digital interfaces.', '#A259FF'],
  ['WhatsApp', 'Communicating, discussing project requirements and sharing updates.', '#25D366'],
  ['Teta', 'An editable platform entry. Description to be confirmed.', '#64748b'],
  ['CapCut', 'Editing short videos, building transitions and preparing social content.', '#14121F'],
  ['LottieLab', 'Creating lightweight motion graphics and interactive animations.', '#00C1A2'],
  ['Photoshop', 'Working with images, compositions, retouching and poster artwork.', '#31A8FF'],
  ['Illustrator', 'Creating vector graphics, illustrations and visual elements.', '#FF9A00'],
].map(([n, d, c]) => ({ n, d, c, logo: '' })) // logo: URL of an official logo file
const SERVICES = [
  ['Motion Designing', 'I create motion graphics, animated visuals and transitions that bring ideas to life. My focus is on smooth movement, thoughtful timing and engaging visual storytelling.', 'sph', 'linear-gradient(135deg,#b794ff,#8B5CF6)'],
  ['Illustrations', 'I create illustrations and visual artwork using colour, composition and creative details to communicate ideas in a distinctive way.', 'star', 'linear-gradient(#2DD4BF,#0d9488)'],
  ['Poster Creation', 'I design posters for products, brands and creative concepts, focusing on strong compositions, typography and eye-catching visual details.', 'pyr', 'linear-gradient(#FF7A3D,#ff4d6d)'],
  ['Digital Invitations', 'I design digital invitations for weddings, birthdays, housewarming celebrations, engagements, receptions, baby showers and special events.', 'cyl', 'linear-gradient(#F472B6,#db2777)'],
  ['Reels Editing', 'I edit short-form videos with smooth transitions, creative pacing, clean visuals and engaging storytelling for digital platforms.', 'sph', 'linear-gradient(#BEF264,#84cc16)'],
]
const CATS = [['motion', 'Motion Designing'], ['poster', 'Poster Designs'], ['illustration', 'Illustrations'], ['invitation', 'Digital Invitations']]
const SUBS = ['Wedding Invitations', 'Birthday Invitations', 'Housewarming', 'Engagement & Reception', 'Baby Showers', 'Events & Celebrations']
const ROLES = ['Motion Designer & Editor', 'Poster Creator', 'Illustrator', 'Digital Invitation Designer', 'Creative Video Editor']
// ===================== END EDIT =====================

const HERO_SHAPES = [
  ['pyr', '--s:clamp(70px,10vw,140px);--g:linear-gradient(var(--or),#ff4d6d);left:8%;top:22%;--k:1.2;--r:-10deg'],
  ['sph', '--s:clamp(60px,9vw,120px);--g:linear-gradient(135deg,#b794ff,var(--pu));right:10%;top:20%;--k:-1.4;--t:8s'],
  ['sph', '--s:clamp(30px,4vw,56px);--g:linear-gradient(135deg,#c4a8ff,var(--pu));left:20%;bottom:24%;--k:2;--t:6s'],
  ['cyl', '--s:clamp(46px,6vw,84px);--g:linear-gradient(var(--bl),#1d4ed8);right:6%;bottom:30%;--k:-1;--r:20deg'],
  ['star', '--s:clamp(50px,7vw,100px);--g:linear-gradient(var(--tq),#0d9488);left:5%;bottom:34%;--k:1.6;--r:30deg'],
  ['sph', '--s:clamp(40px,5vw,70px);--g:linear-gradient(var(--li),#84cc16);right:24%;bottom:20%;--k:-2;--t:9s'],
  ['cb', '--s:clamp(40px,5.4vw,76px);--g:var(--ye);left:30%;top:16%;--k:1.3'],
  ['cb', '--s:clamp(36px,4.6vw,64px);--g:var(--pu);right:30%;top:14%;--k:-1.1'],
  ['pyr', '--s:clamp(50px,7vw,100px);--g:linear-gradient(var(--bl),#6366f1);right:4%;top:48%;--k:1;--r:-14deg'],
]
const ADOBE = { 'After Effects': ['Ae', '#00005B', '#9999FF'], 'Premiere Pro': ['Pr', '#00005B', '#9999FF'], Photoshop: ['Ps', '#001E36', '#31A8FF'], Illustrator: ['Ai', '#330000', '#FF9A00'] }
// Drawn recreations (Instagram, WhatsApp, X, Figma). Set STACK[].logo to use official files instead.
const LOGO = {
  Instagram: <svg viewBox="0 0 24 24" role="img" aria-label="Instagram"><rect width="24" height="24" rx="6" fill="url(#igr)" /><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="16.4" cy="7.6" r="1.1" fill="#fff" /></svg>,
  WhatsApp: <svg viewBox="0 0 24 24" role="img" aria-label="WhatsApp"><rect width="24" height="24" rx="6" fill="#25D366" /><path d="M12 4.6a7.4 7.4 0 0 0-6.3 11.2L4.8 19.4l3.7-.9A7.4 7.4 0 1 0 12 4.6z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9.4 8.8c0 3 2.9 5.9 5.9 5.9l1-1.3-1.7-.9-.8.7c-.9-.3-1.9-1.4-2.2-2.2l.7-.8-.9-1.7-1 .3z" fill="#fff" /></svg>,
  X: <svg viewBox="0 0 24 24" role="img" aria-label="X"><rect width="24" height="24" rx="6" fill="#000" /><path transform="translate(4.8 4.8) scale(.6)" fill="#fff" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>,
  Figma: <svg viewBox="0 0 38 57" role="img" aria-label="Figma" style={{ padding: '11px 15px', background: '#fff', border: '1px solid #e4e0f2', borderRadius: 18 }}><path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" /><path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19V0z" /><path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" /><path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" /><path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" /></svg>,
}

const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const sty = s => Object.fromEntries(s.split(';').filter(Boolean).map(p => { const i = p.indexOf(':'); return [p.slice(0, i), p.slice(i + 1)] }))

// Adds the "in" state the first time an element scrolls into view
function useSeen(t = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const n = ref.current
    if (!n) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: t })
    io.observe(n)
    return () => io.disconnect()
  }, [t])
  return [ref, seen]
}
function Rv({ as: T = 'div', className = '', children, ...p }) {
  const [ref, seen] = useSeen()
  return <T ref={ref} className={`${className} rv${seen ? ' in' : ''}`} {...p}>{children}</T>
}

function Shape({ cls, css }) {
  return (
    <div className={'o ' + cls} style={sty(css)} aria-hidden="true">
      {cls === 'pyr' && <u><b><i /><i /><i /><i /></b></u>}
      {cls === 'star' && <u><b>{[...Array(7)].map((_, j) => <i key={j} style={{ transform: `translateZ(${(j - 3) * 4}px)`, filter: `brightness(${0.62 + j * 0.07})` }} />)}</b></u>}
      {cls === 'cb' && <b>{[...Array(6)].map((_, j) => <i key={j} />)}</b>}
    </div>
  )
}

const SECTIONS = ['home', 'about', 'stack', 'services', 'projects', 'contact']
function Nav() {
  const [act, setAct] = useState(0)
  useEffect(() => {
    const f = () => {
      const m = scrollY + innerHeight * 0.35
      let c = 0
      SECTIONS.forEach((id, i) => { const el = document.getElementById(id); if (el && el.offsetTop <= m) c = i })
      setAct(c)
    }
    f()
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return (
    <nav id="nav" aria-label="Main">
      {SECTIONS.map((id, i) => <a key={id} href={'#' + id} className={i === act ? 'act' : ''}>{id.toUpperCase()}</a>)}
    </nav>
  )
}

function Roles() {
  const [cur, setCur] = useState(0)
  const [prev, setPrev] = useState(-1)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setCur(c => { setPrev(c); return (c + 1) % ROLES.length }), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="r" aria-live="off">
      {ROLES.map((t, i) => <span key={t} className={i === cur ? 'on' : i === prev ? 'out' : 'rst'}>{t}</span>)}
    </div>
  )
}

function Hero() {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setReady(true)) }, [])
  const move = e => {
    if (reduce || !matchMedia('(pointer:fine)').matches) return
    const s = ref.current.style
    s.setProperty('--px', (e.clientX / innerWidth - 0.5) * 36 + 'px')
    s.setProperty('--py', (e.clientY / innerHeight - 0.5) * 24 + 'px')
  }
  return (
    <section ref={ref} className={'hero' + (ready ? ' ready' : '')} id="home" onPointerMove={move}>
      <h1 className="big" aria-label="Vanga Venkateshwar Reddy">
        <span><b style={{ '--d': '.1s' }}>VANGA</b></span>
        <span><b style={{ '--d': '.22s' }}>VENKATESHWAR</b></span>
        <span><b style={{ '--d': '.34s' }}>REDDY</b></span>
      </h1>
      {HERO_SHAPES.map(([c, css], i) => <Shape key={i} cls={c} css={css} />)}
      <div className="mid">
        <Rv as="span" className="pill">DESIGN • MOTION • VISUAL STORIES</Rv>
        <div className="port"><img src="/hero2.jpg" alt="Portrait of Vanga Venkateshwar Reddy with headphones, framed by a glowing violet and blue ring" width="720" height="720" /></div>
        <Rv as="p" className="hi" style={{ '--d': '.5s' }}>Hi, I’m Venky!</Rv>
        <Roles />
        <Rv as="a" className="btn" style={{ '--d': '.6s' }} href="#contact">Let’s work together! ↗</Rv>
      </div>
      <div className="mq" aria-hidden="true"><div>{Array(4).fill('✦ SCROLL DOWN ✦ AND KNOW ME BETTER\u00a0\u00a0\u00a0').join('')}</div></div>
    </section>
  )
}

function About() {
  const [ref, seen] = useSeen()
  const tilt = e => {
    const el = e.currentTarget, r = el.getBoundingClientRect()
    el.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 14 + 'deg')
    el.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 14 + 'deg')
  }
  const untilt = e => { e.currentTarget.style.removeProperty('--ry'); e.currentTarget.style.removeProperty('--rx') }
  const paras = [
    'I’m Vanga Venkateshwar Reddy, a motion designer and editor who enjoys bringing creative ideas to life through visuals and motion.',
    'I work on poster designs, illustrations, digital invitations, motion graphics and creative video edits.',
    'I enjoy experimenting with different styles, smooth transitions, visual storytelling and creative compositions.',
    'For me, good design is about more than appearance. It’s about presenting an idea in a way that feels engaging, clear and memorable.',
  ]
  return (
    <section className="about" id="about"><div className="wrap">
      <Rv as="h2">About Me</Rv>
      <div className="ab">
        <div>{paras.map(p => <Rv as="p" key={p}>{p}</Rv>)}</div>
        <figure ref={ref} className={'ph rv' + (seen ? ' in' : '')} style={{ '--d': '.15s' }} onPointerMove={reduce ? undefined : tilt} onPointerLeave={untilt}>
          <img src="/hero1.jpg" alt="Vanga Venkateshwar Reddy standing in front of green mountains under a blue sky" width="900" height="1200" loading="lazy" />
        </figure>
      </div>
    </div></section>
  )
}

function Card({ s, i }) {
  const [flip, setFlip] = useState(false)
  const [ref, seen] = useSeen()
  const ad = ADOBE[s.n]
  let kid = s.n.slice(0, 2), st = { '--c': s.c }, cls = 'lg'
  if (s.logo) kid = <img src={s.logo} alt="" />
  else if (LOGO[s.n]) { kid = LOGO[s.n]; cls += ' mk' }
  else if (ad) { kid = ad[0]; st = { ...st, background: ad[1], color: ad[2], border: '2px solid ' + ad[2] } }
  return (
    <button ref={ref} type="button" className={'fc rv' + (seen ? ' in' : '')} style={{ '--i': i }} aria-pressed={flip} aria-label={`${s.n}. Flip card to read more.`} onClick={() => setFlip(f => !f)}>
      <div className="fi">
        <div className="ff"><div className={cls} style={st}>{kid}</div><h3>{s.n}</h3><small>Tap to flip</small></div>
        <div className="fb"><h3>{s.n}</h3><p>{s.d}</p></div>
      </div>
    </button>
  )
}

function Service({ t, d, sh, g, i }) {
  const [ref, seen] = useSeen()
  const [num, setNum] = useState('0' + (i + 1))
  useEffect(() => {
    if (!seen || reduce) return
    let n = 0
    const iv = setInterval(() => {
      if (++n > 9) { clearInterval(iv); setNum('0' + (i + 1)) } else setNum('0' + (1 + Math.floor(Math.random() * 9)))
    }, 55)
    return () => clearInterval(iv)
  }, [seen, i])
  return (
    <div ref={ref} className={'sv rv' + (seen ? ' in' : '')}>
      <b aria-label={`Service ${i + 1}`}>{num}</b>
      <div><h3>{t}</h3><p>{d}</p></div>
      <Shape cls={sh} css={`--s:84px;--g:${g};animation-duration:${6 + i}s`} />
    </div>
  )
}

const SOON = [['#FF7A3D', '#ff4d6d'], ['#8B5CF6', '#6366f1'], ['#3B82F6', '#1d4ed8'], ['#2DD4BF', '#0d9488'], ['#84cc16', '#4d7c0f'], ['#F472B6', '#db2777'], ['#f59e0b', '#d97706'], ['#6366f1', '#4338ca']]
const pad = n => String(n).padStart(2, '0')

// Swipeable snap carousel: native touch swipe, mouse drag, arrows, keyboard and dots
function Carousel({ label }) {
  const sc = useRef(null)
  const raf = useRef(0)
  const drag = useRef(null)
  const [act, setAct] = useState(0)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const nearest = () => {
    const el = sc.current, mid = el.scrollLeft + el.clientWidth / 2
    let best = 0, bd = Infinity
    ;[...el.children].forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i } })
    return best
  }
  const go = i => sc.current.children[Math.max(0, Math.min(SOON.length - 1, i))].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(() => { raf.current = 0; setAct(nearest()) }) }
  const down = e => {
    if (e.pointerType !== 'mouse') return
    drag.current = { x: e.clientX, s: sc.current.scrollLeft }
    sc.current.classList.add('drag')
    sc.current.setPointerCapture(e.pointerId)
  }
  const move = e => { if (drag.current) sc.current.scrollLeft = drag.current.s - (e.clientX - drag.current.x) }
  const up = () => { if (!drag.current) return; drag.current = null; sc.current.classList.remove('drag'); go(nearest()) }
  const key = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(act + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(act - 1) }
  }
  return (
    <Rv className="cw">
      <div className="cwh">
        <h3>Coming soon · {label}</h3>
        <div><button type="button" aria-label="Previous card" onClick={() => go(act - 1)}>←</button><button type="button" aria-label="Next card" onClick={() => go(act + 1)}>→</button></div>
      </div>
      <div ref={sc} className="cz" tabIndex={0} role="region" aria-roledescription="carousel" aria-label={`${label} cards`}
        onScroll={onScroll} onKeyDown={key} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {SOON.map(([a, b], i) => (
          <article key={i} className={'cd' + (i === act ? ' on' : '')} style={{ '--g': `linear-gradient(145deg,${a},${b})` }} aria-label={`${label} ${i + 1} of ${SOON.length}, coming soon`}>
            <div className="cdt"><span className="bdg"><i />Coming soon</span><span className="cdn">{pad(i + 1)}/{pad(SOON.length)}</span></div>
            <div className="orb" aria-hidden="true" />
            <div><h4>{label} · {pad(i + 1)}</h4><p className="soon">Coming soon<i>.</i><i>.</i><i>.</i></p></div>
          </article>
        ))}
      </div>
      <div className="dots" role="group" aria-label="Choose card">
        {SOON.map((_, i) => <button key={i} type="button" className={i === act ? 'on' : ''} aria-label={`Go to card ${i + 1}`} aria-current={i === act} onClick={() => go(i)} />)}
      </div>
    </Rv>
  )
}

function Projects() {
  const [cat, setCat] = useState('motion')
  const [sub, setSub] = useState('')
  const [shown, setShown] = useState(6)
  const [active, setActive] = useState(null)
  const dlg = useRef(null)
  useEffect(() => { if (active && dlg.current && !dlg.current.open) dlg.current.showModal() }, [active])
  const list = PROJECTS.filter(p => p.cat === cat && (!sub || p.sub === sub))
  const label = sub || CATS.find(c => c[0] === cat)[1]
  return (
    <section id="projects"><div className="wrap">
      <Rv as="h2">Projects</Rv>
      <div className="tabs" role="group" aria-label="Project categories">
        {CATS.map(([k, n]) => <button key={k} type="button" aria-pressed={cat === k} onClick={() => { setCat(k); setSub(''); setShown(6) }}>{n}</button>)}
      </div>
      <div className="tabs sub" role="group" aria-label="Invitation types" hidden={cat !== 'invitation'}>
        {SUBS.map(n => <button key={n} type="button" aria-pressed={sub === n} onClick={() => { setSub(sub === n ? '' : n); setShown(6) }}>{n}</button>)}
      </div>
      <div className="pg">
        {!list.length && <div className="empty">No projects published here yet. Add work to the PROJECTS list and it will appear automatically.</div>}
        {list.slice(0, shown).map((p, i) => (
          <button key={i} type="button" className="pc" onClick={() => setActive(p)}>
            <div className="im">
              {p.image ? <img src={p.image} alt={p.title || ''} loading="lazy" /> : p.video ? <video src={p.video} muted playsInline preload="metadata" /> : null}
            </div>
            <div className="tx"><b>{p.title || 'Untitled'}</b>{p.sub && <><br /><small>{p.sub}</small></>}</div>
          </button>
        ))}
      </div>
      {list.length > shown && <button className="btn" type="button" onClick={() => setShown(shown + 6)}>View more</button>}
      <Carousel key={label} label={label} />
      <dialog ref={dlg} aria-label="Project viewer" onClose={() => setActive(null)} onClick={e => e.target === dlg.current && dlg.current.close()}>
        <div className="db">
          <div>
            {active?.video ? <video src={active.video} controls playsInline poster={active.image} /> : active?.image && <img src={active.image} alt={active.title || ''} />}
          </div>
          <div><h3>{active?.title || 'Untitled'}</h3>{active?.desc && <p>{active.desc}</p>}</div>
          <button className="btn" type="button" style={{ justifySelf: 'start' }} onClick={() => dlg.current.close()}>Close</button>
        </div>
      </dialog>
    </div></section>
  )
}

const RULES = {
  name: v => v.trim().length > 1,
  email: v => /^\S+@\S+\.\S+$/.test(v),
  phone: v => /^\+?[\d\s()-]{7,}$/.test(v),
  work: v => !!v,
}
const MSG = { name: 'Enter your name.', email: 'Enter a valid email address.', phone: 'Enter a valid contact number.', work: 'Choose the work you need.' }
const FIELDS = [['name', 'Name', 'text', 'name'], ['email', 'Email id', 'email', 'email'], ['phone', 'Contact number', 'tel', 'tel']]

function Contact() {
  const links = [['Email', CONTACT.email && 'mailto:' + CONTACT.email], ['WhatsApp', CONTACT.whatsapp], ['Instagram', CONTACT.instagram], ['LinkedIn', CONTACT.linkedin], ['Behance', CONTACT.behance]].filter(x => x[1])
  const [err, setErr] = useState({})
  const [bad, setBad] = useState({})
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const submit = async e => {
    e.preventDefault()
    const form = e.currentTarget
    const v = Object.fromEntries(new FormData(form))
    const errs = {}
    Object.keys(RULES).forEach(k => { if (!RULES[k](v[k] || '')) errs[k] = MSG[k] })
    setErr(errs); setBad({})
    requestAnimationFrame(() => setBad(errs)) // re-trigger the shake each time
    if (Object.keys(errs).length) { setNote('Please fix the highlighted fields.'); return }
    if (!EMAIL_READY) { setNote('Email notifications are not configured yet (add your EmailJS keys to .env), so nothing was sent.'); return }
    setBusy(true); setNote('Sending…')
    try {
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        to_email: NOTIFY_EMAIL, from_name: v.name, from_email: v.email, reply_to: v.email,
        phone: v.phone, work: v.work, sent_at: new Date().toLocaleString(),
      }, { publicKey: EMAILJS.publicKey })
      form.reset(); setDone(true); setNote('Message sent. Thank you!')
    } catch (err) {
      console.error('EmailJS error:', err)
      setNote('The message could not be sent: ' + (err?.text || err?.message || 'unknown error') + '. Check the browser console for details.')
    }
    setBusy(false)
  }
  return (
    <section id="contact"><div className="wrap">
      <Rv as="h2">Contact Me</Rv>
      <div className="ct">{links.map(([n, u]) => <a key={n} href={u} {...(n !== 'Email' && { target: '_blank', rel: 'noopener noreferrer' })}>{n} ↗</a>)}</div>
      {!links.length && <p style={{ color: 'var(--mute)' }}>Contact details coming soon.</p>}
      <form className={'cf' + (done ? ' done' : '')} onSubmit={submit} noValidate aria-label="Contact form">
        {FIELDS.map(([k, label, type, ac], i) => (
          <Rv key={k} className={'fl' + (bad[k] ? ' bad' : '')} style={{ '--d': i * 0.08 + 's' }}>
            <input id={'f-' + k} name={k} type={type} placeholder=" " autoComplete={ac} aria-invalid={!!err[k]} />
            <label htmlFor={'f-' + k}>{label}</label><i className="ul" /><span className="er" role="alert">{err[k]}</span>
          </Rv>
        ))}
        <Rv className={'fl' + (bad.work ? ' bad' : '')} style={{ '--d': '.24s' }}>
          <select id="f-work" name="work" defaultValue="" aria-invalid={!!err.work}>
            <option value="" hidden></option>
            <option>Motion Designing</option><option>Poster Designs</option><option>Illustrations</option>
            <optgroup label="Digital Invitations">{SUBS.map(s => <option key={s}>{s}</option>)}</optgroup>
            <option>Reels Editing</option><option>Other</option>
          </select>
          <label htmlFor="f-work">Preferred work</label><i className="ul" /><span className="er" role="alert">{err.work}</span>
        </Rv>
        <Rv className="full" style={{ '--d': '.32s' }}>
          <button className={'btn' + (busy ? ' ld' : '')} type="submit" disabled={busy}><span>Send message</span><b>→</b></button>
          <span className="ck" aria-hidden="true">✓</span>
        </Rv>
        <p className="full" id="cn" role="status">{note}</p>
      </form>
    </div></section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="ft">
        <div>
          <div className="nm">VVR Visual Studio</div>
          <h3 style={{ marginTop: '1.6rem' }}>Social</h3>
          <Rv className="sr">
            {SOCIAL.map(([n, u]) => <a key={n} className="sl" href={u} target="_blank" rel="noopener noreferrer" aria-label={n}>{LOGO[n]}</a>)}
          </Rv>
        </div>
        <div>
          <h3>Contact Me</h3>
          {CONTACT.email ? <a href={'mailto:' + CONTACT.email}>Email</a> : 'Details coming soon'}
        </div>
      </div>
      <Rv className="cr">
        <span className="lq">© {new Date().getFullYear()} VVR Visual Studio</span>
        <span className="lq">Made by Vanga Venkateshwar Reddy</span>
      </Rv>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="igr" cx=".3" cy="1.05" r="1.1">
            <stop offset="0" stopColor="#FEDA75" /><stop offset=".25" stopColor="#FA7E1E" /><stop offset=".5" stopColor="#D62976" /><stop offset=".75" stopColor="#962FBF" /><stop offset="1" stopColor="#4F5BD5" />
          </radialGradient>
        </defs>
      </svg>
      <Nav />
      <main>
        <Hero />
        <About />
        <section id="stack"><div className="wrap">
          <Rv as="h2">My Stack</Rv>
          <span className="tag">Logo slots empty — add official logo files in STACK</span>
          <div className="grid">{STACK.map((s, i) => <Card key={s.n} s={s} i={i} />)}</div>
        </div></section>
        <section id="services"><div className="wrap">
          <Rv as="h2">Services</Rv>
          {SERVICES.map(([t, d, sh, g], i) => <Service key={t} t={t} d={d} sh={sh} g={g} i={i} />)}
        </div></section>
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

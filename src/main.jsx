import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Coffee, Instagram, Leaf, MapPin, Menu as MenuIcon, Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from 'lucide-react'
import './styles.css'

const dishes = [
  { id: 1, name: 'Капучино', category: 'Кофе', price: 220, weight: '250 мл', tag: 'ХИТ', desc: 'Двойной эспрессо, бархатное молоко', image: 'https://images.unsplash.com/photo-1572448115917-0c9c6c4c9a2f?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Флэт уайт', category: 'Кофе', price: 250, weight: '200 мл', tag: '', desc: 'Насыщенный кофе и тонкая молочная текстура', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Матча-латте', category: 'Не кофе', price: 290, weight: '300 мл', tag: 'NEW', desc: 'Японская матча на выбор: классика или овсяное', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Круассан', category: 'Выпечка', price: 190, weight: '90 г', tag: '', desc: 'Слоёный, хрустящий, из печи каждое утро', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Сырники', category: 'Завтраки', price: 360, weight: '220 г', tag: 'ЛЮБИМЫЕ', desc: 'Нежные сырники, сметана и ягодный соус', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Банановый хлеб', category: 'Выпечка', price: 240, weight: '140 г', tag: '', desc: 'Влажный кекс с бананом и грецким орехом', image: 'https://images.unsplash.com/photo-1606101273944-845c9ad7ef6f?auto=format&fit=crop&w=900&q=85' },
  { id: 7, name: 'Айс-латте', category: 'Не кофе', price: 270, weight: '350 мл', tag: '', desc: 'Эспрессо, холодное молоко и лёд', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85' },
  { id: 8, name: 'Тост с авокадо', category: 'Завтраки', price: 420, weight: '240 г', tag: 'VEGGIE', desc: 'Заквасочный хлеб, авокадо и зелень', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85' },
  { id: 9, name: 'Раф ванильный', category: 'Кофе', price: 290, weight: '300 мл', tag: '', desc: 'Кофе, сливки и натуральная ваниль', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85' },
  { id: 10, name: 'Чизкейк', category: 'Выпечка', price: 320, weight: '150 г', tag: '', desc: 'Сливочный чизкейк с песочной основой', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85' },
  { id: 11, name: 'Фильтр дня', category: 'Кофе', price: 180, weight: '250 мл', tag: 'SPECIALTY', desc: 'Спешелти зерно с яркими фруктовыми нотами', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85' },
  { id: 12, name: 'Боул с гранолой', category: 'Завтраки', price: 340, weight: '280 г', tag: '', desc: 'Йогурт, домашняя гранола и сезонные ягоды', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=85' },
]
const CartContext = createContext(null)
const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
function useCart() { return useContext(CartContext) }

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mokka-cart') || '{}') } catch { return {} }
  })
  useEffect(() => localStorage.setItem('mokka-cart', JSON.stringify(cart)), [cart])
  const add = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const change = (id, delta) => setCart(c => {
    const next = { ...c, [id]: (c[id] || 0) + delta }
    if (next[id] <= 0) delete next[id]
    return next
  })
  const remove = id => setCart(c => { const n = { ...c }; delete n[id]; return n })
  const clear = () => setCart({})
  const items = Object.entries(cart).map(([id, qty]) => ({ ...dishes.find(d => d.id === Number(id)), qty })).filter(i => i.id)
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  return <CartContext.Provider value={{ cart, items, count, total, add, change, remove, clear }}>{children}</CartContext.Provider>
}

function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  return <header className="header">
    <div className="container nav-wrap">
      <Link to="/" className="brand" aria-label="MOKKA — на главную"><span className="brand-mark"><Coffee size={21}/></span><span>MOKKA<small>COFFEE · BAKERY</small></span></Link>
      <button className="mobile-toggle icon-btn" onClick={() => setOpen(!open)} aria-label="Открыть меню">{open ? <X/> : <MenuIcon/>}</button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/menu">Меню</NavLink>
        <NavLink to="/about">О нас</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
      </nav>
      <Link to="/cart" className="cart-link"><ShoppingBag size={17}/> <span>Заказ</span>{count > 0 && <b>{count}</b>}</Link>
    </div>
  </header>
}

function Footer() {
  return <footer className="footer"><div className="container footer-top">
    <div><Link to="/" className="brand footer-brand"><span className="brand-mark"><Coffee size={21}/></span><span>MOKKA<small>COFFEE · BAKERY</small></span></Link><p className="footer-note">Немного медленнее. Намного вкуснее.</p></div>
    <div className="footer-nav"><span className="eyebrow">НАВИГАЦИЯ</span><Link to="/menu">Меню</Link><Link to="/about">О кофейне</Link><Link to="/contacts">Контакты</Link></div>
    <div className="footer-nav"><span className="eyebrow">ЗАГЛЯДЫВАЙ</span><span>Пн–Вс · 08:00–21:00</span><span>Смоленск, центр города</span><a href="https://www.openstreetmap.org/search?query=Smolensk" target="_blank" rel="noreferrer">Найти на карте <ArrowUpRight size={14}/></a></div>
  </div><div className="container footer-bottom"><span>© 2026 MOKKA COFFEE</span><span>Учебный проект для портфолио · не реальное заведение</span><a href="https://github.com/" target="_blank" rel="noreferrer"><span>GitHub</span> <ArrowUpRight size={14}/></a></div></footer>
}
function Layout({ children }) { return <><Header/><main>{children}</main><Footer/></> }

function SectionTitle({ kicker, title, desc, link, to='/menu' }) {
  return <div className="section-title"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2>{desc && <p>{desc}</p>}</div>{link && <Link className="text-link" to={to}>{link}<ArrowRight size={17}/></Link>}</div>
}
function ProductCard({ item }) {
  const { add, cart } = useCart()
  return <article className="product-card">
    <Link to="/menu" className="product-image"><img src={item.image} alt={item.name} loading="lazy"/>{item.tag && <span className="product-tag">{item.tag}</span>}<span className="image-arrow"><ArrowUpRight size={17}/></span></Link>
    <div className="product-info"><div className="product-name-row"><h3>{item.name}</h3><span>{item.weight}</span></div><p>{item.desc}</p><div className="product-bottom"><strong>{money(item.price)}</strong><button className={cart[item.id] ? 'add-btn added' : 'add-btn'} onClick={() => add(item.id)} aria-label={`Добавить ${item.name}`}>{cart[item.id] ? <><Check size={16}/> {cart[item.id]}</> : <Plus size={18}/>}</button></div></div>
  </article>
}
function Home() {
  const featured = [dishes[0], dishes[3], dishes[2], dishes[7]]
  return <Layout>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow"><span className="live-dot"/> ТВОЯ МАЛЕНЬКАЯ ПАУЗА В БОЛЬШОМ ГОРОДЕ</span><h1>Хороший день<br/>начинается <em>с кофе.</em></h1><p>Обжариваем настроение, печём с любовью и наливаем ещё немного уюта. Заходи на чашечку — останься на весь день.</p>
        <div className="hero-actions"><Link to="/menu" className="btn btn-dark">Выбрать в меню <ArrowRight size={17}/></Link><Link to="/about" className="btn btn-quiet">Наша история <ArrowUpRight size={17}/></Link></div>
        <div className="hero-social-proof"><div className="avatar-stack"><span>М</span><span>А</span><span>К</span></div><div><strong>Маленькие радости каждый день</strong><small>Кофе · завтраки · своя выпечка</small></div></div>
      </div>
      <div className="hero-visual"><img className="hero-photo" src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1400&q=90" alt="Уютная кофейня с деревянной мебелью"/><div className="photo-sticker"><Sparkles size={17}/><span>made with<br/><b>good vibes</b></span></div><div className="hero-caption"><span>01 / EVERYDAY RITUALS</span><span>СМОЛЕНСК, РОССИЯ</span></div><div className="hero-note"><span className="note-icon"><Coffee size={20}/></span><span><b>Кофе с характером</b><small>Зёрна specialty-класса</small></span><ArrowUpRight size={18}/></div></div>
    </div><a className="scroll-cue" href="#popular"><ArrowDown size={15}/> ЛИСТАЙ НИЖЕ</a></section>
    <section className="ticker" aria-label="Наши ценности"><div className="ticker-track">{Array.from({length:2}).map((_,i)=><span key={i}>GOOD COFFEE <i>✳</i> SLOW MORNINGS <i>✳</i> FRESH BAKERY <i>✳</i> LOCAL LOVE <i>✳</i></span>)}</div></section>
    <section className="section container" id="popular"><SectionTitle kicker="МАЛЕНЬКИЕ ФАВОРИТЫ" title={<>То, за чем<br className="desktop-break"/> хочется вернуться.</>} desc="Собрали любимчиков гостей. Вкусно, честно и без лишнего." link="Всё меню" />
      <div className="product-grid">{featured.map(d=><ProductCard item={d} key={d.id}/>)}</div>
    </section>
    <section className="story-band"><div className="container story-grid"><div className="story-image"><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1100&q=85" alt="Бариста готовит кофе" loading="lazy"/><span className="image-index">M / 001</span></div><div className="story-copy"><span className="eyebrow">НЕ ПРОСТО КОФЕЙНЯ</span><h2>Место, где<br/>можно <em>выдохнуть.</em></h2><p>Мы верим, что хорошие вещи не требуют спешки. Зерно отбираем внимательно, выпечку готовим каждое утро, а гостей встречаем как старых друзей.</p><Link to="/about" className="btn btn-outline">Больше о нас <ArrowUpRight size={17}/></Link><div className="story-stats"><div><strong>08:00</strong><span>уже открыты</span></div><div><strong>100%</strong><span>с душой</span></div><div><strong>∞</strong><span>поводов зайти</span></div></div></div></div></section>
    <section className="visit-strip container"><div className="visit-icon"><MapPin size={22}/></div><div><span className="eyebrow">БУДЕМ РАДЫ ТЕБЯ ВИДЕТЬ</span><h2>Твоя новая любимая точка — в Смоленске.</h2><p>Загляни по пути или запланируй медленное утро.</p></div><Link to="/contacts" className="btn btn-dark">Как нас найти <ArrowRight size={17}/></Link></section>
  </Layout>
}

function MenuPage() {
  const [category, setCategory] = useState('Всё меню')
  const [search, setSearch] = useState('')
  const cats = ['Всё меню', 'Кофе', 'Не кофе', 'Выпечка', 'Завтраки']
  const filtered = dishes.filter(d => (category === 'Всё меню' || d.category === category) && (d.name + d.desc).toLowerCase().includes(search.toLowerCase()))
  return <Layout><section className="page-hero container"><span className="eyebrow">СВЕЖЕЕ КАЖДЫЙ ДЕНЬ / 01</span><h1>Меню с хорошим<br/><em>послевкусием.</em></h1><p>Выбирай настроение. Мы приготовим.</p></section>
    <section className="container menu-section"><div className="menu-toolbar"><div className="category-tabs">{cats.map(c=><button key={c} className={category===c?'category-tab active':'category-tab'} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="search-box"><span className="sr-only">Поиск по меню</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Найти что-то вкусное…"/><span>⌕</span></label></div>
      <div className="menu-result-line"><span>{filtered.length} позиций</span><span>Цены указаны в рублях · приготовим после заказа</span></div>
      {filtered.length ? <div className="product-grid menu-grid">{filtered.map(d=><ProductCard item={d} key={d.id}/>)}</div> : <div className="empty-state"><Coffee size={28}/><h3>Такого пока нет в меню</h3><p>Попробуй другой запрос или категорию.</p><button className="btn btn-dark" onClick={()=>{setSearch('');setCategory('Всё меню')}}>Сбросить фильтры</button></div>}
    </section><section className="menu-bottom container"><Leaf size={19}/><p>Есть аллергии или особые пожелания? Напиши нам при оформлении заказа — постараемся помочь.</p><Link to="/contacts">Связаться <ArrowRight size={15}/></Link></section></Layout>
}

function AboutPage() {
  return <Layout><section className="page-hero container"><span className="eyebrow">НАША ИСТОРИЯ / 02</span><h1>Меньше суеты.<br/><em>Больше вкуса.</em></h1><p>MOKKA — вымышленная кофейня с настоящей любовью к деталям.</p></section>
    <section className="container about-feature"><div className="about-photo"><img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1300&q=85" alt="Интерьер современной кофейни"/></div><div className="about-text"><span className="eyebrow">НАЧИНАЕМ С ПРОСТОГО</span><h2>Хороший кофе<br/>собирает людей.</h2><p>Мы придумали MOKKA как место, в котором можно ненадолго отключиться от бесконечных дел. Здесь пахнет свежей выпечкой, бариста помнят любимый напиток, а у каждого столика есть своя история.</p><p>В основе — качественное зерно, сезонные продукты и понятное меню. Никакой магии: только внимание к тому, что делаем каждый день.</p><Link to="/menu" className="btn btn-dark">Посмотреть меню <ArrowRight size={17}/></Link></div></section>
    <section className="values-section"><div className="container"><SectionTitle kicker="НАШИ ПРАВИЛА" title="Просто. Честно. С душой."/><div className="values-grid"><article><span>01</span><Coffee/><h3>Кофе с характером</h3><p>Отбираем зерно по вкусу, а не по громким словам на упаковке.</p></article><article><span>02</span><Sparkles/><h3>Свежесть — каждый день</h3><p>Выпечка и завтраки готовятся небольшими партиями.</p></article><article><span>03</span><Leaf/><h3>Гостям — по-человечески</h3><p>Без лишнего официоза. С улыбкой, вниманием и заботой.</p></article></div></div></section>
    <section className="container about-cta"><span className="eyebrow">ТЕПЕРЬ ТВОЯ ОЧЕРЕДЬ</span><h2>Кофе сам себя<br/><em>не выпьет.</em></h2><Link to="/menu" className="btn btn-dark">Выбрать напиток <ArrowRight size={17}/></Link></section>
  </Layout>
}

function ContactsPage() {
  return <Layout><section className="page-hero container"><span className="eyebrow">МЫ РЯДОМ / 03</span><h1>Заглядывай.<br/><em>Мы заварим.</em></h1><p>Сохрани точку на карте и загляни за любимым напитком.</p></section>
    <section className="container contact-layout"><div className="contact-details"><div className="contact-card"><span className="contact-icon"><MapPin/></span><span className="eyebrow">АДРЕС</span><h3>Смоленск, центр города</h3><p>Демонстрационный адрес — укажи реальный перед публикацией.</p><a className="text-link" href="https://www.openstreetmap.org/search?query=кафе%20Смоленск" target="_blank" rel="noreferrer">Открыть карту <ArrowUpRight size={16}/></a></div><div className="contact-card"><span className="contact-icon"><Clock3/></span><span className="eyebrow">КОГДА МЫ ЗДЕСЬ</span><h3>Каждый день</h3><p>Пн–Вс · 08:00–21:00</p><small>Время условное, для демонстрации.</small></div><div className="contact-card"><span className="contact-icon"><Coffee/></span><span className="eyebrow">НА СВЯЗИ</span><h3>+7 (4812) 00-00-00</h3><p>Демо-номер — замени перед запуском.</p><a className="text-link" href="https://t.me/" target="_blank" rel="noreferrer">Написать нам <ArrowUpRight size={16}/></a></div></div><div className="map-frame"><iframe title="Карта Смоленска OpenStreetMap" src="https://www.openstreetmap.org/export/embed.html?bbox=32.025%2C54.765%2C32.075%2C54.805&layer=mapnik&marker=54.7826%2C32.0453" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe><div className="map-label"><MapPin size={17}/><span><b>MOKKA COFFEE</b><small>Смоленск · центральная часть города</small></span></div><a className="map-open" href="https://www.openstreetmap.org/?mlat=54.7826&mlon=32.0453#map=15/54.7826/32.0453" target="_blank" rel="noreferrer">Развернуть карту <ArrowUpRight size={15}/></a></div></section>
    <section className="container contact-bottom"><div><span className="eyebrow">ЗАХОТЕЛОСЬ ЧЕГО-ТО ВКУСНОГО?</span><h2>Закажи заранее —<br/>забери без ожидания.</h2></div><Link to="/menu" className="btn btn-dark">Перейти к меню <ArrowRight size={17}/></Link></section>
  </Layout>
}

function CartPage() {
  const { items, total, change, remove, clear } = useCart()
  const navigate = useNavigate()
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', method: 'Самовывоз', time: 'Как можно скорее', comment: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => {
    e.preventDefault()
    if (!items.length) return setError('Добавь хотя бы одну позицию в заказ.')
    if (form.name.trim().length < 2) return setError('Укажи имя (не менее двух символов).')
    if (form.phone.replace(/\D/g, '').length < 10) return setError('Проверь номер телефона.')
    setError('')
    setSent(true)
    clear()
  }
  if (sent) return <Layout><section className="success-page container"><div className="success-icon"><Check size={35}/></div><span className="eyebrow">ЗАКАЗ СОБРАН / DEMO</span><h1>Спасибо,<br/><em>{form.name}!</em></h1><p>Форма отработала корректно — это демонстрация для портфолио. Заказ не отправлен в реальную кофейню.</p><div className="success-details"><span>Способ получения</span><b>{form.method}</b><span>Контакт</span><b>{form.phone}</b></div><Link to="/menu" className="btn btn-dark">Вернуться в меню <ArrowRight size={17}/></Link></section></Layout>
  return <Layout><section className="page-hero container cart-hero"><span className="eyebrow">ТВОЙ ВЫБОР / 04</span><h1>Корзина <em>вкусного.</em></h1><p>Проверь заказ — и можно оформлять.</p></section>
    <section className="container cart-layout"><div className="cart-items-panel">{items.length ? <><div className="cart-panel-head"><h2>В заказе <span>{items.reduce((s,i)=>s+i.qty,0)}</span></h2><button className="clear-btn" onClick={clear}><Trash2 size={14}/> Очистить</button></div>{items.map(item=><article className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-info"><h3>{item.name}</h3><span>{item.weight}</span><strong>{money(item.price * item.qty)}</strong></div><div className="qty-control"><button onClick={()=>change(item.id,-1)} aria-label="Уменьшить"><Minus size={14}/></button><span>{item.qty}</span><button onClick={()=>change(item.id,1)} aria-label="Увеличить"><Plus size={14}/></button></div><button className="remove-btn" onClick={()=>remove(item.id)} aria-label={`Удалить ${item.name}`}><X size={17}/></button></article>)}</> : <div className="cart-empty"><span className="empty-bag"><ShoppingBag size={25}/></span><h2>Пока здесь пусто.</h2><p>Самое время найти что-нибудь вкусное.</p><Link to="/menu" className="btn btn-dark">Открыть меню <ArrowRight size={16}/></Link></div>}</div>
      <aside className="checkout-panel"><span className="eyebrow">ОФОРМЛЕНИЕ</span><h2>Почти готово.</h2><div className="checkout-line"><span>Позиции</span><span>{items.reduce((s,i)=>s+i.qty,0)} шт.</span></div><div className="checkout-line"><span>Получение</span><span>Самовывоз</span></div><div className="checkout-total"><span>Итого</span><strong>{money(total)}</strong></div><p className="checkout-hint">Доставка не предусмотрена в демо-версии. Самовывоз — бесплатно.</p><button className="btn btn-dark full-btn" disabled={!items.length} onClick={()=>setCheckout(!checkout)}>{checkout ? 'Скрыть форму' : 'Оформить заказ'} <ArrowRight size={17}/></button>
        {checkout && <form className="checkout-form" onSubmit={submit} noValidate><label>Как к тебе обращаться?<input name="name" value={form.name} onChange={set} placeholder="Твоё имя"/></label><label>Телефон для связи<input name="phone" value={form.phone} onChange={set} placeholder="+7 900 000-00-00" inputMode="tel"/></label><label>Как заберёшь?<select name="method" value={form.method} onChange={set}><option>Самовывоз</option><option>За столиком</option></select></label><label>Когда удобно?<select name="time" value={form.time} onChange={set}><option>Как можно скорее</option><option>Через 15 минут</option><option>Через 30 минут</option><option>Через час</option></select></label><label>Комментарий<textarea name="comment" value={form.comment} onChange={set} placeholder="Например, без сиропа" rows="2"/></label>{error && <p className="form-error">{error}</p>}<button className="btn btn-accent full-btn" type="submit">Подтвердить демо-заказ <Check size={16}/></button><small className="privacy-note">Демо-форма: данные никуда не отправляются.</small></form>}
      </aside></section><div className="container cart-back"><button className="text-link" onClick={()=>navigate('/menu')}><ArrowLeft size={16}/> Вернуться к меню</button></div></Layout>
}

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [pathname]); return null }
function App() {
  return <CartProvider><HashRouter><ScrollToTop/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<MenuPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/contacts" element={<ContactsPage/>}/><Route path="/cart" element={<CartPage/>}/><Route path="*" element={<Layout><section className="success-page container"><h1>Страница не найдена.</h1><Link to="/" className="btn btn-dark">На главную</Link></section></Layout>}/></Routes></HashRouter></CartProvider>
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)

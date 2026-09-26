import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <section className="page-stack">
      <div className="page-hero">
        <p className="eyebrow">本月</p>
        <h1>存入一笔记忆</h1>
        <p>已经走到这里了，别忘了给这个月留一句话。</p>
        <Link className="primary-button" to="/entry/new">开始记录</Link>
      </div>
      <div className="metric-grid">
        <article><span>本月已存入</span><strong>0 笔</strong></article>
        <article><span>连续存储</span><strong>0 个月</strong></article>
        <article><span>累计记忆</span><strong>0 笔</strong></article>
      </div>
    </section>
  )
}

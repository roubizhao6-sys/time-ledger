import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function WelcomePage() {
  return (
    <main className="welcome-page">
      <div className="welcome-orb" />
      <section className="welcome-card">
        <span className="brand-pill">
          <Sparkles size={16} /> 时光存折
        </span>
        <h1>每月存一点，年底得到一本只属于你的回忆册。</h1>
        <p>
          不要求每天写日记。每月一张照片、一句话，系统自动整理成时间轴和年度回忆册。
        </p>
        <Link className="primary-button" to="/onboarding">
          开始记录 <ArrowRight size={18} />
        </Link>
        <small>
          <LockKeyhole size={14} /> 本地优先保存，不上传你的照片和文字
        </small>
      </section>
    </main>
  )
}

import { useState, type FormEvent } from 'react'
import { Heart, Home, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { VaultType } from '../domain/types'
import { useVault } from '../state/useVault'

const types: Array<{ value: VaultType; label: string; detail: string; icon: typeof UserRound }> = [
  { value: 'personal', label: '个人存折', detail: '给自己的月度记录', icon: UserRound },
  { value: 'couple', label: '情侣存折', detail: '一起积累的共同记忆', icon: Heart },
  { value: 'family', label: '家庭存折', detail: '一家人的年度回忆', icon: Home },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { createVault } = useVault()
  const [name, setName] = useState('我的时光存折')
  const [type, setType] = useState<VaultType>('personal')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    await createVault(name, type)
    navigate('/dashboard')
  }

  return (
    <main className="onboarding-page">
      <form className="onboarding-card" onSubmit={handleSubmit}>
        <div className="onboarding-progress">
          <span className="active">1 命名</span>
          <span className="active">2 类型</span>
          <span className="active">3 开始</span>
        </div>

        <p className="eyebrow">创建存折</p>
        <h1>你想把什么存进时间里？</h1>

        <label className="field-label" htmlFor="vault-name">存折名称</label>
        <input
          id="vault-name"
          className="text-input"
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
        />

        <fieldset className="type-fieldset">
          <legend>存折类型</legend>
          <div className="type-grid">
            {types.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.value}
                  type="button"
                  className={type === item.value ? 'type-card active' : 'type-card'}
                  onClick={() => setType(item.value)}
                >
                  <Icon size={24} />
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="onboarding-note">
          <strong>第一笔可以写什么？</strong>
          <p>今天最想记住的一件小事。没有标准答案，也不需要写得好看。</p>
        </div>

        <button className="primary-button full-width" type="submit" disabled={submitting}>
          {submitting ? '正在创建……' : '创建存折'}
        </button>
      </form>
    </main>
  )
}

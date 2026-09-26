import { BellRing, Download, LockKeyhole, Trash2, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { downloadReminderIcs } from '../reminders/buildReminderIcs'
import { useVault } from '../state/useVault'

const themeLabels = {
  paper: '纸页',
  forest: '森林',
  sunset: '落日',
  night: '夜航',
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { state, clearAll, updateEntry } = useVault()
  const planLabel = state?.settings.plan === 'free' ? '免费版' : '已激活'
  void updateEntry

  async function handleClear() {
    if (!window.confirm('确定删除当前设备上的全部数据吗？请先导出备份。')) return
    await clearAll()
    navigate('/welcome')
  }

  return (
    <section className="page-stack">
      <div className="simple-page">
        <p className="eyebrow">我的</p>
        <h1>{state?.vault.name ?? '我的时光存折'}</h1>
        <p>当前版本：{planLabel} · 主题：{state ? themeLabels[state.vault.theme] : '纸页'}</p>
      </div>

      <div className="settings-grid">
        <Link className="settings-card" to="/pricing">
          <LockKeyhole size={22} />
          <strong>订阅与激活</strong>
          <span>¥9.9/月、¥79/年、¥19.9/月共享版</span>
        </Link>
        <Link className="settings-card" to="/shared">
          <UsersRound size={22} />
          <strong>共享空间</strong>
          <span>给伴侣或家人的共同记忆</span>
        </Link>
        <Link className="settings-card" to="/backup">
          <Download size={22} />
          <strong>加密备份</strong>
          <span>换设备或分享给家人</span>
        </Link>
        <button
          className="settings-card"
          type="button"
          onClick={() => state && downloadReminderIcs(state.vault.name, new Date())}
        >
          <BellRing size={22} />
          <strong>下载提醒日历</strong>
          <span>未来12个月，每月提醒一次</span>
        </button>
        <Link className="settings-card" to="/privacy">
          <LockKeyhole size={22} />
          <strong>隐私说明</strong>
          <span>数据默认只在本机</span>
        </Link>
        <Link className="settings-card" to="/help">
          <strong>帮助中心</strong>
          <span>备份、恢复、激活和退款问题</span>
        </Link>
      </div>

      <div className="danger-zone">
        <div>
          <strong>删除全部本地数据</strong>
          <p>该操作不可撤销。删除前请先下载加密备份。</p>
        </div>
        <button className="danger-button" type="button" onClick={() => void handleClear()}>
          <Trash2 size={18} /> 删除全部
        </button>
      </div>
    </section>
  )
}

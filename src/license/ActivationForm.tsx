import { CheckCircle2, Copy } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { LICENSE_PUBLIC_KEY } from '../config/licensePublicKey'
import { useVault } from '../state/useVault'
import { verifyLicense } from './verify'

export function ActivationForm() {
  const { state, setPlan } = useVault()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!state) return

    try {
      const payload = await verifyLicense(code, state.settings.deviceId, LICENSE_PUBLIC_KEY)
      await setPlan(payload.plan, payload.expiresAt)
      setSuccess(true)
      setMessage(`激活成功，有效期至 ${payload.expiresAt}`)
    } catch (error) {
      setSuccess(false)
      setMessage(error instanceof Error ? error.message : '激活失败')
    }
  }

  async function copyDeviceId() {
    if (!state) return
    try {
      await navigator.clipboard.writeText(state.settings.deviceId)
      setMessage('设备ID已复制，请发给卖家并完成付款。')
    } catch {
      setMessage(`设备ID：${state.settings.deviceId}`)
    }
  }

  return (
    <form className="activation-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">离线激活</p>
        <h2>付款后输入激活码</h2>
        <p>先把设备ID发给卖家，收到激活码后在这里激活。私钥不进入网站。</p>
      </div>

      <div className="device-row">
        <code>{state?.settings.deviceId ?? '请先创建存折'}</code>
        <button type="button" onClick={() => void copyDeviceId()}>
          <Copy size={16} /> 复制设备ID
        </button>
      </div>

      <label htmlFor="activation-code">激活码</label>
      <textarea
        id="activation-code"
        className="text-input textarea-short"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="粘贴卖家发给你的激活码"
      />

      <button className="primary-button" type="submit">激活存折</button>
      {message && (
        <p className={success ? 'activation-message success' : 'activation-message'}>
          {success && <CheckCircle2 size={16} />} {message}
        </p>
      )}
    </form>
  )
}

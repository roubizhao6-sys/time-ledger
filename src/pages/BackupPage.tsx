import { Download, Upload } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createBackupFile, readBackupFile } from '../backup/backup'
import { useVault } from '../state/useVault'

export function BackupPage() {
  const { state, importState } = useVault()
  const [exportPassword, setExportPassword] = useState('')
  const [importPassword, setImportPassword] = useState('')
  const [importFile, setImportFile] = useState<File>()
  const [status, setStatus] = useState('')

  async function handleExport(event: FormEvent) {
    event.preventDefault()
    if (!state || exportPassword.length < 6) {
      setStatus('备份密码至少需要6位。')
      return
    }

    const blob = await createBackupFile(state, exportPassword)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `时光存折-${new Date().toISOString().slice(0, 10)}.tlbackup`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setStatus('加密备份已下载，请把文件和密码分开保存。')
  }

  async function handleImport(event: FormEvent) {
    event.preventDefault()
    if (!importFile || importPassword.length < 6) {
      setStatus('请选择备份文件并输入至少6位密码。')
      return
    }
    if (!window.confirm('导入会替换当前设备上的存折数据，确定继续吗？')) return

    try {
      const restored = await readBackupFile(importFile, importPassword)
      await importState(restored)
      setStatus('恢复成功。')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '恢复失败')
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    setImportFile(event.target.files?.[0])
  }

  return (
    <section className="page-stack">
      <div className="simple-page">
        <p className="eyebrow">本地优先</p>
        <h1>加密备份与恢复</h1>
        <p>数据默认只保存在当前浏览器。换设备或分享给伴侣时，使用加密备份文件。</p>
      </div>

      <div className="backup-grid">
        <form className="section-card" onSubmit={handleExport}>
          <Download size={24} />
          <h2>导出加密备份</h2>
          <label htmlFor="export-password">备份密码</label>
          <input
            id="export-password"
            className="text-input"
            type="password"
            value={exportPassword}
            onChange={(event) => setExportPassword(event.target.value)}
            placeholder="至少6位"
          />
          <button className="primary-button" type="submit">下载备份文件</button>
        </form>

        <form className="section-card" onSubmit={handleImport}>
          <Upload size={24} />
          <h2>恢复备份</h2>
          <label htmlFor="import-file">备份文件</label>
          <input id="import-file" type="file" accept=".tlbackup,.json,application/json" onChange={handleFile} />
          <label htmlFor="import-password">备份密码</label>
          <input
            id="import-password"
            className="text-input"
            type="password"
            value={importPassword}
            onChange={(event) => setImportPassword(event.target.value)}
            placeholder="至少6位"
          />
          <button className="secondary-button" type="submit">恢复并替换当前数据</button>
        </form>
      </div>
      {status && <p className="backup-status">{status}</p>}
    </section>
  )
}

export function PrivacyPage() {
  return (
    <article className="policy-page">
      <p className="eyebrow">隐私说明</p>
      <h1>你的记忆默认只保存在本机。</h1>
      <section>
        <h2>我们不会默认上传什么</h2>
        <p>时光存折MVP不上传照片、文字、日期和标签到服务器。数据保存在浏览器IndexedDB中。</p>
      </section>
      <section>
        <h2>备份如何工作</h2>
        <p>加密备份使用AES-GCM和PBKDF2。密码由你设置，网站不保存密码，也无法替你找回。</p>
      </section>
      <section>
        <h2>什么时候需要云服务</h2>
        <p>如果你想在多个设备自动同步，需要未来的云服务版本。当前版本通过加密文件手动迁移和共享。</p>
      </section>
      <section>
        <h2>删除数据</h2>
        <p>你可以在“我的”页面删除全部本地数据。删除前请导出备份，否则无法恢复。</p>
      </section>
    </article>
  )
}

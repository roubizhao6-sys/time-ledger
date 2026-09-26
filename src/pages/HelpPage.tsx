export function HelpPage() {
  return (
    <article className="policy-page">
      <p className="eyebrow">帮助中心</p>
      <h1>常见问题</h1>
      <details open><summary>数据会上传吗？</summary><p>不会。当前版本是本地优先，照片和文字保存在你的浏览器里。</p></details>
      <details><summary>换手机怎么办？</summary><p>在旧设备导出加密备份，在新设备导入备份并输入同一密码。</p></details>
      <details><summary>忘记备份密码怎么办？</summary><p>无法找回。网站不保存密码，也不保留你的解密密钥。</p></details>
      <details><summary>为什么还是免费版？</summary><p>付款后把设备ID发给卖家，收到激活码后在“订阅与激活”页面输入。</p></details>
      <details><summary>可以退款吗？</summary><p>未开始服务且无法交付时退款。激活码已经发出并使用的，不因主观改变主意自动退款。</p></details>
    </article>
  )
}

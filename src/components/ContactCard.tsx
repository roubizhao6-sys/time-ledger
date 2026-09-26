export function ContactCard() {
  return (
    <section className="contact-card">
      <div>
        <p className="eyebrow">微信激活</p>
        <h2>先扫码添加，再发送设备ID</h2>
        <p>付款和激活码通过微信人工确认。网站不会公开个人收款码。</p>
      </div>
      <img src={`${import.meta.env.BASE_URL}wechat-contact-qr.svg`} alt="时光存折微信加好友二维码" />
    </section>
  )
}

import { ActivationForm } from '../license/ActivationForm'

const plans = [
  {
    name: '免费版',
    price: '¥0',
    note: '免费版最多3条记忆',
    features: ['基础时间轴', '本地保存', '1个主题'],
  },
  {
    name: '月度版',
    price: '¥9.9',
    note: '按月订阅，随时取消',
    features: ['不限记忆数量', '月度小报', '提醒日历', '加密备份'],
  },
  {
    name: '年度版',
    price: '¥79',
    note: '平均每月不到7元',
    features: ['不限记忆数量', '年度回忆册', '全部主题', '优先支持'],
    highlight: true,
  },
  {
    name: '双人/家庭版',
    price: '¥19.9',
    note: '适合两个人或一家人',
    features: ['最多4人共享', '共同时间轴', '加密文件交换', '年度家庭册'],
  },
]

export function PricingPage() {
  return (
    <section className="page-stack">
      <div className="simple-page">
        <p className="eyebrow">价格</p>
        <h1>不用研究成本，一眼知道能得到什么。</h1>
        <p>透明价格，随时取消。没有虚假原价，没有假装倒计时。</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article key={plan.name} className={plan.highlight ? 'pricing-card highlight' : 'pricing-card'}>
            <p className="eyebrow">{plan.name}</p>
            <strong className="plan-price">{plan.price}</strong>
            <p>{plan.note}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <ActivationForm />
    </section>
  )
}

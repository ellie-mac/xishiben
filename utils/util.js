// 生成6位邀请码
function genInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// 格式化日期 YYYY-MM-DD
function formatDate(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 计算距今天数（正数=未来，负数=已过）
function daysFrom(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

// 格式化金额
function formatMoney(num) {
  if (num === undefined || num === null || num === '') return '0'
  return Number(num).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

// 格式化倒计时文案
function formatCountdown(days) {
  if (days === null) return '未设置日期'
  if (days === 0) return '就是今天！'
  if (days > 0) return `还有 ${days} 天`
  return `已过 ${Math.abs(days)} 天`
}

// 深拷贝
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 显示 toast
function toast(title, icon = 'none', duration = 1500) {
  wx.showToast({ title, icon, duration })
}

// 显示 loading
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

function hideLoading() {
  wx.hideLoading()
}

// confirm 弹窗
function confirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      confirmColor: '#C9956C',
      success: res => res.confirm ? resolve() : reject()
    })
  })
}

module.exports = {
  genInviteCode,
  formatDate,
  daysFrom,
  formatMoney,
  formatCountdown,
  deepClone,
  toast,
  showLoading,
  hideLoading,
  confirm
}

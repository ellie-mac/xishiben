const { query, add, update, remove } = require('../../../utils/db')
const { toast, confirm, formatMoney, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    items: [],
    showModal: false,
    editingId: null,
    form: {
      name: '', quantity: '', unitPrice: '', notes: '', purchased: false
    }
  },

  onLoad() { this.loadItems() },
  onShow() { this.loadItems() },

  async loadItems() {
    const items = await query('candy_items')
    items.sort((a, b) => (a.purchased ? 1 : 0) - (b.purchased ? 1 : 0))
    const calcTotal = arr => arr.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0)
    const totalBudget = calcTotal(items)
    const spentTotal = calcTotal(items.filter(i => i.purchased))
    const remainingTotal = calcTotal(items.filter(i => !i.purchased))
    const purchasedCount = items.filter(i => i.purchased).length
    const purchasedPct = items.length ? Math.round(purchasedCount / items.length * 100) : 0
    this.setData({ items, totalBudget, spentTotal, remainingTotal, purchasedCount, purchasedPct })
  },

  getTotals() {
    const items = this.data.items
    let totalBudget = 0, totalSpent = 0
    for (const item of items) {
      const total = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
      totalBudget += total
      if (item.purchased) totalSpent += total
    }
    return { totalBudget, totalSpent, remaining: totalBudget - totalSpent }
  },

  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { name: '', quantity: '', unitPrice: '', notes: '', purchased: false }
    })
  },

  editItem(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showModal: true,
      editingId: item._id,
      form: {
        name: item.name || '',
        quantity: item.quantity ? String(item.quantity) : '',
        unitPrice: item.unitPrice ? String(item.unitPrice) : '',
        notes: item.notes || '',
        purchased: item.purchased || false
      }
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  async saveItem() {
    const { form, editingId } = this.data
    if (!form.name.trim()) { toast('请输入名称'); return }
    showLoading('保存中...')
    try {
      const data = {
        name: form.name.trim(),
        quantity: Number(form.quantity) || 0,
        unitPrice: Number(form.unitPrice) || 0,
        notes: form.notes.trim(),
        purchased: form.purchased
      }
      if (editingId) {
        await update('candy_items', editingId, data)
      } else {
        await add('candy_items', data)
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadItems()
      toast('已保存', 'success')
    } catch {
      hideLoading()
      toast('保存失败')
    }
  },

  async togglePurchased(e) {
    const { id, purchased } = e.currentTarget.dataset
    await update('candy_items', id, { purchased: !purchased })
    this.loadItems()
  },

  async deleteItem(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此项？')
      await remove('candy_items', id)
      this.loadItems()
      toast('已删除')
    } catch {}
  },

  formatMoney(v) { return formatMoney(v) }
})

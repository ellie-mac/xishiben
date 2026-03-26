const { query, add, update, remove, get } = require('../../../utils/db')
const { toast, confirm, formatMoney, formatDate, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    categoryId: '',
    categoryName: '',
    categoryBudgeted: 0,
    items: [],
    estimatedTotal: 0,
    actualTotal: 0,
    unpaidTotal: 0,
    showModal: false,
    editingId: null,
    form: {
      name: '', estimated: '', actual: '', paid: false, date: '', notes: ''
    }
  },

  onLoad(options) {
    const { categoryId, categoryName } = options
    this.setData({ categoryId, categoryName })
    wx.setNavigationBarTitle({ title: categoryName || '预算明细' })
    this.loadCategory()
    this.loadItems()
  },

  async loadCategory() {
    const { categoryId } = this.data
    const cat = await get('budget_categories', categoryId)
    if (cat) {
      this.setData({ categoryBudgeted: cat.budgeted || 0 })
    }
  },

  async loadItems() {
    const { categoryId } = this.data
    const items = await query('budget_items', { categoryId })
    items.sort((a, b) => {
      // Unpaid first, then by date
      if (a.paid !== b.paid) return a.paid ? 1 : -1
      return (a.date || '') > (b.date || '') ? 1 : -1
    })

    const estimatedTotal = items.reduce((s, i) => s + (Number(i.estimated) || 0), 0)
    const actualTotal = items.reduce((s, i) => s + (Number(i.actual) || 0), 0)
    const unpaidTotal = items.filter(i => !i.paid).reduce((s, i) => s + (Number(i.actual) || Number(i.estimated) || 0), 0)

    this.setData({ items, estimatedTotal, actualTotal, unpaidTotal })
  },

  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { name: '', estimated: '', actual: '', paid: false, date: formatDate(new Date()), notes: '' }
    })
  },

  editItem(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showModal: true,
      editingId: item._id,
      form: {
        name: item.name || '',
        estimated: item.estimated ? String(item.estimated) : '',
        actual: item.actual ? String(item.actual) : '',
        paid: item.paid || false,
        date: item.date || '',
        notes: item.notes || ''
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

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value })
  },

  togglePaid() {
    this.setData({ 'form.paid': !this.data.form.paid })
  },

  async saveItem() {
    const { form, editingId, categoryId } = this.data
    if (!form.name.trim()) { toast('请输入项目名称'); return }
    showLoading('保存中...')
    try {
      const data = {
        categoryId,
        name: form.name.trim(),
        estimated: Number(form.estimated) || 0,
        actual: Number(form.actual) || 0,
        paid: form.paid,
        date: form.date,
        notes: form.notes.trim()
      }
      if (editingId) {
        await update('budget_items', editingId, data)
      } else {
        await add('budget_items', data)
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

  async toggleItemPaid(e) {
    const { id, paid } = e.currentTarget.dataset
    await update('budget_items', id, { paid: !paid })
    this.loadItems()
  },

  async deleteItem(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此明细？')
      await remove('budget_items', id)
      this.loadItems()
      toast('已删除')
    } catch {}
  },

  formatMoney(v) { return formatMoney(v) }
})

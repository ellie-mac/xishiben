const { query, add, update, remove, get } = require('../../../utils/db')
const { BUDGET_CATEGORIES } = require('../../../utils/templates')
const { toast, confirm, formatMoney, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    categories: [],
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    editingBudget: false,
    budgetInput: '',
    projectBudgetId: null
  },

  onLoad() { this.loadData() },
  onShow() {
    const tabBar = this.getTabBar(); if (tabBar) tabBar.setData({ selected: 3 }); this.loadData() },

  async loadData() {
    showLoading('加载中...')
    try {
      const cats = await query('budget_categories')
      const items = await query('budget_items')

      // Aggregate actuals per category
      const catMap = {}
      for (const cat of cats) {
        catMap[cat._id] = { ...cat, spent: 0, items: [] }
      }
      for (const item of items) {
        if (catMap[item.categoryId]) {
          catMap[item.categoryId].spent += Number(item.actual) || 0
          catMap[item.categoryId].items.push(item)
        }
      }

      const categoriesArr = Object.values(catMap)
      const totalBudget = categoriesArr.reduce((s, c) => s + (Number(c.budgeted) || 0), 0)
      const totalSpent = categoriesArr.reduce((s, c) => s + (c.spent || 0), 0)

      this.setData({
        categories: categoriesArr,
        totalBudget,
        totalSpent,
        totalRemaining: totalBudget - totalSpent
      })
      hideLoading()
    } catch (e) {
      hideLoading()
      console.error(e)
    }
  },

  async initFromTemplates() {
    try {
      await confirm(`将初始化 ${BUDGET_CATEGORIES.length} 个预算分类，是否继续？`)
      showLoading('初始化中...')
      for (const tpl of BUDGET_CATEGORIES) {
        await add('budget_categories', {
          name: tpl.name,
          icon: tpl.icon,
          budgeted: tpl.defaultBudget
        })
      }
      hideLoading()
      this.loadData()
      toast('初始化成功', 'success')
    } catch {
      hideLoading()
    }
  },

  goToDetail(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/budget/detail/index?categoryId=${id}&categoryName=${name}` })
  },

  startEditBudget(e) {
    const { id, budgeted } = e.currentTarget.dataset
    this.setData({ editingBudget: id, budgetInput: String(budgeted || 0) })
  },

  onBudgetInput(e) {
    this.setData({ budgetInput: e.detail.value })
  },

  async saveBudget() {
    const { editingBudget, budgetInput } = this.data
    if (!editingBudget) return
    const val = Number(budgetInput) || 0
    await update('budget_categories', editingBudget, { budgeted: val })
    this.setData({ editingBudget: null, budgetInput: '' })
    this.loadData()
    toast('已更新', 'success')
  },

  cancelEdit() {
    this.setData({ editingBudget: null })
  },

  async deleteCategory(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('删除此分类及其所有明细？')
      // Delete all items for this category
      const items = await query('budget_items', { categoryId: id })
      for (const item of items) {
        await remove('budget_items', item._id)
      }
      await remove('budget_categories', id)
      this.loadData()
      toast('已删除')
    } catch {}
  },

  formatMoney(v) { return formatMoney(v) },

  getPct(spent, budgeted) {
    if (!budgeted) return 0
    return Math.min(100, Math.round(spent / budgeted * 100))
  }
})

const { query, add, update, remove } = require('../../utils/db')
const { REGISTRATION_CHECKLIST } = require('../../utils/templates')
const { toast, confirm, showLoading, hideLoading, formatDate, daysFrom } = require('../../utils/util')

const CATEGORIES = ['全部', '证件', '照片', '提前了解', '当天安排']

Page({
  data: {
    activeTab: 'checklist', // checklist | weather
    // checklist
    items: [],
    activeCat: '全部',
    CATEGORIES,
    showTemplates: false,
    showAddModal: false,
    addForm: { title: '', desc: '', category: '证件' },
    templateList: REGISTRATION_CHECKLIST,
    // weather
    registrationDate: '',
    city: '',
    weatherResult: null,
    weatherLoading: false,
    daysUntil: null,
    outfitSuggestion: ''
  },

  onLoad() {
    this.loadItems()
    this.loadProjectInfo()
  },
  onShow() {
    this.loadItems()
    this.loadProjectInfo()
  },

  loadProjectInfo() {
    const app = getApp()
    const info = app.globalData.projectInfo
    if (info) {
      const regDate = info.registrationDate || ''
      const city = info.city || ''
      const daysUntil = regDate ? daysFrom(regDate) : null
      this.setData({ registrationDate: regDate, city, daysUntil })
    }
  },

  async loadItems() {
    const items = await query('tasks', { module: 'registration' })
    items.sort((a, b) => (a.order || 0) - (b.order || 0))
    this.setData({ items })
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  switchCat(e) {
    this.setData({ activeCat: e.currentTarget.dataset.cat })
  },

  async toggleItem(e) {
    const { id, completed } = e.currentTarget.dataset
    await update('tasks', id, { completed: !completed })
    this.loadItems()
  },

  async deleteItem(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除？')
      await remove('tasks', id)
      this.loadItems()
      toast('已删除')
    } catch {}
  },

  openAdd() {
    this.setData({ showAddModal: true, addForm: { title: '', desc: '', category: '证件' } })
  },
  closeAdd() { this.setData({ showAddModal: false }) },

  onAddInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`addForm.${key}`]: e.detail.value })
  },

  onCatPick(e) {
    const cats = ['证件', '照片', '提前了解', '当天安排']
    this.setData({ 'addForm.category': cats[e.detail.value] })
  },

  async saveAdd() {
    const { addForm } = this.data
    if (!addForm.title.trim()) { toast('请输入标题'); return }
    await add('tasks', {
      module: 'registration',
      title: addForm.title.trim(),
      desc: addForm.desc.trim(),
      category: addForm.category,
      completed: false,
      order: Date.now()
    })
    this.setData({ showAddModal: false })
    this.loadItems()
    toast('已添加', 'success')
  },

  openTemplates() { this.setData({ showTemplates: true }) },
  closeTemplates() { this.setData({ showTemplates: false }) },

  async importTemplate(e) {
    const tpl = e.currentTarget.dataset.tpl
    await add('tasks', {
      module: 'registration',
      title: tpl.title,
      desc: tpl.desc,
      category: tpl.category,
      completed: false,
      order: Date.now()
    })
    toast('已添加', 'success')
    this.loadItems()
  },

  async importAllTemplates() {
    try {
      await confirm(`一键导入全部 ${REGISTRATION_CHECKLIST.length} 项领证清单？`)
      showLoading('导入中...')
      for (const tpl of REGISTRATION_CHECKLIST) {
        await add('tasks', {
          module: 'registration',
          title: tpl.title,
          desc: tpl.desc,
          category: tpl.category,
          completed: false,
          order: Date.now() + Math.random()
        })
      }
      hideLoading()
      this.setData({ showTemplates: false })
      this.loadItems()
      toast('导入成功', 'success')
    } catch { hideLoading() }
  },

  // 天气查询
  async queryWeather() {
    const { registrationDate, city, daysUntil } = this.data
    if (!registrationDate) { toast('请先在项目信息中设置领证日期'); return }
    if (!city) { toast('请先在项目信息中设置城市'); return }
    if (daysUntil !== null && daysUntil > 7) {
      toast('距离领证超过7天，天气预报暂不可用')
      return
    }

    this.setData({ weatherLoading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'weather',
        data: { city, date: registrationDate }
      })
      const weather = res.result
      const outfit = this.getOutfitSuggestion(weather)
      this.setData({
        weatherResult: weather,
        outfitSuggestion: outfit,
        weatherLoading: false
      })
    } catch (e) {
      this.setData({ weatherLoading: false })
      toast('天气查询失败，请稍后重试')
    }
  },

  getOutfitSuggestion(weather) {
    if (!weather || !weather.temp) return ''
    const temp = parseInt(weather.temp)
    let suggestion = ''
    if (temp >= 28) {
      suggestion = '天气炎热，建议穿轻薄正装。新娘可搭配清爽短款礼服，注意防晒补妆。'
    } else if (temp >= 20) {
      suggestion = '天气舒适，适合各类正装。这是领证的好天气，好好打扮！'
    } else if (temp >= 10) {
      suggestion = '天气微凉，建议穿有层次感的正装，外搭精致外套。'
    } else {
      suggestion = '天气寒冷，注意保暖同时保持仪式感。可选厚实优雅的大衣配正装。'
    }
    if (weather.desc && (weather.desc.includes('雨') || weather.desc.includes('雪'))) {
      suggestion += '\n注意：有降水，请提前备好雨伞，注意鞋子防水。'
    }
    return suggestion
  }
})

const { query, add, update, remove } = require('../../../utils/db')
const { PROPOSAL_TASKS } = require('../../../utils/templates')
const { toast, confirm, deepClone } = require('../../../utils/util')

Page({
  data: {
    tasks: [],
    categories: [],
    activeCategory: '全部',
    showTemplates: false,
    showAddModal: false,
    addForm: { title: '', desc: '', category: '策划' },
    CATEGORIES: ['全部', '策划', '场地布置', '求婚戒指', '礼物惊喜', '求婚誓言'],
    templateList: PROPOSAL_TASKS
  },

  onLoad() { this.loadTasks() },
  onShow() { this.loadTasks() },

  async loadTasks() {
    const tasks = await query('tasks', { module: 'proposal' })
    tasks.sort((a, b) => (a.order || 0) - (b.order || 0))
    const completedCount = tasks.filter(t => t.completed).length
    const progressPct = tasks.length ? Math.round(completedCount / tasks.length * 100) : 0
    this.setData({ tasks, completedCount, progressPct })
  },

  get filteredTasks() {
    const { tasks, activeCategory } = this.data
    if (activeCategory === '全部') return tasks
    return tasks.filter(t => t.category === activeCategory)
  },

  switchCategory(e) {
    this.setData({ activeCategory: e.currentTarget.dataset.cat })
  },

  // 勾选/取消勾选
  async toggleTask(e) {
    const { id, completed } = e.currentTarget.dataset
    await update('tasks', id, { completed: !completed })
    this.loadTasks()
  },

  // 删除
  async deleteTask(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此任务？')
      await remove('tasks', id)
      this.loadTasks()
      toast('已删除')
    } catch {}
  },

  // 打开添加弹窗
  openAdd() {
    this.setData({ showAddModal: true, addForm: { title: '', desc: '', category: '策划' } })
  },

  closeAdd() { this.setData({ showAddModal: false }) },

  onAddInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`addForm.${key}`]: e.detail.value })
  },

  async saveAdd() {
    const { title, desc, category } = this.data.addForm
    if (!title.trim()) { toast('请输入任务名称'); return }
    await add('tasks', {
      module: 'proposal',
      title: title.trim(),
      desc: desc.trim(),
      category,
      completed: false,
      order: Date.now()
    })
    this.setData({ showAddModal: false })
    this.loadTasks()
    toast('已添加', 'success')
  },

  // 模板一键导入
  openTemplates() { this.setData({ showTemplates: true }) },
  closeTemplates() { this.setData({ showTemplates: false }) },

  async importTemplate(e) {
    const tpl = e.currentTarget.dataset.tpl
    await add('tasks', {
      module: 'proposal',
      title: tpl.title,
      desc: tpl.desc,
      category: tpl.category,
      completed: false,
      order: Date.now()
    })
    toast('已添加', 'success')
    this.loadTasks()
  },

  async importAllTemplates() {
    try {
      await confirm(`一键导入全部 ${PROPOSAL_TASKS.length} 个求婚任务模板？`)
      wx.showLoading({ title: '导入中...', mask: true })
      for (const tpl of PROPOSAL_TASKS) {
        await add('tasks', {
          module: 'proposal',
          title: tpl.title,
          desc: tpl.desc,
          category: tpl.category,
          completed: false,
          order: Date.now() + Math.random()
        })
      }
      wx.hideLoading()
      this.setData({ showTemplates: false })
      this.loadTasks()
      toast('导入成功', 'success')
    } catch {}
  }
})

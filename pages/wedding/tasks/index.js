const { query, add, update, remove } = require('../../../utils/db')
const { WEDDING_TASKS } = require('../../../utils/templates')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

const PHASES = ['提前12个月', '提前6个月', '提前3个月', '提前1个月', '婚礼当天']

Page({
  data: {
    tasks: [],
    activePhase: '提前12个月',
    PHASES,
    expandedPhases: { '提前12个月': true, '提前6个月': true, '提前3个月': true, '提前1个月': true, '婚礼当天': true },
    showTemplates: false,
    showAddModal: false,
    addForm: { title: '', desc: '', phase: '提前12个月', category: '' },
    templateList: WEDDING_TASKS,
    templatePhase: '提前12个月'
  },

  onLoad() { this.loadTasks() },
  onShow() { this.loadTasks() },

  async loadTasks() {
    const tasks = await query('tasks', { module: 'wedding' })
    tasks.sort((a, b) => (a.order || 0) - (b.order || 0))
    this.setData({ tasks })
  },

  getTasksByPhase(phase) {
    return this.data.tasks.filter(t => t.phase === phase)
  },

  switchPhase(e) {
    this.setData({ activePhase: e.currentTarget.dataset.phase })
  },

  togglePhase(e) {
    const phase = e.currentTarget.dataset.phase
    const key = `expandedPhases.${phase}`
    this.setData({ [key]: !this.data.expandedPhases[phase] })
  },

  async toggleTask(e) {
    const { id, completed } = e.currentTarget.dataset
    await update('tasks', id, { completed: !completed })
    this.loadTasks()
  },

  async deleteTask(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此任务？')
      await remove('tasks', id)
      this.loadTasks()
      toast('已删除')
    } catch {}
  },

  openAdd() {
    this.setData({
      showAddModal: true,
      addForm: { title: '', desc: '', phase: this.data.activePhase, category: '' }
    })
  },

  closeAdd() { this.setData({ showAddModal: false }) },

  onAddInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`addForm.${key}`]: e.detail.value })
  },

  onPhasePick(e) {
    this.setData({ 'addForm.phase': PHASES[e.detail.value] })
  },

  async saveAdd() {
    const { title, desc, phase, category } = this.data.addForm
    if (!title.trim()) { toast('请输入任务名称'); return }
    await add('tasks', {
      module: 'wedding',
      title: title.trim(),
      desc: desc.trim(),
      phase,
      category: category.trim() || '自定义',
      completed: false,
      order: Date.now()
    })
    this.setData({ showAddModal: false })
    this.loadTasks()
    toast('已添加', 'success')
  },

  openTemplates() { this.setData({ showTemplates: true }) },
  closeTemplates() { this.setData({ showTemplates: false }) },

  switchTemplatePhase(e) {
    this.setData({ templatePhase: e.currentTarget.dataset.phase })
  },

  async importTemplate(e) {
    const tpl = e.currentTarget.dataset.tpl
    await add('tasks', {
      module: 'wedding',
      title: tpl.title,
      desc: tpl.desc,
      phase: tpl.phase,
      category: tpl.category,
      completed: false,
      order: Date.now()
    })
    toast('已添加', 'success')
    this.loadTasks()
  },

  async importAllTemplates() {
    try {
      await confirm(`一键导入全部 ${WEDDING_TASKS.length} 个婚礼任务模板？`)
      showLoading('导入中...')
      for (const tpl of WEDDING_TASKS) {
        await add('tasks', {
          module: 'wedding',
          title: tpl.title,
          desc: tpl.desc,
          phase: tpl.phase,
          category: tpl.category,
          completed: false,
          order: Date.now() + Math.random()
        })
      }
      hideLoading()
      this.setData({ showTemplates: false })
      this.loadTasks()
      toast('导入成功', 'success')
    } catch {
      hideLoading()
    }
  },

  // computed helper for WXML
  phaseProgress(phase) {
    const tasks = this.data.tasks.filter(t => t.phase === phase)
    const done = tasks.filter(t => t.completed).length
    return { total: tasks.length, done, pct: tasks.length ? Math.round(done / tasks.length * 100) : 0 }
  }
})

const { query, add, update, remove } = require('../../../utils/db')
const { PHOTO_CHECKLIST } = require('../../../utils/templates')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

const CATEGORIES = ['全部', '选店', '谈套餐', '场景选择', '妆容服装', '拍摄前准备', '精修选片']

Page({
  data: {
    activeTab: 'guide', // guide | checklist | compare
    // checklist tab
    checkItems: [],
    activeCat: '全部',
    CATEGORIES,
    showTemplates: false,
    showAddModal: false,
    addForm: { title: '', desc: '', category: '选店' },
    templateList: PHOTO_CHECKLIST,
    // guide sections
    guideSections: [
      {
        title: '如何选择靠谱的婚纱照门店',
        content: '不要只看朋友圈宣传图！要亲自去门店查看真实客片，最好要求看本月或上月刚出的客片。注意区分摄影师风格图和修图师风格图，部分门店外包修图，最终效果可能和拍摄时大相径庭。\n\n选店核心原则：\n① 实地探店，不被朋友圈和大众点评"精选"蒙骗\n② 要求看摄影师本人的真实客片（而非门店通用宣传图）\n③ 确认指定摄影师的档期，并写入合同\n④ 多家对比（至少3家），不要被"优惠名额有限"催促'
      },
      {
        title: '谈套餐的注意事项',
        content: '婚纱照消费陷阱主要来自"升级费"。要在签合同前把所有可能的额外费用问清楚。\n\n必须确认的关键项：\n① 精修照片数量（一般5-10张，可谈加送）\n② 原图/底片是否包含在套餐中\n③ 换装套数（至少2-3套）\n④ 相册规格、本数和升级费用\n⑤ 拍摄时长（一般8-12小时含妆发）\n⑥ 内外景地点是否有差旅费\n⑦ 交片时间（婚礼前务必拿到）'
      },
      {
        title: '拍摄前的准备工作',
        content: '前一周护肤状态直接影响出片效果。多喝水、早睡、避免熬夜是最简单有效的方法。\n\n拍摄前1周：\n• 每天保湿+补水，避免皮肤干燥\n• 修眉、手脚护理（提前3-5天）\n• 确认婚鞋与礼服搭配\n\n拍摄前夜：\n• 早睡！避免眼睛浮肿\n• 不要喝酒或吃太咸的食物\n• 准备好所有饰品和随身物品'
      },
      {
        title: '选片和修图技巧',
        content: '选片时不要只选"表情完美"的，要选神态自然、姿态放松的照片。过于刻意的表情在精修后往往显得不自然。\n\n选片建议：\n• 优先选自然表情和自然姿态\n• 提供修图参考图，和修图师充分沟通风格\n• 确认修图交付时间（一般3-6个月）\n• 婚礼前务必催促拿到照片'
      }
    ]
  },

  onLoad() { this.loadCheckItems() },
  onShow() { this.loadCheckItems() },

  async loadCheckItems() {
    const items = await query('tasks', { module: 'photos' })
    items.sort((a, b) => (a.order || 0) - (b.order || 0))
    const completedCount = items.filter(i => i.completed).length
    const progressPct = items.length ? Math.round(completedCount / items.length * 100) : 0
    this.setData({ checkItems: items, completedCount, progressPct })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === 'compare') {
      wx.navigateTo({ url: '/pages/photos/compare/index' })
      return
    }
    this.setData({ activeTab: tab })
  },

  switchCat(e) {
    this.setData({ activeCat: e.currentTarget.dataset.cat })
  },

  async toggleItem(e) {
    const { id, completed } = e.currentTarget.dataset
    await update('tasks', id, { completed: !completed })
    this.loadCheckItems()
  },

  async deleteItem(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除？')
      await remove('tasks', id)
      this.loadCheckItems()
      toast('已删除')
    } catch {}
  },

  openAdd() {
    this.setData({ showAddModal: true, addForm: { title: '', desc: '', category: '选店' } })
  },
  closeAdd() { this.setData({ showAddModal: false }) },

  onAddInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`addForm.${key}`]: e.detail.value })
  },

  onCatPick(e) {
    const cats = ['选店', '谈套餐', '场景选择', '妆容服装', '拍摄前准备', '精修选片']
    this.setData({ 'addForm.category': cats[e.detail.value] })
  },

  async saveAdd() {
    const { addForm } = this.data
    if (!addForm.title.trim()) { toast('请输入标题'); return }
    await add('tasks', {
      module: 'photos',
      title: addForm.title.trim(),
      desc: addForm.desc.trim(),
      category: addForm.category,
      completed: false,
      order: Date.now()
    })
    this.setData({ showAddModal: false })
    this.loadCheckItems()
    toast('已添加', 'success')
  },

  openTemplates() { this.setData({ showTemplates: true }) },
  closeTemplates() { this.setData({ showTemplates: false }) },

  async importTemplate(e) {
    const tpl = e.currentTarget.dataset.tpl
    await add('tasks', {
      module: 'photos',
      title: tpl.title,
      desc: tpl.desc,
      category: tpl.category,
      completed: false,
      order: Date.now()
    })
    toast('已添加', 'success')
    this.loadCheckItems()
  },

  async importAllTemplates() {
    try {
      await confirm(`一键导入全部 ${PHOTO_CHECKLIST.length} 项婚纱照清单？`)
      showLoading('导入中...')
      for (const tpl of PHOTO_CHECKLIST) {
        await add('tasks', {
          module: 'photos',
          title: tpl.title,
          desc: tpl.desc,
          category: tpl.category,
          completed: false,
          order: Date.now() + Math.random()
        })
      }
      hideLoading()
      this.setData({ showTemplates: false })
      this.loadCheckItems()
      toast('导入成功', 'success')
    } catch { hideLoading() }
  }
})

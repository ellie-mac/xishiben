const { daysFrom, formatDate, formatCountdown } = require('../../utils/util')
const { query } = require('../../utils/db')

Page({
  data: {
    projectInfo: null,
    weddingDays: null,
    proposalDays: null,
    registrationDays: null,
    progress: {
      proposal: 0,
      wedding: 0,
      photos: 0,
      registration: 0
    },
    anniversaries: [],
    hasProject: false
  },

  onShow() {
    this.loadData()
  },

  async loadData() {
    const app = getApp()
    if (!app.globalData.projectId) {
      this.setData({ hasProject: false })
      return
    }
    this.setData({ hasProject: true })

    const projectInfo = app.globalData.projectInfo
    if (projectInfo) {
      this.updateDates(projectInfo)
    }

    // 加载进度
    await this.loadProgress()

    // 加载纪念日
    this.loadAnniversaries(projectInfo)
  },

  updateDates(info) {
    const weddingDays = daysFrom(info.weddingDate)
    const proposalDays = daysFrom(info.proposalDate)
    const registrationDays = daysFrom(info.registrationDate)
    this.setData({
      projectInfo: info,
      weddingDays,
      proposalDays,
      registrationDays
    })
  },

  async loadProgress() {
    try {
      const tasks = await query('tasks')
      const modules = ['proposal', 'wedding', 'photos', 'registration']
      const progress = {}
      modules.forEach(m => {
        const moduleTasks = tasks.filter(t => t.module === m)
        if (moduleTasks.length === 0) {
          progress[m] = 0
        } else {
          const done = moduleTasks.filter(t => t.completed).length
          progress[m] = Math.round((done / moduleTasks.length) * 100)
        }
      })
      this.setData({ progress })
    } catch (e) {
      console.error(e)
    }
  },

  loadAnniversaries(info) {
    if (!info) return
    const list = []
    if (info.proposalDate) {
      list.push({ label: '求婚纪念日', date: info.proposalDate, days: daysFrom(info.proposalDate) })
    }
    if (info.registrationDate) {
      list.push({ label: '领证纪念日', date: info.registrationDate, days: daysFrom(info.registrationDate) })
    }
    if (info.weddingDate) {
      list.push({ label: '婚礼纪念日', date: info.weddingDate, days: daysFrom(info.weddingDate) })
    }
    this.setData({ anniversaries: list })
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/index' })
  },

  goTo(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  }
})

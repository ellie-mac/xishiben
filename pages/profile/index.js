const { genInviteCode, toast, confirm, formatDate, showLoading, hideLoading } = require('../../utils/util')
const { add, update, getProject, col } = require('../../utils/db')

Page({
  data: {
    state: 'loading', // loading | setup | joined
    projectInfo: null,
    inviteCode: '',
    inputCode: '',
    showInviteModal: false,
    showEditModal: false,
    editForm: {
      groomName: '',
      brideName: '',
      weddingDate: '',
      proposalDate: '',
      registrationDate: '',
      city: ''
    }
  },

  onLoad() {
    this.init()
  },

  async init() {
    const app = getApp()
    showLoading()
    try {
      // 先确保有openId
      await app.getOpenId()
      const projectId = app.globalData.projectId
      if (!projectId) {
        this.setData({ state: 'setup' })
        hideLoading()
        return
      }
      const project = await getProject(projectId)
      if (!project) {
        app.globalData.projectId = ''
        wx.removeStorageSync('projectId')
        this.setData({ state: 'setup' })
        hideLoading()
        return
      }
      app.globalData.projectInfo = project
      this.setData({ state: 'joined', projectInfo: project })
    } catch (e) {
      console.error(e)
    }
    hideLoading()
  },

  // 创建新项目
  async createProject() {
    const app = getApp()
    showLoading('创建中...')
    try {
      const inviteCode = genInviteCode()
      const res = await col('projects').add({
        data: {
          inviteCode,
          members: [app.globalData.openId],
          groomName: '',
          brideName: '',
          weddingDate: '',
          proposalDate: '',
          registrationDate: '',
          city: '',
          createdAt: wx.cloud ? require('../../utils/db').db.serverDate() : new Date()
        }
      })
      const projectId = res._id
      app.globalData.projectId = projectId
      wx.setStorageSync('projectId', projectId)
      const project = await getProject(projectId)
      app.globalData.projectInfo = project
      this.setData({ state: 'joined', projectInfo: project })
      // 立即弹出编辑资料
      this.openEdit()
    } catch (e) {
      toast('创建失败，请重试')
    }
    hideLoading()
  },

  // 加入已有项目（输入邀请码）
  onInputCode(e) {
    this.setData({ inputCode: e.detail.value.toUpperCase() })
  },

  async joinProject() {
    const code = this.data.inputCode.trim()
    if (code.length !== 6) {
      toast('请输入6位邀请码')
      return
    }
    const app = getApp()
    showLoading('查询中...')
    try {
      const db = require('../../utils/db').db
      const res = await db.collection('projects').where({ inviteCode: code }).get()
      if (res.data.length === 0) {
        toast('邀请码无效')
        hideLoading()
        return
      }
      const project = res.data[0]
      const projectId = project._id

      // 加入成员
      const members = project.members || []
      if (!members.includes(app.globalData.openId)) {
        members.push(app.globalData.openId)
        await db.collection('projects').doc(projectId).update({ data: { members } })
      }

      app.globalData.projectId = projectId
      wx.setStorageSync('projectId', projectId)
      app.globalData.projectInfo = project
      this.setData({ state: 'joined', projectInfo: project, inputCode: '' })
      toast('加入成功！', 'success')
    } catch (e) {
      toast('加入失败，请重试')
    }
    hideLoading()
  },

  // 编辑资料
  openEdit() {
    const info = this.data.projectInfo || {}
    this.setData({
      showEditModal: true,
      editForm: {
        groomName: info.groomName || '',
        brideName: info.brideName || '',
        weddingDate: info.weddingDate || '',
        proposalDate: info.proposalDate || '',
        registrationDate: info.registrationDate || '',
        city: info.city || ''
      }
    })
  },

  onEditInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`editForm.${key}`]: e.detail.value })
  },

  async saveEdit() {
    const app = getApp()
    const projectId = app.globalData.projectId
    showLoading('保存中...')
    try {
      const db = require('../../utils/db').db
      await db.collection('projects').doc(projectId).update({ data: this.data.editForm })
      const project = await getProject(projectId)
      app.globalData.projectInfo = project
      this.setData({ projectInfo: project, showEditModal: false })
      toast('保存成功', 'success')
    } catch (e) {
      toast('保存失败')
    }
    hideLoading()
  },

  closeEdit() {
    this.setData({ showEditModal: false })
  },

  // 分享邀请码
  showInvite() {
    this.setData({
      showInviteModal: true,
      inviteCode: this.data.projectInfo.inviteCode
    })
  },

  closeInvite() {
    this.setData({ showInviteModal: false })
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => toast('已复制', 'success')
    })
  },

  // 只读分享
  onShareAppMessage() {
    const app = getApp()
    const projectId = app.globalData.projectId
    return {
      title: '我们正在备婚，来看看进度 💍',
      path: `/pages/index/index?shareProjectId=${projectId}&readonly=1`
    }
  },

  // 退出项目
  async leaveProject() {
    try {
      await confirm('退出后需要重新绑定才能恢复数据，确认退出吗？', '退出项目')
      const app = getApp()
      app.globalData.projectId = ''
      app.globalData.projectInfo = null
      wx.removeStorageSync('projectId')
      this.setData({ state: 'setup', projectInfo: null })
    } catch (e) {}
  }
})

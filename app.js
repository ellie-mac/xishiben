App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      env: 'YOUR_ENV_ID', // 替换为你的云开发环境ID
      traceUser: true
    })

    // 获取并缓存 openId
    const openId = wx.getStorageSync('openId')
    const projectId = wx.getStorageSync('projectId')
    if (openId) {
      this.globalData.openId = openId
    }
    if (projectId) {
      this.globalData.projectId = projectId
    }
  },

  // 获取openId（首次需联网）
  getOpenId() {
    return new Promise((resolve, reject) => {
      if (this.globalData.openId) {
        resolve(this.globalData.openId)
        return
      }
      wx.cloud.callFunction({
        name: 'getOpenId'
      }).then(res => {
        const openId = res.result.openId
        this.globalData.openId = openId
        wx.setStorageSync('openId', openId)
        resolve(openId)
      }).catch(reject)
    })
  },

  globalData: {
    openId: '',
    projectId: '',
    projectInfo: null
  }
})

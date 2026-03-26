Page({
  onShow() {
    const tabBar = this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 1 })
  },
  data: {
    modules: [
      { id: 'proposal', name: '求婚准备', icon: '💌', desc: '场地布置、戒指、誓言、策划', url: '/pages/proposal/tasks/index', color: '#FEE8ED' },
      { id: 'wedding', name: '婚礼筹备', icon: '💒', desc: '流程、供应商、请柬、伴娘伴郎', url: '/pages/wedding/tasks/index', color: '#FEF3E2' },
      { id: 'photos', name: '婚纱照攻略', icon: '📷', desc: '选店、谈套餐、拍摄、精修', url: '/pages/photos/index/index', color: '#F0F4FF' },
      { id: 'registration', name: '领证攻略', icon: '📋', desc: '材料清单、天气建议、着装', url: '/pages/registration/index', color: '#F0FFF4' }
    ]
  },
  goTo(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  }
})

Component({
  data: {
    selected: 0,
    tabs: [
      { pagePath: '/pages/index/index', text: '首页', emoji: '🏠' },
      { pagePath: '/pages/checklist/index', text: '清单', emoji: '📋' },
      { pagePath: '/pages/calendar/index', text: '吉日', emoji: '📅' },
      { pagePath: '/pages/budget/index/index', text: '预算', emoji: '💰' },
      { pagePath: '/pages/profile/index', text: '我们', emoji: '💕' }
    ]
  },
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const url = this.data.tabs[index].pagePath
      wx.switchTab({ url })
      this.setData({ selected: index })
    }
  }
})

Page({
  data: {
    sessions: [],
  },

  onShow() {
    this.loadSessions()
  },

  loadSessions() {
    const all = wx.getStorageSync('chatSessions') || []
    this.setData({ sessions: all })
  },

  openSession(e) {
    const id = e.currentTarget.dataset.id
    const sessions = this.data.sessions
    const idx = sessions.findIndex(s => s.id === id)
    if (idx > -1) {
      wx.setStorageSync('currentSessionId', id)
      wx.switchTab({ url: '/pages/chat/chat' })
    }
  },

  clearHistory() {
    wx.showModal({
      title: '清空历史？',
      content: '所有对话记录将被删除，不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('chatSessions')
          wx.removeStorageSync('chatMessages')
          wx.removeStorageSync('messageCount')
          this.setData({ sessions: [] })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      },
    })
  },
})
// 虾仔 - 双人格情感陪伴小程序
App({
  globalData: {
    // 后端 API 地址（部署后替换）
    apiBaseUrl: 'https://your-api-domain.com',
    // 当前用户会话 ID
    sessionId: '',
    // 当前人格模式
    currentMode: 'whiteShrimp', // whiteShrimp | blackShrimp
    // 对话历史缓存
    messageHistory: [],
  },

  onLaunch() {
    // 生成会话 ID
    const sessionId = this.generateSessionId()
    this.globalData.sessionId = sessionId
    wx.setStorageSync('sessionId', sessionId)
  },

  generateSessionId() {
    const saved = wx.getStorageSync('sessionId')
    if (saved) return saved
    return 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  },
})
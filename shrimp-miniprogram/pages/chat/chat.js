// 聊天页
const api = require('../../services/api')
const app = getApp()

Page({
  data: {
    messages: [],
    inputValue: '',
    currentMode: 'whiteShrimp',
    isLoading: false,
    scrollToId: '',
    messageCount: 0,
    // 付费限制
    freeLimit: 5,
  },

  onLoad() {
    // 读取缓存消息
    const cached = wx.getStorageSync('chatMessages') || []
    const mode = wx.getStorageSync('currentMode') || 'whiteShrimp'
    const count = wx.getStorageSync('messageCount') || 0

    this.setData({
      messages: cached,
      currentMode: mode,
      messageCount: count,
    })

    app.globalData.currentMode = mode
  },

  // 输入
  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  // 发送消息
  async sendMessage() {
    const text = this.data.inputValue.trim()
    if (!text || this.data.isLoading) return

    // 付费限制检查
    if (this.data.messageCount >= this.data.freeLimit) {
      this.showPayModal()
      return
    }

    // 添加用户消息
    const userMsg = this.buildMessage('user', text)
    const newMessages = [...this.data.messages, userMsg]

    this.setData({
      messages: newMessages,
      inputValue: '',
      isLoading: true,
      scrollToId: 'scroll-bottom',
      messageCount: this.data.messageCount + 1,
    })

    // 保存到缓存
    wx.setStorageSync('chatMessages', this.data.messages)
    wx.setStorageSync('messageCount', this.data.messageCount)

    try {
      // 调用后端 API
      const result = await api.sendMessage(text, this.data.currentMode)

      // 添加虾仔回复
      const replyMsg = this.buildMessage('assistant', result.reply)
      const finalMessages = [...this.data.messages, replyMsg]

      // 检测人格切换
      let mode = this.data.currentMode
      if (result.mode === 'blackShrimp' && mode !== 'blackShrimp') {
        mode = 'blackShrimp'
      } else if (result.mode === 'whiteShrimp' && mode !== 'whiteShrimp') {
        mode = 'whiteShrimp'
      }

      this.setData({
        messages: finalMessages,
        isLoading: false,
        currentMode: mode,
        scrollToId: 'scroll-bottom',
      })

      // 更新全局
      app.globalData.currentMode = mode
      wx.setStorageSync('chatMessages', finalMessages)
      wx.setStorageSync('currentMode', mode)

    } catch (err) {
      // 错误处理
      const errMsg = this.buildMessage('assistant', '虾仔网络不太好，你再说一遍？')
      this.setData({
        messages: [...this.data.messages, errMsg],
        isLoading: false,
        scrollToId: 'scroll-bottom',
      })
      wx.showToast({ title: '网络开小差了', icon: 'none' })
    }
  },

  // 手动切换人格
  toggleMode() {
    const newMode = this.data.currentMode === 'whiteShrimp' ? 'blackShrimp' : 'whiteShrimp'
    this.setData({ currentMode: newMode })
    app.globalData.currentMode = newMode
    wx.setStorageSync('currentMode', newMode)

    // 切换提示
    const hint = newMode === 'blackShrimp'
      ? '切换到黑虾了。准备好听实话了吗？'
      : '切换到白虾了。慢慢说，我听着。'

    const hintMsg = this.buildMessage('assistant', hint)
    this.setData({
      messages: [...this.data.messages, hintMsg],
      scrollToId: 'scroll-bottom',
    })
    wx.setStorageSync('chatMessages', this.data.messages)
  },

  // 构建消息对象
  buildMessage(role, content) {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    return {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      role,
      content,
      time,
    }
  },

  // 付费弹窗
  showPayModal() {
    wx.showModal({
      title: '免费次数已用完',
      content: '你已经用了 5 条免费消息，继续和虾仔聊天需要解锁啦。',
      confirmText: '去解锁',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '付费功能开发中…', icon: 'none' })
        }
      },
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '虾仔 - 一个该温柔时温柔、该犀利时犀利的朋友',
      path: '/pages/index/index',
    }
  },
})
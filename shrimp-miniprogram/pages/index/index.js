// 启动页
Page({
  data: {},

  startChat() {
    wx.navigateTo({
      url: '/pages/chat/chat',
    })
  },

  onShareAppMessage() {
    return {
      title: '虾仔 - 一个该温柔时温柔、该犀利时犀利的朋友',
      path: '/pages/index/index',
    }
  },

  onShareTimeline() {
    return {
      title: '虾仔 - 一个该温柔时温柔、该犀利时犀利的朋友',
    }
  },
})
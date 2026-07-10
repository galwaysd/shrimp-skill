// 虾仔 API 对接层
const app = getApp()

const API_BASE = 'https://your-api-domain.com' // 部署时替换

/**
 * 发送消息给虾仔
 * @param {string} message 用户消息
 * @param {string} mode 当前人格模式
 * @returns {Promise<{reply: string, mode: string}>}
 */
function sendMessage(message, mode = 'whiteShrimp') {
  const sessionId = wx.getStorageSync('sessionId') || app.globalData.sessionId

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/run`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Run-Id': sessionId,
      },
      data: {
        text: message,
        session_id: sessionId,
      },
      timeout: 30000,
      success(res) {
        if (res.statusCode === 200) {
          // 从响应中提取回复内容
          const reply = extractReply(res.data)
          resolve({ reply, mode: mode })
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(new Error(`网络错误: ${err.errMsg}`))
      },
    })
  })
}

/**
 * 从后端响应中提取文本回复
 */
function extractReply(data) {
  if (!data) return '虾仔暂时没听清，你再说一遍？'

  // 兼容多种返回格式
  if (typeof data === 'string') return data
  if (data.messages && Array.isArray(data.messages)) {
    const last = data.messages[data.messages.length - 1]
    if (last && last.content) return last.content
  }
  if (data.output) return data.output
  if (data.content) return data.content
  if (data.reply) return data.reply
  if (data.text) return data.text

  return JSON.stringify(data)
}

/**
 * 获取对话历史
 */
function getHistory(sessionId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}/history`,
      method: 'GET',
      data: { session_id: sessionId },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`获取历史失败: ${res.statusCode}`))
        }
      },
      fail(err) {
        reject(new Error(`网络错误: ${err.errMsg}`))
      },
    })
  })
}

module.exports = {
  sendMessage,
  getHistory,
}
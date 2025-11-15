// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const { sessionId, messages, lastMessage } = event

  try {
    // 首先检查用户是否登录
    const userResult = await db.collection('users').where({
      _openid: openId
    }).get()

    if (!userResult.data || userResult.data.length === 0) {
      return {
        success: false,
        message: '用户未登录'
      }
    }

    // 检查是否已存在该会话
    const existingSession = await db.collection('chat_history')
      .where({
        _openid: openId,
        sessionId: sessionId
      })
      .get()

    if (existingSession.data.length > 0) {
      // 更新现有会话
      await db.collection('chat_history').doc(existingSession.data[0]._id).update({
        data: {
          messages: messages,
          lastMessage: lastMessage,
          updateTime: db.serverDate()
        }
      })
    } else {
      // 创建新会话
      await db.collection('chat_history').add({
        data: {
          _openid: openId,
          sessionId: sessionId,
          messages: messages,
          lastMessage: lastMessage,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('保存聊天记录失败:', error)
    return {
      success: false,
      error: error
    }
  }
} 
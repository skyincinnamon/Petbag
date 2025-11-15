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

    // 查询用户历史记录
    const historyResult = await db.collection('chat_history')
      .where({
        _openid: openId
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      historyList: historyResult.data
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return {
      success: false,
      error: error
    }
  }
} 
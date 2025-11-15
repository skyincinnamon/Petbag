// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 配置参数
const CONFIG = {
  WORKFLOW_ID: '7500614903830560787',
  SPACE_ID: '7493489703136985140',
  TOKEN: 'pat_lZGdA9FdRcVdBnrwyDssZUsXZy7K8nCBOVKeoAqM58SMYxjwLuhicsRh57TuDuu6',
  BOT_ID: '7500529496949768226'
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  try {
    // 验证用户是否登录
    const userResult = await db.collection('users').where({
      _openid: openId
    }).get()

    if (!userResult.data || userResult.data.length === 0) {
      return {
        success: false,
        message: '用户未登录'
      }
    }

    // 处理webhook事件
    const { id, conversation_id, bot_id, completed_at, status, usage } = event

    // 验证bot_id
    if (bot_id !== CONFIG.BOT_ID) {
      return {
        success: false,
        message: '无效的bot_id'
      }
    }

    // 保存对话记录
    await db.collection('chat_history').add({
      data: {
        _openid: openId,
        chat_id: id,
        conversation_id: conversation_id,
        bot_id: bot_id,
        completed_at: completed_at,
        status: status,
        usage: usage,
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      message: '对话记录保存成功'
    }

  } catch (error) {
    console.error('处理webhook失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
} 
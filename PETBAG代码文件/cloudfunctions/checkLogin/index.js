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
    // 查询用户信息
    const userResult = await db.collection('users').where({
      _openid: openId
    }).get()

    console.log('查询用户信息结果:', userResult);

    if (userResult.data && userResult.data.length > 0) {
      return {
        success: true,
        data: userResult.data[0]
      }
    }

    return {
      success: false,
      data: null
    }
  } catch (error) {
    console.error('检查登录状态错误:', error)
    return {
      success: false,
      data: null,
      error: error
    }
  }
} 
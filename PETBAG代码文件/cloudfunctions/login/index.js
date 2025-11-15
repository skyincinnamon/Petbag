const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gi6lxvl077fd062'
})
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 获取用户信息
    const user = await db.collection('users').where({
      _openid: cloud.getWXContext().OPENID
    }).get()
    
    if (user.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }
    
    return {
      success: true,
      message: '登录成功',
      data: user.data[0]
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
} 
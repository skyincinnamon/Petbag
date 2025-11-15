// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-2gi6lxvl077fd062'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('云函数接收到的数据:', event)
  console.log('用户openid:', openid)

  // 如果是退出登录操作
  if (event.action === 'logout') {
    try {
      // 从数据库中删除用户信息
      await db.collection('users').where({
        _openid: openid
      }).remove()
      
      return {
        success: true,
        message: '退出登录成功'
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      return {
        success: false,
        message: '退出登录失败',
        error: error
      }
    }
  }

  // 正常注册/登录流程
  try {
    const { userInfo } = event
    
    if (!userInfo) {
      throw new Error('用户信息为空')
    }

    // 检查用户是否已存在
    const user = await db.collection('users').where({
      _openid: openid
    }).get()

    console.log('查询到的用户信息:', user)

    if (user.data.length > 0) {
      // 用户已存在，更新信息
      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          ...userInfo,
          updateTime: new Date()
        }
      })
    } else {
      // 新用户，创建记录
      await db.collection('users').add({
        data: {
          ...userInfo,
          _openid: openid,
          createTime: new Date(),
          updateTime: new Date()
        }
      })
    }

    return {
      success: true,
      data: userInfo
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      message: error.message || '操作失败',
      error: error
    }
  }
} 
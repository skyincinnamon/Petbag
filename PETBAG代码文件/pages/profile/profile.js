const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  onLoad() {
    // 检查本地存储中是否有用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      })
    } else {
      // 检查授权状态
      this.checkAuthStatus()
    }
  },

  // 检查授权状态
  checkAuthStatus() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            showAuthButton: true
          })
        }
      }
    })
  },

  // 获取用户信息
  async handleGetUserProfile() {
    try {
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })
      
      // 调用云函数保存用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userInfo: {
            ...userInfo,
            createTime: new Date()
          }
        }
      })
      
      if (result.success) {
        // 保存到本地存储
        wx.setStorageSync('userInfo', result.data)
        
        this.setData({
          userInfo: result.data,
          isLoggedIn: true,
          showAuthButton: false
        })
        
        wx.showToast({
          title: '授权成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('授权失败:', error)
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },


  // 处理昵称输入
  onNickNameInput(e) {
    this.setData({
      'userInfo.nickName': e.detail.value
    })
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'userInfo.avatarUrl': res.tempFilePaths[0]
        })
      }
    })
  },

  // 处理头像选择
  onChooseAvatar(e) {
    console.log('头像选择事件:', e)
    const { avatarUrl } = e.detail
    
    if (!avatarUrl) {
      wx.showToast({
        title: '头像选择失败',
        icon: 'none'
      })
      return
    }

    // 保存临时头像
    this.setData({
      tempAvatarUrl: avatarUrl
    })
  },

  // 处理登录按钮点击
  async handleLogin() {
    try {
      // 先获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料',
        lang: 'zh_CN'
      })
      
      console.log('获取到的用户信息:', userInfo)
      
      // 选择头像
      const { tempFilePaths } = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      
      if (!tempFilePaths || tempFilePaths.length === 0) {
        wx.showToast({
          title: '请选择头像',
          icon: 'none'
        })
        return
      }
      
      // 更新用户信息，使用选择的头像和微信昵称
      const updatedUserInfo = {
        ...userInfo,
        avatarUrl: tempFilePaths[0],
        nickName: this.data.userInfo.nickName || userInfo.nickName,
        createTime: new Date()
      }
      
      // 调用云函数保存用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userInfo: updatedUserInfo
        }
      })
      
      console.log('云函数返回结果:', result)
      
      if (result.success) {
        // 保存到本地存储
        wx.setStorageSync('userInfo', updatedUserInfo)
        
        this.setData({
          userInfo: updatedUserInfo,
          isLoggedIn: true
        })
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
      } else {
        console.error('云函数返回错误:', result)
        wx.showToast({
          title: result.message || '登录失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('登录过程出错:', error)
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    }
  },

  // 处理退出登录
  async handleLogout() {
    try {
      // 调用云函数删除用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          action: 'logout'
        }
      })

      if (result.success) {
        // 清除本地存储
        wx.removeStorageSync('userInfo')
        
        // 重置页面状态
        this.setData({
          userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: '',
            // 重置其他用户信息字段
            age: '',
            gender: '',
            location: '',
            family: '',
            houseType: '',
            area: '',
            hasOutdoor: '',
            hasPetExp: '',
            currentPet: '',
            expDuration: '',
            dailyTime: '',
            hasFamilyHelp: '',
            homeFrequency: '',
            acceptableDifficulty: '',
            monthlyCost: '',
            petType: '',
            interactionExpectation: '',
            personalityExpectation: '',
            appearancePreference: '',
            lifespanExpectation: '',
            hasAllergy: '',
            foodPreference: [],
            hasOtherPets: '',
            hasOtherFactors: '',
            willingSpecialEnv: ''
          },
          isLoggedIn: false,
          tempAvatarUrl: ''
        })
        
        wx.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      wx.showToast({
        title: '退出登录失败',
        icon: 'none'
      })
    }
  },

  // 保存用户信息
  async saveProfile() {
    try {
      if (!this.data.isLoggedIn) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }

      // 调用云函数保存用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userInfo: {
            ...this.data.userInfo,
            updateTime: new Date()
          }
        }
      })

      if (result.success) {
        // 更新本地存储
        wx.setStorageSync('userInfo', result.data)
        
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('保存失败:', error)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  // 处理表单提交
  async onSubmit(e) {
    console.log('表单提交:', e)
    const { nickname } = e.detail.value
    
    if (!nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (!this.data.userInfo.avatarUrl || this.data.userInfo.avatarUrl === defaultAvatarUrl) {
      wx.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return
    }

    try {
      // 获取用户信息
      const { userInfo } = await wx.getUserProfile({
        desc: '用于完善用户资料'
      })
      
      console.log('获取到的用户信息:', userInfo)
      
      // 更新头像和昵称
      const updatedUserInfo = {
        ...userInfo,
        avatarUrl: this.data.userInfo.avatarUrl,
        nickName: nickname
      }
      
      console.log('准备保存的用户信息:', updatedUserInfo)
      
      // 调用云函数保存用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          userInfo: {
            ...updatedUserInfo,
            createTime: new Date()
          }
        }
      })
      
      console.log('云函数返回结果:', result)
      
      if (result.success) {
        // 保存到本地存储
        wx.setStorageSync('userInfo', result.data)
        
        this.setData({
          userInfo: result.data,
          isLoggedIn: true,
          showAuthButton: false
        })
        
        wx.showToast({
          title: '授权成功',
          icon: 'success'
        })
      } else {
        console.error('云函数返回错误:', result)
        wx.showToast({
          title: result.message || '授权失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('授权过程出错:', error)
      wx.showToast({
        title: error.message || '授权失败',
        icon: 'none'
      })
    }
  },

  // 跳转到详细信息页面
  navigateToDetail() {
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  }
}) 
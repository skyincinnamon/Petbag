Page({
  data: {
    userInfo: {
      // 基本信息
      age: '',
      gender: '',
      location: '',
      family: '',
      // 居住环境
      houseType: '',
      area: '',
      hasOutdoor: '',
      // 养宠经验
      hasPetExp: '',
      currentPet: '',
      expDuration: '',
      // 时间与精力
      dailyTime: '',
      hasFamilyHelp: '',
      homeFrequency: '',
      acceptableDifficulty: '',
      // 经济状况
      monthlyCost: '',
      // 宠物偏好
      petType: '',
      interactionExpectation: '',
      personalityExpectation: '',
      appearancePreference: '',
      lifespanExpectation: '',
      // 特殊需求
      hasAllergy: '',
      foodPreference: [],
      // 其他信息
      hasOtherPets: '',
      hasOtherFactors: '',
      willingSpecialEnv: ''
    },
    // 选项数据
    ageOptions: ['18岁以下', '18-25岁', '26-35岁', '36-45岁', '46岁以上'],
    genderOptions: ['男', '女', '其他'],
    locationOptions: ['城市', '郊区', '农村'],
    familyOptions: ['独居', '有少数室友（1-2位室友）', '有较多室友（3位及以上室友）', '与伴侣/家人共同生活（无老人小孩）', '与伴侣/家人共同生活（有老人小孩）'],
    houseTypeOptions: ['楼房/公寓', '平房/独栋房屋', '合租/宿舍', '其他'],
    areaOptions: ['小于50平方米', '50-100平方米', '100-150平方米', '150平方米以上'],
    outdoorOptions: ['是', '否'],
    petExpOptions: ['是', '否'],
    currentPetOptions: ['无', '猫', '狗', '其他'],
    expDurationOptions: ['不到1年', '1-3年', '3-5年', '5年以上'],
    dailyTimeOptions: ['少于1小时', '1-2小时', '2-4小时', '4小时以上'],
    familyHelpOptions: ['是', '否'],
    homeFrequencyOptions: ['每日在家', '每月有5天以内不在家', '每月有5天以上，10天以内不在家', '10天以上不在家（不建议养宠）'],
    difficultyOptions: ['新手友好', '中等难度', '高难度', '无特别要求'],
    monthlyCostOptions: ['少于500元', '500-1000元', '1000-2000元', '2000-5000元', '5000元以上'],
    petTypeOptions: ['爬行动物', '两栖动物', '小型哺乳动物', '鸟类', '水生动物', '昆虫'],
    interactionOptions: ['高互动性', '中等互动性', '低互动性'],
    personalityOptions: ['活泼好动', '温顺安静', '独立高冷', '聪明易训练', '好奇心强', '无特别要求'],
    appearanceOptions: ['颜色鲜艳', '体型小巧', '独特外形', '其他偏好', '无特别偏好'],
    lifespanOptions: ['短期（1-3年）', '中期（3-10年）', '长期（10年以上）'],
    allergyOptions: ['是', '否'],
    foodOptions: ['常规食物', '冷冻食物', '活体食物', '特殊食物'],
    otherPetsOptions: ['是', '否'],
    otherFactorsOptions: ['是', '否'],
    specialEnvOptions: ['是', '否']
  },

  onLoad() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  // 基本信息选择器
  onAgeChange(e) {
    this.setData({
      'userInfo.age': this.data.ageOptions[e.detail.value]
    })
  },

  onGenderChange(e) {
    this.setData({
      'userInfo.gender': this.data.genderOptions[e.detail.value]
    })
  },

  onLocationChange(e) {
    this.setData({
      'userInfo.location': this.data.locationOptions[e.detail.value]
    })
  },

  onFamilyChange(e) {
    this.setData({
      'userInfo.family': this.data.familyOptions[e.detail.value]
    })
  },

  // 居住环境选择器
  onHouseTypeChange(e) {
    this.setData({
      'userInfo.houseType': this.data.houseTypeOptions[e.detail.value]
    })
  },

  onAreaChange(e) {
    this.setData({
      'userInfo.area': this.data.areaOptions[e.detail.value]
    })
  },

  onOutdoorChange(e) {
    this.setData({
      'userInfo.hasOutdoor': this.data.outdoorOptions[e.detail.value]
    })
  },

  // 养宠经验选择器
  onPetExpChange(e) {
    this.setData({
      'userInfo.hasPetExp': this.data.petExpOptions[e.detail.value]
    })
  },

  onCurrentPetChange(e) {
    this.setData({
      'userInfo.currentPet': this.data.currentPetOptions[e.detail.value]
    })
  },

  onExpDurationChange(e) {
    this.setData({
      'userInfo.expDuration': this.data.expDurationOptions[e.detail.value]
    })
  },

  // 时间与精力选择器
  onDailyTimeChange(e) {
    this.setData({
      'userInfo.dailyTime': this.data.dailyTimeOptions[e.detail.value]
    })
  },

  onFamilyHelpChange(e) {
    this.setData({
      'userInfo.hasFamilyHelp': this.data.familyHelpOptions[e.detail.value]
    })
  },

  onHomeFrequencyChange(e) {
    this.setData({
      'userInfo.homeFrequency': this.data.homeFrequencyOptions[e.detail.value]
    })
  },

  onDifficultyChange(e) {
    this.setData({
      'userInfo.acceptableDifficulty': this.data.difficultyOptions[e.detail.value]
    })
  },

  // 经济状况选择器
  onMonthlyCostChange(e) {
    this.setData({
      'userInfo.monthlyCost': this.data.monthlyCostOptions[e.detail.value]
    })
  },

  // 宠物偏好选择器
  onPetTypeChange(e) {
    this.setData({
      'userInfo.petType': this.data.petTypeOptions[e.detail.value]
    })
  },

  onInteractionChange(e) {
    this.setData({
      'userInfo.interactionExpectation': this.data.interactionOptions[e.detail.value]
    })
  },

  onPersonalityChange(e) {
    this.setData({
      'userInfo.personalityExpectation': this.data.personalityOptions[e.detail.value]
    })
  },

  onAppearanceChange(e) {
    this.setData({
      'userInfo.appearancePreference': this.data.appearanceOptions[e.detail.value]
    })
  },

  onLifespanChange(e) {
    this.setData({
      'userInfo.lifespanExpectation': this.data.lifespanOptions[e.detail.value]
    })
  },

  // 特殊需求选择器
  onAllergyChange(e) {
    this.setData({
      'userInfo.hasAllergy': this.data.allergyOptions[e.detail.value]
    })
  },

  onFoodPreferenceChange(e) {
    this.setData({
      'userInfo.foodPreference': e.detail.value
    })
  },
  // 其他信息选择器
  onOtherPetsChange(e) {
    this.setData({
      'userInfo.hasOtherPets': this.data.otherPetsOptions[e.detail.value]
    })
  },

  onOtherFactorsChange(e) {
    this.setData({
      'userInfo.hasOtherFactors': this.data.otherFactorsOptions[e.detail.value]
    })
  },

  onSpecialEnvChange(e) {
    this.setData({
      'userInfo.willingSpecialEnv': this.data.specialEnvOptions[e.detail.value]
    })
  },

  // 保存用户信息
  async saveProfile() {
    try {
      // 获取当前用户信息
      const currentUserInfo = wx.getStorageSync('userInfo')
      if (!currentUserInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }

      // 准备更新的数据
      const updateData = {
        ...this.data.userInfo,
        updateTime: new Date()
      }

      // 在发送到云函数前移除 _id 字段
      if (updateData._id) {
        delete updateData._id;
      }

      // 调用云函数保存用户信息
      const { result } = await wx.cloud.callFunction({
        name: 'register',
        data: {
          action: 'updateProfile',
          userInfo: updateData
        }
      })

      if (result.success) {
        // 合并返回的更新数据与本地存储的userInfo，保留 _id
        // 注意：云函数返回的 data.userInfo 应该不包含 _id
        const updatedUserInfo = { ...currentUserInfo, ...result.data.userInfo };

        // 更新本地存储
        wx.setStorageSync('userInfo', updatedUserInfo)

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
          title: result.message || '保存失败',
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
  }
}) 
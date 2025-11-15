// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const aiHistory = require('../../utils/aiHistory')

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    inputValue: '',
    showHistory: false,
    messages: [{
      type: 'ai',
      content: '您好！我是您的异宠顾问。请告诉我您的情况和需求，我可以为您推荐合适的异宠。',
      id: 'msg-0'
    }],
    scrollIntoView: 'msg-0',
    historyList: [],
    currentSessionId: null,
    isLoggedIn: false,
    cozeConfig: {
      apiUrl: 'https://api.coze.cn/v1/workflow/run',
      workflowId: '7500614903830560787',
      botId: '7500529496949768226',
      token: 'pat_lZGdA9FdRcVdBnrwyDssZUsXZy7K8nCBOVKeoAqM58SMYxjwLuhicsRh57TuDuu6'
    },
    templates: [
      {
        title: '简洁易懂版',
        content: '我的情况是:(职业/生活节奏)，每天能照顾宠物的时间约___，想要一个(陪伴型/观赏型)的___(爬行类/昆虫类)，偏好___(温顺/易打理)',
        example: '我是社畜，每天晚上在家，想要观赏性强的鱼类，好养活的推荐？'
      },
      {
        title: '结构化提问',
        content: '1. 自身：职业/时间/环境    2. 目的：陪伴/观赏/教育\n3. 偏好：爬行/节肢/两栖    4. 要求：温顺/安静/长寿',
        example: '老师，周末空，想养观赏型小蜥蜴，预算1000内'
      },
      {
        title: '场景化提问',
        content: '我希望异宠能___(看书时陪伴/可上手/观察成长)，因为我___(有猫/过敏/喜欢夜行)',
        example: '希望晚上工作时安静陪伴，因为过敏且空间小'
      },
      {
        title: '反向排除法',
        content: '我不想要___(活体喂食/短命/味大)',
        example: '害怕虫子，不想喂活体，其他都可以'
      }
    ]
  },

  onLoad() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  async checkLoginStatus() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'checkLogin'
      });
      
      console.log('登录状态检查结果:', result);
      
      if (result && result.success && result.data) {
        // 保存用户信息到本地存储
        wx.setStorageSync('userInfo', result.data);
        
        this.setData({
          isLoggedIn: true,
          userInfo: result.data,
          hasUserInfo: true
        });
        // 加载用户历史记录
        this.loadUserHistory();
      } else {
        // 清除本地存储的用户信息
        wx.removeStorageSync('userInfo');
        
        this.setData({
          isLoggedIn: false,
          userInfo: {
            avatarUrl: defaultAvatarUrl,
            nickName: ''
          },
          hasUserInfo: false
        });
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
      // 清除本地存储的用户信息
      wx.removeStorageSync('userInfo');
      
      this.setData({
        isLoggedIn: false,
        userInfo: {
          avatarUrl: defaultAvatarUrl,
          nickName: ''
        },
        hasUserInfo: false
      });
    }
  },

  // 加载用户历史记录
  async loadUserHistory() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getUserHistory'
      });
      
      if (result.success) {
        this.setData({
          historyList: result.historyList || []
        });
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  },

  // 检查登录状态并处理操作
  checkLoginAndProceed(callback) {
    // 首先检查本地存储的登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo,
        hasUserInfo: true
      });
      if (callback) {
        callback();
      }
      return true;
    }
    
    // 如果本地没有登录信息，则跳转到登录页面
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
    return false;
  },

  // 监听页面显示
  onShow() {
    // 每次页面显示时检查用户信息是否更新
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        isLoggedIn: true  // 添加登录状态更新
      })
    } else {
      this.setData({
        userInfo: {
          avatarUrl: defaultAvatarUrl,
          nickName: ''
        },
        hasUserInfo: false,
        isLoggedIn: false  // 添加登录状态更新
      })
    }
  },

  // 跳转到个人信息页面
  navigateToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  newChat() {
    if (!this.checkLoginAndProceed()) return;
    const newSessionId = Date.now().toString();
    this.setData({
      currentSessionId: newSessionId,
      messages: [{
        type: 'ai',
        content: '您好！我是您的异宠顾问。请告诉我您的情况和需求，我可以为您推荐合适的异宠。',
        id: 'msg-0'
      }]
    });
  },

  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.setStorageSync('historyList', [])
          wx.showToast({
            title: '已清空历史记录',
            icon: 'success'
          })
        }
      }
    })
  },

  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    })
  },

  onChatAreaTap() {
    if (this.data.showHistory) {
      this.setData({
        showHistory: false
      })
    }
  },

  selectHistory(e) {
    if (!this.checkLoginAndProceed()) return;
    const { index } = e.currentTarget.dataset;
    const historyItem = this.data.historyList[index];
    
    this.setData({
      currentSessionId: historyItem.sessionId,
      messages: historyItem.messages,
      showHistory: false
    }, () => {
      this.scrollToBottom();
    });
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  scrollToBottom() {
    const lastMessageId = `msg-${this.data.messages.length - 1}`
    this.setData({
      scrollIntoView: lastMessageId
    })
  },

  async sendMessage() {
    if (!this.checkLoginAndProceed()) return;
    if (!this.data.inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: this.data.inputValue,
      id: `msg-${this.data.messages.length}`
    }

    // 添加到消息列表
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: ''
    }, () => {
      this.scrollToBottom()
    })

    // 获取AI历史记录并添加到用户输入中
    const aiHistoryContext = aiHistory.formatHistoryAsContext();
    const enhancedUserInput = userMessage.content + aiHistoryContext;

    // 构建对话历史
    const conversationHistory = this.data.messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
      .slice(-10) // 只保留最近10条消息作为上下文

    // 调用Coze工作流API
    wx.request({
      url: this.data.cozeConfig.apiUrl,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${this.data.cozeConfig.token}`,
        'Content-Type': 'application/json'
      },
      data: {
        workflow_id: this.data.cozeConfig.workflowId,
        parameters: {
          user_id: this.data.userInfo.nickName || 'anonymous',
          user_name: this.data.userInfo.nickName || 'anonymous',
          BOT_USER_INPUT: enhancedUserInput,
          bot_id: this.data.cozeConfig.botId,
          conversation_history: conversationHistory
        }
      },
      success: async (res) => {
        console.log('工作流请求参数:', {
          workflow_id: this.data.cozeConfig.workflowId,
          parameters: {
            user_id: this.data.userInfo.nickName || 'anonymous',
            user_name: this.data.userInfo.nickName || 'anonymous',
            BOT_USER_INPUT: enhancedUserInput,
            bot_id: this.data.cozeConfig.botId,
            conversation_history: conversationHistory
          }
        })
        console.log('工作流响应:', res)
        
        // 检查API响应状态
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          // 工作流调用成功
          let responseContent = '抱歉，我现在无法回答您的问题。'
          
          try {
            // 解析返回的数据
            const responseData = JSON.parse(res.data.data)
            console.log('解析后的响应数据:', responseData)
            
            // 检查响应数据的结构并格式化文本
            if (responseData && responseData.output) {
              responseContent = responseData.output
            } else if (responseData && responseData.data) {
              responseContent = responseData.data
            } else if (responseData && responseData.content) {
              responseContent = responseData.content
            } else if (responseData && responseData.message) {
              responseContent = responseData.message
            }

            // 格式化响应文本
            responseContent = responseContent
              .replace(/#/g, '')
              .replace(/\*\*([^*]+)\*\*/g, (match, p1, offset, string) => {
                const lineStart = string.lastIndexOf('\n', offset) + 1;
                const lineEnd = string.indexOf('\n', offset);
                const currentLine = string.slice(lineStart, lineEnd === -1 ? string.length : lineEnd);
                
                if (/^\d+\./.test(currentLine.trim())) {
                  return '【' + p1 + '】';
                }
                
                return '• ' + p1;
              })
              .replace(/「([^」]+)」/g, '\n$1：\n')
              .replace(/\n\s*[-•]\s*/g, '\n')
              .replace(/(\d+元)/g, '$1\n')
              .replace(/。\s*/g, '。\n')
              .replace(/！\s*/g, '！\n')
              .replace(/\n{3,}/g, '\n\n')
              .trim();

            // 保存AI回复到历史记录
            aiHistory.addAIResponse(responseContent);
            
            const aiMessage = {
              type: 'ai',
              content: responseContent,
              id: `msg-${this.data.messages.length}`
            }
            
            // 更新消息列表
            const updatedMessages = [...this.data.messages, aiMessage]
            this.setData({
              messages: updatedMessages
            }, () => {
              this.scrollToBottom()
            })

            // 保存到云数据库
            try {
              await wx.cloud.callFunction({
                name: 'saveChatHistory',
                data: {
                  sessionId: this.data.currentSessionId,
                  messages: updatedMessages,
                  lastMessage: userMessage.content
                }
              })
            } catch (error) {
              console.error('保存聊天记录失败:', error)
            }

            // 更新或创建历史记录
            const historyItem = {
              sessionId: this.data.currentSessionId,
              messages: updatedMessages,
              lastMessage: userMessage.content,
              time: new Date().toLocaleString()
            }

            // 查找是否已存在该会话的历史记录
            const historyList = [...this.data.historyList]
            const existingIndex = historyList.findIndex(item => item.sessionId === this.data.currentSessionId)
            
            if (existingIndex !== -1) {
              // 更新现有记录
              historyList[existingIndex] = historyItem
            } else {
              // 添加新记录
              historyList.unshift(historyItem)
            }

            this.setData({ historyList })
            wx.setStorageSync('historyList', historyList)
          } catch (error) {
            console.error('解析响应数据失败:', error)
            console.error('原始响应数据:', res.data.data)
          }
        } else {
          // 工作流调用失败
          console.error('工作流调用失败:', res)
          let errorMessage = '抱歉，工作流调用失败，请稍后重试。'
          
          // 根据错误码提供更具体的错误信息
          if (res.data && res.data.code) {
            switch (res.data.code) {
              case 700012006:
                errorMessage = 'Token无效或已过期，请检查token。'
                break
              case 700012007:
                errorMessage = '工作流不存在或未发布，请检查工作流ID。'
                break
              case 700012008:
                errorMessage = '参数错误，请检查请求参数。'
                break
              default:
                errorMessage = `错误码: ${res.data.code}, 信息: ${res.data.msg || '未知错误'}`
            }
          }
          
          const errorResponse = {
            type: 'ai',
            content: errorMessage,
            id: `msg-${this.data.messages.length}`
          }
          
          const updatedMessages = [...this.data.messages, errorResponse]
          this.setData({
            messages: updatedMessages
          }, () => {
            this.scrollToBottom()
          })
        }
      },
      fail: (error) => {
        console.error('API调用失败:', error)
        // 添加错误提示消息
        const errorMessage = {
          type: 'ai',
          content: '抱歉，服务暂时不可用，请稍后再试。',
          id: `msg-${this.data.messages.length}`
        }
        
        const updatedMessages = [...this.data.messages, errorMessage]
        this.setData({
          messages: updatedMessages
        }, () => {
          this.scrollToBottom()
        })
      }
    })
  },

  onTemplateClick(e) {
    if (!this.checkLoginAndProceed()) return;
    const { content } = e.currentTarget.dataset;
    this.setData({
      inputValue: content
    });
  }
})

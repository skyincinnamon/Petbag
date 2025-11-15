// AI对话历史管理工具

// 存储AI的历史回复
let aiHistory = [];

// 添加新的AI回复到历史记录
const addAIResponse = (response) => {
    aiHistory.push({
        timestamp: new Date().getTime(),
        content: response
    });
    // 保持最近10条记录
    if (aiHistory.length > 10) {
        aiHistory.shift();
    }
    // 保存到本地存储
    wx.setStorageSync('aiHistory', aiHistory);
};

// 获取所有历史记录
const getAIHistory = () => {
    return aiHistory;
};

// 清除历史记录
const clearAIHistory = () => {
    aiHistory = [];
    wx.removeStorageSync('aiHistory');
};

// 将历史记录格式化为用户输入的一部分
const formatHistoryAsContext = () => {
    if (aiHistory.length === 0) {
        return '';
    }

    let context = '\n\n=== 对话基础 ===\n';
    aiHistory.forEach((item, index) => {
        context += `[AI回复 ${index + 1}]: ${item.content}\n`;
    });
    return context;
};

// 初始化时从本地存储加载历史记录
const initAIHistory = () => {
    const savedHistory = wx.getStorageSync('aiHistory');
    if (savedHistory) {
        aiHistory = savedHistory;
    }
};

// 初始化
initAIHistory();

module.exports = {
    addAIResponse,
    getAIHistory,
    clearAIHistory,
    formatHistoryAsContext
}; 
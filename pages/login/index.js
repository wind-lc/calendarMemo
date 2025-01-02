const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    // 用户信息
    user: Object.keys(JSON.parse(wx.getStorageSync('user') || '{}')).length > 0 ? JSON.parse(wx.getStorageSync('user')) : {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    // 用户历史
    userHistory: JSON.parse(wx.getStorageSync('userHistory') || '{}'),
    userHistoryList: Object.keys(JSON.parse(wx.getStorageSync('userHistory') || '{}'))
  },
  onLoad() {
    wx.setNavigationBarTitle({title: '日历备忘录-登录'})
    const user = JSON.parse(wx.getStorageSync('user') || '{}')
    if(Object.keys(user).length > 0){
      // 跳转日历
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }
  },
  /**
   * @description: 登录
   * @param {event} event 点击事件
   * @return {void}
   */ 
  handleLogin(event){
    if(!this.data.userHistory.hasOwnProperty(this.data.user.nickName)){
      wx.setStorageSync('user', JSON.stringify(this.data.user))
      this.data.userHistory[this.data.user.nickName] = this.data.user
      wx.setStorageSync('userHistory', JSON.stringify(this.data.userHistory))
    }
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * @description: 自定义用户名头像
   * @param {event} event 事件
   * @return {void}
   */ 
  onChooseAvatar(event) {
    const { avatarUrl } = event.detail
    this.setData({
      "user.avatarUrl": avatarUrl
    })
  },
  /**
   * @description: 自定义用户名
   * @param {event} event change事件
   * @return {void}
   */ 
  onInputChange(event) {
    const nickName = event.detail.value
    this.setData({
      'user.nickName': nickName
    })
  },
  /**
   * @description: 获取用户信息
   * @param {object} user 用户信息
   * @return {void}
   */ 
  getUser(user){
    const { avatarUrl, nickName } = JSON.parse(wx.getStorageSync('user') || '{}')
    console.log(avatarUrl, nickName)
    this.setData({
      'user.avatarUrl': avatarUrl,
      'user.nickName': nickName,
      userHistory: JSON.parse(wx.getStorageSync('userHistory') || '{}'),
      userHistoryList: Object.keys(JSON.parse(wx.getStorageSync('userHistory') || '{}'))
    })
  },
  /**
   * @description: 用户历史选择
   * @param {event} event change事件
   * @return {void}
   */
  handleUserHistorySelect(event) {
    const { avatarUrl,nickName } = this.data.userHistory[this.data.userHistoryList[event.detail.value]]
    this.setData({
      'user.avatarUrl': avatarUrl,
      'user.nickName': nickName
    })
  }
})
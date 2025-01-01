const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    // 用户信息
    userInfo: Object.keys(JSON.parse(wx.getStorageSync('user') || '{}')).length > 0 ? JSON.parse(wx.getStorageSync('user')) : {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    // 用户历史
    userHistory: JSON.parse(wx.getStorageSync('userHistory') || '{}')
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
    if(!this.data.userHistory.hasOwnProperty(this.data.userInfo.nickName)){
      wx.setStorageSync('user', JSON.stringify(this.data.userInfo))
      this.data.userHistory[this.data.userInfo.nickName] = this.data.userInfo
      wx.setStorageSync('userHistory', JSON.stringify(this.data.userHistory))
    }
    wx.showToast({
      title: '登录成功！',
      icon: 'success',
      duration: 1500
    })
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
      "userInfo.avatarUrl": avatarUrl
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
      'userInfo.nickName': nickName
    })
  },
  /**
   * @description: 获取用户信息
   * @param {object} user 用户信息
   * @return {void}
   */ 
  getUserInfo(user){
    const { avatarUrl, nickName } = JSON.parse(wx.getStorageSync('user') || '{}')
    console.log(avatarUrl, nickName)
    this.setData({
      'userInfo.avatarUrl': avatarUrl,
      'userInfo.nickName': nickName
    })
    console.log(this.data.userInfo)
  }
})
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    // 已登录
    signIn: false
  },
  onLoad() {
    wx.setNavigationBarTitle({title: '日历备忘录-登录'})
    const userInfo = JSON.parse(wx.getStorageSync('userInfo') || '{}')
    if(Object.keys(userInfo).length === 0){
      // 用户登录
      this.data.signIn = false
    }else{
      this.data.signIn = true
      // 跳转日历
    }
  },
  /**
   * @description: 登录
   * @param {event} event 点击事件
   * @return {void}
   */ 
  handleLogin(event){
    console.log(this.data.userInfo)
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
      "userInfo.nickName": nickName
    })
  },
})
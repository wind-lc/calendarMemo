Page({
  data: {
    // 当前年
    currentYear: null,
    // 当前月
    currentMonth: null,
    // 当前日
    currentDate: null,
    // 当前年月日
    currentYMD: [],
    // 星期
    daysOfWeek: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], 
    // 日期
    dates: [],
    // 用户信息
    user: JSON.parse(wx.getStorageSync('user') || '{}'),
    // 选中日期
    activeDate: null,
    // 生理期天数索引
    menstruationDaysNumberIndex: null,
    // 生理期天数列表
    menstruationDaysNumberList: [...Array(14).keys()].map(i => i + 2),
    // 生理期周期索引
    menstruationCycleIndex: null,
    // 生理期周期列表
    menstruationCycleList: [...Array(44).keys()].map(i => i + 17)
  },
  onLoad(){
    // 初始化时显示当前月份
    const now = new Date()
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentDate: now.getDate(),
      currentYMD:  [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    })
    this.createCalendar(now.getFullYear(), now.getMonth() + 1)
    // 如果有记录读取天数和周期
    if(this.data.user.hasOwnProperty('menstruationDaysNumberIndex')){
      this.setData({
        menstruationDaysNumberIndex: this.data.user.menstruationDaysNumberIndex
      })
    }else{
      this.setData({
        menstruationDaysNumberIndex: 5
      })
      this.setUserStorage({ menstruationDaysNumberIndex: 5 })
    }
    if(this.data.user.hasOwnProperty('menstruationCycleIndex')){
      this.setData({
        menstruationCycleIndex: this.data.user.menstruationCycleIndex
      })
    }else{
      this.setData({
        menstruationCycleIndex: 11
      })
      this.setUserStorage({ menstruationCycleIndex: 11 })
    }
  },
  onUnload() {
    // 获取当前页面栈
    const pages = getCurrentPages()
    if (pages.length > 1) {
      // 上一个页面
      const previousPage = pages[pages.length - 2]
      if (previousPage?.getUser) {
        // 调用上一个页面的方法
        previousPage.getUser(this.data.user)
      }
    }
  },
  /**
   * @description: 创建日历
   * @param {number} year 年
   * @param {number} month 月
   * @return {void}
   */ 
  createCalendar(year, month){
    // 获取当前月的第一天是星期几
    const firstDay = new Date(year, month - 1, 1).getDay()
    // 获取当前月的总天数
    const totalDays = new Date(year, month, 0).getDate()
    // 获取当前月的最后一天是星期几
    const lastDay = new Date(year, month - 1, totalDays).getDay()
    // 计算上个月和下个月需要显示的日期
    // 上月的总天数
    const prevMonthDays = new Date(year, month - 1, 0).getDate()
    // 下个月显示的天数
    const nextMonthDays = 6 - lastDay
    let dates = []
    // 补充上个月的日期
    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      // 上一个月
      const prevMonth = month === 1 ? 12 : month - 1
      // 如果是1月，则年份减1
      const prevYear = month === 1 ? year - 1 : year
      dates.push({ 
        date: i,
        isCurrentMonth: false,
        completeMonth: `${prevYear}-${prevMonth}` 
      })
    }
    // 当前月份的日期
    for (let i = 1; i <= totalDays; i++) {
      dates.push({ 
        date: i,
        isCurrentMonth: true,
        completeMonth: `${year}-${month}`  
      })
    }
    // 补充下个月的日期
    for (let i = 1; i <= nextMonthDays; i++) {
      // 下一个月
      const nextMonth = month === 12 ? 1 : month + 1
      // 如果是12月，则年份加1
      const nextYear = month === 12 ? year + 1 : year
      dates.push({ 
        date: i,
        isCurrentMonth: false,
        completeMonth: `${nextYear}-${nextMonth}`  
      })
    }
    const { currentYMD } = this.data
    const { history } = this.data.user
    dates = dates.map(el => {
      // 今天
      if (currentYMD.join('-') === `${el.completeMonth}-${el.date}`) {
        el.isToday = true
        el.activeDate = true
        this.setData({
          activeDate: `${el.completeMonth}-${el.date}`
        })
      }
      // 有历史记录时显示
      // if (history.includes(el.completeMonth)) {
      //   if(history[el.completeMonth].includes(el.completeMonth + '-' + el.date)){
      //     el.isMenstruation = true
      //   }
      // }
      return el
    })
    console.log(dates)
    this.setData({
      dates
    })
  },
  /**
   * @description: 切换月份
   * @param {event} event 点击事件
   * @return {void}
   */ 
  changeMonth(event){
    const direction = event.currentTarget.dataset.direction
    let { currentYear, currentMonth } = this.data
    if (direction === 'prev') {
      if (currentMonth === 1) {
        currentMonth = 12
        currentYear--
      } else {
        currentMonth--
      }
    } else if (direction === 'next') {
      if (currentMonth === 12) {
        currentMonth = 1
        currentYear++
      } else {
        currentMonth++
      }
    }
    this.setData({
      currentYear: currentYear,
      currentMonth: currentMonth
    })
    this.createCalendar(currentYear, currentMonth)
  },
  /**
   * @description: 返回本月
   * @param {event} event 点击事件
   * @return {void}
   */ 
  handleToMonth(event){
    this.setData({
      currentYear: this.data.currentYMD[0],
      currentMonth: this.data.currentYMD[1]
    })
    this.createCalendar(this.data.currentYMD[0], this.data.currentYMD[1])
  },
  /**
   * @description: 当前选中日期
   * @param {event} event 点击事件
   * @return {void}
   */ 
  handleActiveDate(event){
    const index = event.currentTarget.dataset.index
    const dates = this.data.dates.map((el, i) => {
      if(i === index){
        return { ...el, activeDate: true }
      }else{
       delete el.activeDate
        return el
      }
      
    })
    this.setData({
      dates
    })
  },
  /**
   * @description: 设置用户信息存储
   * @param {object} data 数据
   * @return {void}
   */
  setUserStorage(data){
    let user = JSON.parse(wx.getStorageSync('user') || '{}')
    user = {
      ...user,
      ...data
    }
    wx.setStorageSync('user', JSON.stringify(user))
  },
  /**
   * @description: 开始经期
   * @param {event} event 点击事件
   * @return {void}
   */
  handleStartMenstruation(event){
    const { dates, menstruationDaysNumberList, menstruationDaysNumberIndex } = this.data
    let index = null
    const list = dates.map((el, i) => {
      if(el?.activeDate){
        index = i
        el.isMenstruation = true
      }
      if(index !== null && i > index && i < index + menstruationDaysNumberList[menstruationDaysNumberIndex]){
        el.isMenstruation = true
      }
      return el
    })
    this.setData({
      dates: list
    })
  },
  /**
   * @description: 更新生理期天数
   * @param {event} event change事件
   * @return {void}
   */
  updateMenstruationDaysNumber(event) {
    const index = Number(event.detail.value)
    this.setData({ menstruationDaysNumberIndex:  index})
    this.setUserStorage({ menstruationDaysNumberIndex: index})
  },
  /**
   * @description: 更新生理期周期
   * @param {event} event change事件
   * @return {void}
   */
  updateMenstruationCycle(event) {
    const index = Number(event.detail.value)
    this.setData({ menstruationCycleIndex: index })
    this.setUserStorage({ menstruationCycleIndex: index })
  }
})

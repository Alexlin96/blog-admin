// 日期格式化
export const formatDate = function(date, fmt) {
  // fmt日期格式 yyyy-MM-dd
  if (date) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
      )
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
        )
      }
    }
    return fmt
  }
  return ''
}

/**
 * @description: 获取当前的周一、周日
 * @param {*} 传入 选择日期的时间戳
 * @return {*} 返回数组 [周一, 周日]
 */
export const getNowWeek = time => {
  // 选中的时间戳
  const timestamp = time
  const serverDate = new Date(time)
  const nDay = serverDate.getDay() === 0 ? 7 : serverDate.getDay()
  // 本周周日的的时间
  const sundayTiem = timestamp + (7 - nDay) * 24 * 60 * 60 * 1000
  const SundayData = new Date(sundayTiem)
  // 年
  const tomorrowY = SundayData.getFullYear()
  // 月
  const tomorrowM =
    SundayData.getMonth() + 1 < 10
      ? '0' + (SundayData.getMonth() + 1)
      : SundayData.getMonth() + 1
  // 日
  const tomorrowD =
    SundayData.getDate() < 10
      ? '0' + SundayData.getDate()
      : SundayData.getDate()

  // 本周周一的时间
  const mondayTime = timestamp - (nDay - 1) * 24 * 60 * 60 * 1000
  const mondayData = new Date(mondayTime)
  // 年
  const mondayY = mondayData.getFullYear()
  // 月
  const mondayM =
    mondayData.getMonth() + 1 < 10
      ? '0' + (mondayData.getMonth() + 1)
      : mondayData.getMonth() + 1
  // 日
  const mondayD =
    mondayData.getDate() < 10
      ? '0' + mondayData.getDate()
      : mondayData.getDate()
  // 输出值
  return [
    mondayY + '-' + mondayM + '-' + mondayD,
    tomorrowY + '-' + tomorrowM + '-' + tomorrowD
  ]
}

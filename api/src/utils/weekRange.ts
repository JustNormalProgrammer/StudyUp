export function getWeekRange(date: Date) {
    const day = date.getDay()
    const diffToMonday = (day + 6) % 7
  
    const monday = new Date(date)
    monday.setUTCDate(date.getDate() - diffToMonday)
    monday.setUTCHours(0, 0, 0, 0)
  
    const sunday = new Date(monday)
    sunday.setUTCDate(monday.getDate() + 6)
    sunday.setUTCHours(23, 59, 59, 999)
  
    return {
      from: monday,
      to: sunday,
    }
  }
  
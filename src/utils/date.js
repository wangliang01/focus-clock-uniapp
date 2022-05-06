import dayjs from "dayjs";

/* 格式化日期 */
export function formatTime(time, format = 'YYYY-MM-DD') {
  let temp = '0000000000' + time
  let len = format.length
 
  return temp.substr(-len)
}

export function getTime(time) {
  time = time ? time : Date.now() 
  const date = dayjs(time).format('YYYY年MM月DD日 HH:mm:ss')
  return date
}
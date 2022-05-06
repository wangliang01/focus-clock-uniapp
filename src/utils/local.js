/**
 * 封装对本地存储的操作
 */

export const get = key => {
  return uni.getStorageSync(key)
}

export const set = (key, value) => {
  return uni.setStorageSync(key, value)
}

export const remove = key => {
  uni.removeStorageSync(key)
}

export const clear = () => {
  uni.clearStorageSync()
}

export default { get, set, remove, clear }

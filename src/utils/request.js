import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 表示跨域请求时是否需要携带cookies
  timeout: 6000 // 请求超时的毫秒数
})

// 请求拦截
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 携带token
      config.headers['authorization'] = 'Bearer ' + getToken() || ''
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code === 401) { // token失效 重新登录
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response && error.response.status === 401 || error.response.status === 419) {
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      return
    }
    return Promise.reject(error)
  }
)

export default service

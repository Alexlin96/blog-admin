import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // 免登录白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条

  document.title = getPageTitle(to.meta.title) // 设置页面标题

  const hasToken = getToken()
  next()
  if (hasToken) { // 存在token
    if (to.path === '/login') { // 去登录页 登录存在 直接重定向首页
      next({ path: '/' })
      next()
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) { // 用户信息拉取成功
        next()
      } else {
        try {
          await store.dispatch('user/getInfo') // 拉取用户信息
          next()
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`) // 重定向到登录页
          NProgress.done()
        }
      }
    }
  } else { // 不存在token
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

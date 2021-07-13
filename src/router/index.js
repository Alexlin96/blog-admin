import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由

 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    设置该路由进入的权限，支持多个权限叠加
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x' 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    noCache: true                如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                  如果设置为true，它则会固定在tags-view中(默认 false)
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  当路由设置了该属性，则会高亮相对应的侧边栏
  }
 */

// 不需要动态判断权限的路由，如登录页、404、等通用页面
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: ''
  }
]

// 需要动态判断权限并通过 addRoutes 动态添加的页面
export const asyncRoutes = [
  // 权限管理
  {
    path: '/user',
    component: Layout,
    name: 'user',
    meta: { title: '用户管理', icon: 'lock' },
    alwaysShow: true,
    redirect: '/user/userList',
    children: [
      {
        path: 'userList',
        component: () => import('@/views/user/userList'),
        name: 'userList',
        meta: { title: '用户列表', icon: 'lock' }
      }
    ]
  },
  // 组件库
  {
    path: '/components',
    component: Layout,
    name: 'user',
    meta: { title: '组件库', icon: 'lock' },
    alwaysShow: true,
    redirect: '/components/upload',
    children: [
      {
        path: 'upload',
        component: () => import('@/views/components/upload'),
        name: 'upload',
        meta: { title: '文件上传', icon: 'lock' }
      }
    ]
  },
  // 404 找不到页面
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
// 系统管理模块
import sysRouter from './modules/sys'
export const asyncRouterMap = [
  {
    path: '/',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/profile',
    children: [...sysRouter]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/account',
    name: 'Account',
    hidden: true,
    component: UserLayout,
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login'),
        meta: { title: '用户登录' }
      },
      {
        path: '/resetPwd',
        name: 'ResetPwd',
        component: () => import(/* webpackChunkName: "resetPwd" */ '@/views/reset-pwd'),
        meta: { title: '重置密码' }
      }
    ]
  },
  {
    path: '/basic',
    component: BasicLayout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */'@/views/profile/index'),
        meta: { title: '个人面板' },
        redirect: '/profile/info',
        hidden: true,
        children: [
          {
            path: '/profile/info',
            name: 'InfoSettings',
            component: () => import(/* webpackChunkName: "infoSettings" */ '@/views/profile/info'),
            meta: { title: '基本信息' }
          },
          {
            path: '/profile/pwd',
            name: 'PwdReset',
            component: () => import(/* webpackChunkName: "pwdReset" */ '@/views/profile/pwd'),
            meta: { title: '密码重置' }
          },
          {
            path: '/profile/log',
            name: 'UserLog',
            component: () => import(/* webpackChunkName: "userLog" */ '@/views/profile/log'),
            meta: { title: '操作日志' }
          },
          {
            path: '/profile/msg-unread',
            name: 'MsgUnread',
            component: () => import(/* webpackChunkName: "msgUnread" */ '@/views/profile/msg-unread'),
            meta: { title: '未读消息' }
          },
          {
            path: '/profile/msg-read',
            name: 'MsgRead',
            component: () => import(/* webpackChunkName: "msgRead" */ '@/views/profile/msg-read'),
            meta: { title: '已读消息' }
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/exception/404'),
    meta: { title: '404' }
  }
]

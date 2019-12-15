// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/profile',
    children: [
      {
        path: '/sys',
        name: 'system',
        component: PageView,
        meta: { title: '权限管理', icon: 'slack' },
        redirect: '/sys/resource',
        children: [
          {
            path: '/sys/resource',
            name: 'Resource',
            component: () => import('@/views/sys/Resource'),
            meta: { title: '资源管理', icon: 'dashboard', keepAlive: true, permission: [ 'sysResource' ] }
          },
          {
            path: '/sys/role',
            name: 'Role',
            component: () => import('@/views/sys/Role'),
            meta: { title: '角色管理', icon: 'skin', keepAlive: true, permission: [ 'sysRole' ] }
          },
          {
            path: '/sys/user',
            name: 'User',
            component: () => import('@/views/sys/User'),
            meta: { title: '用户管理', icon: 'user', keepAlive: true, permission: [ 'sysUser' ] }
          },
          {
            path: '/sys/user-config-roles/:userId',
            name: 'UserConfigRoles',
            hidden: true,
            component: () => import('@/views/sys/UserConfigRoles'),
            meta: { title: '配置角色', keepAlive: false, permission: [ 'sysUser:configRoles' ] }
          },
          {
            path: '/sys/role-config-resources/:roleId',
            name: 'RoleConfigResources',
            hidden: true,
            component: () => import('@/views/sys/RoleConfigResources'),
            meta: { title: '配置资源', keepAlive: false, permission: [ 'sysRole:configResources' ] }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: RouteView,
        hidden: true,
        meta: { title: 'Profile', keepAlive: true },
        redirect: '/router-view-base',
        children: [
          {
            path: '/router-view-base',
            name: 'RouterViewBase',
            component: () => import('@/views/profile/Index'),
            meta: { title: '个人面板', hideHeader: true },
            redirect: '/profile/info',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/profile/info',
                name: 'InfoSettings',
                component: () => import('@/views/profile/Info'),
                meta: { title: '基本信息' }
              },
              {
                path: '/profile/pwd',
                name: 'PwdReset',
                component: () => import('@/views/profile/pwd'),
                meta: { title: '密码重置' }
              },
              {
                path: '/profile/log',
                name: 'Log',
                component: () => import('@/views/profile/log'),
                meta: { title: '操作日志', keepAlive: true }
              }
            ]
          }
        ]
      }
    ]
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
    path: '/user',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

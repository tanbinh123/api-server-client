// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/profile',
    children: [
      {
        path: '/permission',
        name: 'Permission',
        component: PageView,
        meta: { title: '权限管理', icon: 'slack' },
        redirect: '/sys/resource',
        children: [
          {
            // path 必须配置全路径，否则左侧菜单无法匹配
            path: '/sys/resource',
            name: 'Resource',
            component: () => import(/* webpackChunkName: "resource" */ '@/views/sys/Resource'),
            meta: { title: '资源管理', icon: 'dashboard', permission: [ 'sysResource' ] }
          },
          {
            path: '/sys/role',
            name: 'Role',
            component: () => import(/* webpackChunkName: "role" */ '@/views/sys/Role'),
            meta: { title: '角色管理', icon: 'skin', permission: [ 'sysRole' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/role/config-resources/:roleId',
                name: 'RoleConfigResources',
                hidden: true,
                component: () => import(/* webpackChunkName: "roleConfigResources" */ '@/views/sys/RoleConfigResources'),
                meta: { title: '配置资源', permission: [ 'sysRole:configResources' ] }
              }
            ]
          },
          {
            path: '/sys/user',
            name: 'User',
            component: () => import(/* webpackChunkName: "user" */ '@/views/sys/User'),
            meta: { title: '用户管理', icon: 'user', permission: [ 'sysUser' ] },
            hideChildrenInMenu: true,
            children: [
              {
                path: '/sys/user/config-roles/:userId',
                name: 'UserConfigRoles',
                hidden: true,
                component: () => import(/* webpackChunkName: "userConfigRoles" */ '@/views/sys/UserConfigRoles'),
                meta: { title: '配置角色', permission: [ 'sysUser:configRoles' ] }
              }
            ]
          }
        ]
      },
      {
        path: '/manage',
        name: 'Manage',
        component: PageView,
        meta: { title: '系统运维', icon: 'setting' },
        redirect: '/sys/log',
        children: [
          {
            path: '/sys/log',
            name: 'Log',
            component: () => import(/* webpackChunkName: "log" */ '@/views/sys/Log'),
            meta: { title: '操作日志', icon: 'dashboard', permission: [ 'sysLog' ] }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */'@/views/profile/Index'),
        meta: { title: '个人面板' },
        redirect: '/profile/info',
        hidden: true,
        children: [
          {
            path: '/profile/info',
            name: 'InfoSettings',
            component: () => import(/* webpackChunkName: "infoSettings" */ '@/views/profile/Info'),
            meta: { title: '基本信息' }
          },
          {
            path: '/profile/pwd',
            name: 'PwdReset',
            component: () => import(/* webpackChunkName: "pwdReset" */ '@/views/profile/Pwd'),
            meta: { title: '密码重置' }
          },
          {
            path: '/profile/log',
            name: 'UserLog',
            component: () => import(/* webpackChunkName: "userLog" */ '@/views/profile/Log'),
            meta: { title: '操作日志' }
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
    path: '/account',
    name: 'Account',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
        meta: { title: '用户登录' }
      },
      {
        path: '/resetPwd',
        name: 'ResetPwd',
        component: () => import(/* webpackChunkName: "resetPwd" */ '@/views/ResetPwd'),
        meta: { title: '重置密码' }
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

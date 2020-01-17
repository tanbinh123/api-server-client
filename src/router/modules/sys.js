import { PageView } from '@/layouts'
import { permission, dict, log, msgType, ops, resource } from '@/core/icons'
const sysRouter = [
  {
    path: '/permission',
    name: 'Permission',
    component: PageView,
    meta: { title: '权限管理', icon: permission },
    redirect: '/sys/resource',
    children: [
      {
        // path 必须配置全路径，否则左侧菜单无法匹配
        path: '/sys/resource',
        name: 'Resource',
        component: () => import(/* webpackChunkName: "resource" */ '@/views/sys/resource'),
        meta: { title: '资源管理', icon: resource, permission: [ 'sysResource' ] }
      },
      {
        path: '/sys/role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "role" */ '@/views/sys/role'),
        meta: { title: '角色管理', icon: 'skin', permission: [ 'sysRole' ] },
        hideChildrenInMenu: true,
        children: [
          {
            path: '/sys/role/config-resources/:roleId',
            name: 'RoleConfigResources',
            hidden: true,
            component: () => import(/* webpackChunkName: "roleConfigResources" */ '@/views/sys/role-config-resources'),
            meta: { title: '配置资源', permission: [ 'sysRole:configResources' ] }
          }
        ]
      },
      {
        path: '/sys/user',
        name: 'User',
        component: () => import(/* webpackChunkName: "user" */ '@/views/sys/user'),
        meta: { title: '用户管理', icon: 'user', permission: [ 'sysUser' ] },
        hideChildrenInMenu: true,
        children: [
          {
            path: '/sys/user/config-roles/:userId',
            name: 'UserConfigRoles',
            hidden: true,
            component: () => import(/* webpackChunkName: "userConfigRoles" */ '@/views/sys/user-config-roles'),
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
    meta: { title: '系统运维', icon: ops },
    redirect: '/sys/log',
    children: [
      {
        path: '/sys/log',
        name: 'Log',
        component: () => import(/* webpackChunkName: "log" */ '@/views/sys/log'),
        meta: { title: '操作日志', icon: log, permission: [ 'sysLog' ] }
      },
      {
        path: '/sys/data-dict',
        name: 'DataDict',
        component: () => import(/* webpackChunkName: "dataDict" */ '@/views/sys/data-dict'),
        meta: { title: '数据字典', icon: dict, permission: [ 'sysLog' ] }
      },
      {
        path: '/sys/msg-type',
        name: 'MsgType',
        component: () => import(/* webpackChunkName: "msgType" */ '@/views/sys/msg-type'),
        meta: { title: '消息类型', icon: msgType, permission: [ 'sysMsgType' ] }
      }
    ]
  }
]
export default sysRouter

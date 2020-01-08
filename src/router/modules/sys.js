import { PageView } from '@/layouts'
const sysRouter = [
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
      },
      {
        path: '/sys/data-dict',
        name: 'DataDict',
        component: () => import(/* webpackChunkName: "dataDict" */ '@/views/sys/DataDict'),
        meta: { title: '数据字典', icon: 'dashboard', permission: [ 'sysLog' ] }
      },
      {
        path: '/sys/msg-type',
        name: 'MsgType',
        component: () => import(/* webpackChunkName: "msgType" */ '@/views/sys/MsgType'),
        meta: { title: '消息类型', icon: 'dashboard', permission: [ 'sysMsgType' ] }
      }
    ]
  }
]
export default sysRouter

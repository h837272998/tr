import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import PersonalLayout from '@/personalLayout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
    meta: { title: '登录页' },
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    name: 'Register',
    meta: { title: '注册账号' },
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/forget'),
    name: 'Forget',
    meta: { title: '忘记密码！' },
    hidden: true
  },
  {
    path: '/resourceRegion',
    component: Layout,
    redirect: '/resourceRegion/all',
    name: 'Resource',
    meta: { title: '共享区', icon: 'example' },
    children: [
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '全部资源区' }
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '教师共享区' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '学生共享区' }
      },
      {
        path: 'elective',
        name: 'Elective',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '选修共享区' }
      },{
        path: 'search',
        name: 'Search',
        component: () => import('@/views/resource-region/search/index'),
        meta: {
          title: '搜索', top: true
        },
        hidden: true
      },{
        path: 'show-info/:username',
        name: 'showInfo',
        component: () => import('@/views/personal/common/show-info'),
        hidden: true,
        meta: {title: '个人信息', top: true}
      }
    ]
  },

  {
    path: '/communication',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Communication',
        component: () => import('@/views/communication-region/index'),
        meta: { title: '交流区' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '帮助', icon: 'link' }
      }
    ]
  },
  {
    path: '/personal/common',
    component: PersonalLayout,
    redirect: '/personal/common/p-sharep',
    meta: { title: '常用链接', icon: 'chart'},
    children: [ {
      path: 'show-info',
      name: 'showInfo',
      component: () => import('@/views/personal/common/show-info'),
      meta: { title: '个人信息' }
    }, {
      path: 'p-share',
      name: 'PShare',
      component: () => import('@/views/personal/common/publication'),
      meta: { title: '我的发布' }
    },{
      path: 'discussion',
      name: 'Discussion',
      component: () => import('@/views/personal/common/discuss'),
      meta: { title: '我的评论' }
    }, {
      path: 'participation',
      name: 'participation',
      component: () => import('@/views/personal/common/join'),
      meta: { title: '我的参与' }
    }, {
      path: 'info',
      name: 'Info',
      hidden: true,
      component: () => import('@/views/personal/common/info'),
      meta: { title: '修改信息' }
    }]
  },
  {
    path: '/personal/operate',
    component: PersonalLayout,
    redirect: '/personal/operate/share',
    meta: { title: '操作', icon: 'edit' },
    children: [
      {
        path: 'share',
        name: 'Share',
        component: () => import('@/views/personal/operation/create'),
        meta: { title: '发布共享' }
      },
      {
        path: 'communicate',
        name: 'Communicate',
        component: () => import('@/views/personal/operation/create-comm'),
        meta: { title: '发布交流' }
      }, {
        path: 'recycle',
        name: 'Recycle',
        component: () => import('@/views/personal/operation/recycle'),
        meta: { title: '回收站' }
      },  {
        path: 'collect',
        name: 'Collect',
        component: () => import('@/views/personal/operation/collect'),
        meta: { title: '收藏夹' }
      }, {
        path: 'edit/:id(\\d+)',
        name: 'Edit',
        hidden: true,
        component: () => import('@/views/personal/operation/edit'),
        meta: {title: '编辑', hidden: true}
      }, {
        path: 'editComm/:id(\\d+)',
        name: 'Edit',
        hidden: true,
        component: () => import('@/views/personal/operation/edit-comm'),
        meta: {title: '编辑', hidden: true}
      }, {
        path: 'char',
        name: 'Char',
        component: ()=> import('@/views/article/char'),
        meta: {
          title: '私信', top: true, hidden: true
        }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/resourceRegion/all',
    meta: { title: '教学资源共享'},
    hidden: true,
    children: [
      {
        path: 'notFound',
        name: 'NotFound',
        component: ()=> import('@/views/article/notFound'),
        meta: {
          title: '文章不存在', top: true,
        }
      },
      {
        path: ':id(\\d+)',
        name: 'Article',
        component: ()=> import('@/views/article/index'),
        meta: {
          title: '分享', top: true,
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const menuRouter = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
    meta: { title: '登录页' },
    hidden: true
  },
  {
    path: '/resourceRegion',
    component: Layout,
    redirect: '/resourceRegion/all',
    name: 'Resource',
    meta: { title: '共享区', icon: 'example' },
    children: [
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '全部资源区' }
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '教师共享区' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '学生共享区' }
      },
      {
        path: 'elective',
        name: 'Elective',
        component: () => import('@/views/resource-region/index'),
        meta: { title: '选修共享区' }
      }
    ]
  },

  {
    path: '/communication',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Communication',
        component: () => import('@/views/communication-region/index'),
        meta: { title: '交流区' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '帮助', icon: 'link' }
      }
    ]
  },
  {
    path: '/personal',
    component: PersonalLayout,
    name: 'Personal',
    redirect: 'index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/personal/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  }
]


const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

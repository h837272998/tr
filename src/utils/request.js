import axios from 'axios'
import { MessageBox, Message,Notification } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, getRefreshToken } from '@/utils/auth'
import { isEmpty } from '@/utils'
// axios.defaults.retry = 5
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout,
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (!isEmpty(store.getters.token)) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      config.headers['RF'] = getRefreshToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if the token is exist,
    if (!isEmpty(response.data.token)) {
      console.info("store the token！")
      store.dispatch('user/setToken', response.data.token)
    }

    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      console.info('code!=200', res)
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401 || res.code === 403 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      // if (res.msg) {
      //   Message({
      //     message: res.msg || 'success',
      //     type: 'success',
      //     duration: 5 * 1000
      //   })
      // }
      return Promise.resolve(res)
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = error.response.data.msg ||'（400）请求错误！'
          break
        case 401:
          error.message = error.response.data.msg ||'（401）请先登录！'
          break
        case 403:
          error.message = error.response.data.msg ||'（403）无权限！'
        case 404:
          error.message = error.response.data.msg ||'（404）地址出错！'
          break
        case 500:
          error.message = error.response.data.msg ||'（500）服务器内部错误'
          break
        default:
          error.message = '服务器繁忙(' + error.message + ')'
      }
    }

    if (error.response&&error.response.status === 401) {
      MessageBox.confirm('是否跳转登录页面！', '提示', {
        confirmButtonText: '跳转',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          // location.reload()
          const path = router.currentRoute.path
          const routeUrl = router.resolve({
            path: `/login?redirect=${router.currentRoute.path}`,
          })
          location.assign(`/login?redirect=${path}`)
          window.open(routeUrl .href, '_blank')
        })
      });
    }

    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
      error.message = '连接超时，服务器繁忙！'
    }

    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

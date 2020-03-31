import request from '@/utils/request'

export function loginByUser(data) {
  return request({
    url: '/a/login',
    method: 'post',
    data: data,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dHI6c2VjcmV0'
    }
  })
}

export function loginByMobile(data) {
  return request({
    url: '/a/loginMobile',
    method: 'post',
    data: data,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dHI6c2VjcmV0'
    }
  })
}

export function getInfo() {
  return request({
    url: 'a/users/info',
    method: 'get'
  })
}
export function getInfoV1() {
  return request({
    url: 'a/users/info-v1',
    method: 'get'
  })
}
export function getInfoV2(username) {
  return request({
    url: `a/users/info-v2/${username}`,
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/a/logout',
    method: 'get'
  })
}

export function getSms(mobile) {
  return request({
    url: `/a/code/sms?mobile=${mobile}`,
    method: 'get'
  })
}
// 生产图像验证码链接
export function imageUrl (key, version) {
  return 'api/a/code/image?key=' + key + '&version=' + version
}

export function getAvatar(username) {
  return request({
    url: `/a/users/avatar/${username}`,
    method: 'get'
  })
}

export function checkUsernameOrPhone(type,value) {
  return request({
    url: `/a/users/check/${type}?value=${value}`,
    mothod: 'get'
  })
}
export function register(sysUser) {
  return request({
    url: `/a/users/register?mobile=${sysUser.mobile}&smsCode=${sysUser.validcode}`,
    method: 'post',
    data: sysUser
  })
}
export function forget(sysUser) {
  return request({
    url: `/a/users/forget?mobile=${sysUser.mobile}&smsCode=${sysUser.validcode}&password=${sysUser.password}`,
    method: 'get',
  })
}

export function updateAvatar(url) {
  return request({
    url: `/a/users/avatar`,
    method: 'put',
    data: {url: url},
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
  })
}

export function updateSysUser(sysUser) {
  return request({
    url: `/a/users`,
    method: 'put',
    data: sysUser
  })
}

export function changeMobileFirst(mobile,smsCode) {
  return request({
    url: `/a/users/changeMobileFirst?mobile=${mobile}&smsCode=${smsCode}`,
    method: 'post'
  })
}

export function changeMobileNext(mobile, oldMobile, smsCode) {
  return request({
    url: `/a/users//changeMobileNext?mobile=${mobile}&oldMobile=${oldMobile}&smsCode=${smsCode}`,
    method: 'post'
  })
}

export function summaryInfo(username) {
  return request({
    url: `/a/users/summary/${username}`,
    method: 'get'
  })
}

export function getFriend() {
  return request({
    url: `/a/users/friend`,
    method: 'get'
  })
}
export function putFriend(username) {
  return request({
    url: `/a/users/friend?username=${username}`,
    method: 'put'
  })
}

export function pullUnreadMessage() {
  return request({
    url: '/r/ws/pullUnreadMessage',
    method: 'get'
  })
}

export function getTeacherList() {
  return request({
    url: '/a/users/teacher',
    method: 'get'
  })
}

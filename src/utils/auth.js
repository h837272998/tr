import Cookies from 'js-cookie'

const accessToken = 'access_token'
const refreshToken = 'refresh_token'

export function getToken() {
  return Cookies.get(accessToken)
}

export function setToken(token) {
  return Cookies.set(accessToken, token)
}

export function removeToken() {
  return Cookies.remove(accessToken)
}

export function getRefreshToken() {
  return Cookies.get(refreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshToken, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshToken)
}

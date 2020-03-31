import { loginByUser, loginByMobile, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {isEmpty} from "@/utils";
import {Message} from "element-ui";

const getDefaultState = () => {
  return {
    token: getToken(),
    refresh_token: getRefreshToken(),
    name: '',
    username: '',
    avatar: '',
    type: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    removeToken()
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      if (!isEmpty(userInfo.buttonMessage)) {
        loginByMobile(userInfo).then(response => {
          const { data } = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      } else {
        loginByUser(userInfo).then(response => {
          const { data } = response
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { username, realName, avatar, roles , type } = data

        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // extract code filed in roles.
        // data.roles = roles.map(role => { return role.code })
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', realName)
        commit('SET_AVATAR', avatar)
        commit('SET_TYPE', type )
        commit('SET_USERNAME', username)
        resolve(data)
      }).catch(error => {
        // remove cookie's expired token
        if (error.status === 401) {
          commit('RESET_STATE')
        }
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    const _this = this
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.info(_this.state.char.stomp)
        if (!isEmpty(_this.state.char.stomp)) {
          _this.state.char.stomp.disconnect(() => {
            Message.warning("断开聊天连接!")
          });
          _this.state.char.stomp = null
        }
        removeToken(); // must remove  token  first
        removeRefreshToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setToken({ commit }, token) {
    commit('SET_TOKEN', token.access_token)
    commit('SET_REFRESH_TOKEN', token.refresh_token)
    setToken(token.access_token)
    setRefreshToken(token.refresh_token)
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeRefreshToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


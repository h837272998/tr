import Cookies from 'js-cookie'

const state = {
  topbar: {
    withoutAnimation: false
  },
  personalSidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  personalNavbar: {
    opened: Cookies.get('navbarStatus')? !!+Cookies.get('navbarStatus') : true,
  },
  device: 'desktop',
}

const mutations = {
  TOGGLE_PERSONAL_SIDEBAR: state => {
    state.personalSidebar.opened = !state.personalSidebar.opened
    state.personalSidebar.withoutAnimation = false
    if (state.personalSidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_PERSONAL_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.personalSidebar.opened = false
    state.personalSidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_PERSONAL_NAVBAR: state => {
    state.personalNavbar.opened = !state.personalNavbar.opened
    if (state.personalNavbar.opened) {
      Cookies.set('navbarStatus', 1)
    } else {
      Cookies.set('navbarStatus', 0)
    }
  },
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  closePersonalSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_PERSONAL_SIDEBAR', withoutAnimation)
  },
  togglePersonalSideBar({ commit }, device) {
    commit('TOGGLE_PERSONAL_SIDEBAR', device)
  },
  togglePersonalNavbar({ commit }, device) {
    commit('TOGGLE_PERSONAL_NAVBAR', device)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

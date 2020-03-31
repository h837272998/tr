const getters = {
  personalSidebar: state => state.app.personalSidebar,
  personalNavbar: state => state.app.personalNavbar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  topbar: state => state.app.topbar,
  topbarList: state => state.app.topbarList,
  device: state => state.app.device,
  token: state => state.user.token,
  roles: state => state.user.roles,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  name: state => state.user.name,
  userType: state => state.user.type,
  smsTime: state => state.settings.smsTime
}
export default getters

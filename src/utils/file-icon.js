const req = require.context('../../public/image/file-icon', false, /\.png$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.png/

const fileIcons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default fileIcons

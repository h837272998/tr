import request from '@/utils/request'

export function getCategory() {
  return request({
    url: '/r/article/category',
    method: 'get'
  })
}

export function addArticle(data) {
  return request({
    url: '/r/article/',
    method: 'post',
    data: data
  })
}
export function personArticle(data) {
  return request({
    url: '/r/article/person',
    method: 'get',
    params: data
  })
}

export function oneArticle(id) {
  return request({
    url: `/r/article/${id}`,
    method: 'get'
  })
}

export function updateStatus(id, status) {
  return request({
    url: `/r/article/${id}?status=${status}`,
    method: 'put'
  })
}

export function addClick(id) {
  return request({
    url: `/r/article/addLook/${id}`,
    method: 'put'
  })
}

export function addDiscuss(id, query) {
  return request({
    url: `/r/article/addDiscuss/${id}`,
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
  })
}


export function getDiscuss(id,page,topParentId) {
  return request({
    url: `/r/article/discuss/${id}?page=${page}&topParentId=${topParentId}`,
    method: 'get'
  })
}

export function getArticleList(query) {
  return request({
    url: `/r/article`,
    // ?current=${query.current}&region=${query.region}
    //       &category=${query.category}&orderBy=${query.orderBy}&collegeId=${query.collegeId}
    //       &majorId=${query.majorId}&courseId=${query.courseId}`,
    method: 'get',
    params: query
  })
}

export function getRegionNumber() {
  return request({
    url: `/r/article/region`,
    method: 'get'
  })
}

export function getSearch(query) {
  return request({
    url: `/r/search/v1`,
    method: 'get',
    params: query
  })
}

export function getHeat() {
  return request({
    url: `/r/article/heat`,
    method: 'get'
  })
}
export function getPersonArchive(username) {
  return request({
    url: `/r/article/archive/${username}`,
    method: 'get'
  })
}

export function leaderboard(username) {
  return request({
    url: `/r/article/leaderboard/${username}`,
    method: 'get'
  })
}

export function personDiscuss(query) {
  return request({
    url: `/r/person/discuss`,
    method: 'get',
    params: query
  })
}
export function personJoin(query) {
  return request({
    url: `/r/person/join`,
    method: 'get',
    params: query
  })
}

export function getPersonDiscussNotifyList(id,query) {
  return request({
    url: `/r/person/discuss/${id}`,
    method: 'get',
    params: query
  })
}

export function deleteNotify(id) {
  return request({
    url: `/r/person/discuss/${id}`,
    method: 'delete'
  })
}

export function getPersonJoinNotifyUnder(id, query) {
  return request({
    url: `/r/person/join/${id}`,
    method: 'get',
    params: query
  })
}

export function getParentFloor(id) {
  return request({
    url: `r/person/getParentFloor/${id}`,
    method: 'get'
  })
}

export function getRecycle(query) {
  return request({
    url: `r/article/recycle`,
    method: 'get',
    params: query
  });
}

export function deleteOne(articleId) {
  return request({
    url: `r/article/${articleId}`,
    method: 'delete'
  })
}

export function notify() {
  return request({
    url: 'r/person/notify',
    method: 'get'
  })
}

export function addGood(articleId, type) {
  return request({
    url: `/r/article/addGood/${articleId}?type=${type}`,
    method: 'get'
  })
}

export function addCollect(articleId) {
  return request({
    url: `/r/article/addCollect/${articleId}`,
    method: 'get'
  })
}

export function getCollect(current,limit) {
  return request({
    url: `/r/article/getCollectList?current=${current}&limit=${limit}`,
    method: 'get'
  })
}

export function deleteCollect(articleId) {
  return request({
    url: `/r/article/collect/${articleId}`,
    method: 'delete'
  })
}

export function index(order) {
  return request({
    url: `/r/article/index/${order}`,
    method: 'get'
  })

}

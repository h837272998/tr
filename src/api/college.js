import request from '@/utils/request'

export function college() {
  return request({
    url: '/r/colleges',
    method: 'get',
  })
}

export function getMajorByCollege(id) {
  return request({
    url: `/r/colleges/major/${id}`,
    method: 'get'
  })
}

export function getCourseByMajor(id) {
  return request({
    url: `/r/colleges/course/${id}`,
    method: 'get'
  })
}

export function getInfoCollege(username) {
  return request({
    url: `/r/colleges/com/${username}`,
    method: 'get'
  })
}

export function addCourse(data) {
  return request({
    url: '/r/colleges/addCourse',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

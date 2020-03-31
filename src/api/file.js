import request from '@/utils/request'

export function upload_v1(query) {
  return request({
    url: '/f/files/upload-v1',
    method: 'post',
    data: query,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export function download_v1(id) {
  return request({
    url: `/f/files/get-v1?fileId=${id}`,
    method: 'get'
  })
}

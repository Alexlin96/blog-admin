import request from '@/utils/request'

/*
  文件切片上传
*/
export function uploadFile(data, callback) {
  return request({
    url: '/api/upload',
    method: 'post',
    data,
    onDownloadProgress: function(progressEvent) {
      callback(progressEvent)
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 文件切片合并
export function mergeFile(data) {
  return request({
    url: '/api/merge',
    method: 'post',
    data
  })
}

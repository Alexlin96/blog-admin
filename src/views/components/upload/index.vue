<template>
  <div class="upload g-container">
    <el-upload
      action="#"
      class="upload-demo"
      drag
      :show-file-list="false"
      :limit="100"
      :before-upload="beforeUpload"
      :http-request="uploadFn"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div style="width: 300px">
      总进度：
      <el-progress :percentage="totalPercent" />
      切片进度：
      <div v-for="item in chunkList" :key="item">
        <span>{{ item.chunkName }}：</span>
        <el-progress :percentage="item.percent" />
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFile, mergeFile } from '@/api/upload'
export default {
  name: 'Upload',
  data() {
    return {
      fileSize: 0, // 当前上传文件大小
      chunkList: []
    }
  },
  computed: {
    totalPercent() { // 总进度 各个切片百分比 * 各个切片的大小 / 文件总大小
      const { chunkList, fileSize } = this
      if (chunkList.length === 0) return 0
      const loaded = chunkList.map(({ size, percent }) => size * percent).reduce((pre, next) => pre + next)
      return parseInt((loaded / fileSize).toFixed(2))
    }
  },
  methods: {
    // 文件上传 - 上传文件之前的钩子
    beforeUpload(file) {
      return true
    },
    // 上传
    uploadFn(data) {
      console.log('上传的文件', data)
      const fileChunkList = this.createChunkFn(data.file, 5 * 1024 * 1024) // 1M
      const chunkList = fileChunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${data.file.name}-${index}`,
        fileName: data.file.name,
        index
      }))
      this.chunkList = chunkList
      this.fileSize = data.file.size
      this.uploadChunkFn(chunkList, data.file)
    },
    // 文件进行切片
    createChunkFn(file, size = 5 * 1024 * 1024) {
      const chunkList = []
      let cur = 0
      while (cur < file.size) {
        // 使用slice方法切片
        chunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return chunkList
    },
    // 上传切片
    async uploadChunkFn(arr, file, size = 5 * 1024 * 1024) {
      const requestList = arr.map(({ file, fileName, index, chunkName }) => {
        const params = new FormData()
        params.append('file', file)
        params.append('fileName', fileName)
        params.append('chunkName', chunkName)
        return { params, index }
      }).map(({ params, index }) => {
        uploadFile(params, ev => {
          arr[index].percent = parseInt(String((ev.loaded / ev.total) * 100))
        })
      })
      await Promise.all(requestList)
      this.mergeChunkFn(file, size)
      this.$message.success('全部上传成功')
    },
    // 切片合并
    mergeChunkFn(file, size) {
      const { name } = file
      const params = {
        size,
        fileName: name
      }
      mergeFile(params).then(res => {})
    }
  }
}
</script>

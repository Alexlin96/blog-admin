<template>
  <div class="webInfo">
    <el-form ref="ruleForm" :model="formData" label-width="80px">
      <el-form-item prop="title" label="标题">
        <el-input v-model="formData.title" size="small" placeholder="请输入网站标题" clearable />
      </el-form-item>
      <el-form-item prop="keywords" label="关键字">
        <el-input v-model="formData.keywords" size="small" placeholder="请输入网站关键字" clearable />
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <el-input v-model="formData.description" size="small" placeholder="请输入网站描述" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'WebInfo',
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    formData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
  }
}
</script>

<template>
  <div class="quarterPicker wrap">
    <el-popover v-model="pickerVisible" popper-class="gt-date-wrap" placement="bottom" trigger="click">
      <div class="dateWrap" @click.stop>
        <div class="header">
          <el-button type="text" icon="el-icon-d-arrow-left" class="arrow-btn" @click="goPrev" />
          <div class="yearWrap">
            <span class="yeartext">{{ currentYear }}年</span>
          </div>
          <el-button type="text" icon="el-icon-d-arrow-right" class="arrow-btn" @click="goNext" />
        </div>
        <el-button :disabled="isDisabled(1)" class="btn" style="margin-left:10px;" @click="handlePick(1)">
          <span :class="checkBtn && quarter === 1 ? 'check-btn' : ''">Q1</span>
        </el-button>
        <el-button :disabled="isDisabled(4)" class="btn" @click="handlePick(4)">
          <span :class="checkBtn && quarter === 2 ? 'check-btn' : ''">Q2</span>
        </el-button>
        <el-button :disabled="isDisabled(7)" class="btn" @click="handlePick(7)">
          <span :class="checkBtn && quarter === 3 ? 'check-btn' : ''">Q3</span>
        </el-button>
        <el-button :disabled="isDisabled(10)" class="btn" @click="handlePick(10)">
          <span :class="checkBtn && quarter === 4 ? 'check-btn' : ''">Q4</span>
        </el-button>
      </div>
      <div slot="reference">
        <el-date-picker ref="datePicker" v-model="store" v-bind="$attrs" :readonly="true" type="date" :format="innerFormat" v-on="$listeners" @click="showQuarterPicker" />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'QuarterPicker',
  inheritAttrs: false,
  props: {
    value: {
      type: [Array, String, Date],
      default: ''
    },
    disabledDate: {
      type: Object,
      default: () => {
        return {
          type: 'ne', // ne 不禁用 gt大于 lt小于
          date: '' // 对比值
        }
      }
    }
  },
  data() {
    return {
      quarter: '', //  当前选择季度
      currentYear: '', // 当前选择年份
      pickerVisible: false // 悬浮窗
    }
  },
  computed: {
    store: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    // 格式化
    innerFormat() {
      const { currentYear, quarter } = this
      return `${currentYear}-Q${quarter}`
    },
    // 选中
    checkBtn() {
      const { currentYear, quarter } = this
      const { store } = this
      if (store && store.toString() !== 'Invalid Date') {
        const newCurrentYear = store.getFullYear()
        const newQuarter = this.getQuarterStartMonth(store.getMonth() + 1)
        if (newCurrentYear === currentYear && newQuarter === quarter) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 禁用
    isDisabled() {
      return (month) => {
        const { type, date } = this.disabledDate
        const { currentYear } = this
        if (type !== 'ne' && date && date.toString() !== 'Invalid Date') {
          const times = date.getTime()
          const diffTimes = new Date(currentYear, month - 1, 1).getTime()
          if (type === 'gt') {
            // 大于禁用
            if (times <= diffTimes) {
              return false
            } else {
              return true
            }
          } else if (type === 'lt') {
            // 小于禁用
            if (times >= diffTimes) {
              return false
            } else {
              return true
            }
          }
        } else {
          return false
        }
      }
    }
  },
  watch: {
    store: {
      handler() {
        this.$nextTick(() => {
          this.updateInnerState()
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 默认值初始化
    updateInnerState() {
      const picker = this.$refs.datePicker
      const date = picker.parsedValue
      const currDate =
        date && date.toString() !== 'Invalid Date' ? date : new Date()
      this.currentYear = currDate.getFullYear()
      this.quarter = this.getQuarterStartMonth(currDate.getMonth() + 1)
    },
    // 获取季度数
    getQuarterStartMonth(month) {
      let quarterStartMonth = 0
      if (month < 4) {
        quarterStartMonth = 1
      }
      if (month > 3 && month < 7) {
        quarterStartMonth = 4
      }
      if (month > 6 && month < 10) {
        quarterStartMonth = 7
      }
      if (month > 9) {
        quarterStartMonth = 10
      }
      return (quarterStartMonth - 1) / 3 + 1
    },
    // 上一年
    goPrev() {
      this.currentYear -= 1
    },
    // 下一年
    goNext() {
      this.currentYear += 1
    },
    // 季度选择
    handlePick(month) {
      const { currentYear } = this
      this.store = new Date(currentYear, month - 1, 1)
      this.quarter = (+month - 1) / 3 + 1
      this.pickerVisible = false
    },
    // 悬浮窗
    showQuarterPicker() {
      this.pickerVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.gtQuarterDatepicker {
  display: inline-block;
}
.gt-date-wrap {
  width: 100%;
  height: 240px;
  .dateWrap {
    width: 100%;
    height: 100%;
    .header {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 43px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 12px;
      .yearWrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .yeartext {
          color: #606266;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
    .el-button.arrow-btn {
      width: 20px;
      color: #303133;
      font-size: 12px;
    }
    .el-button.btn {
      display: inline-flex;
      border: 0;
      width: 45%;
      height: 80px;
      padding: 10px;
      justify-content: center;
      align-items: center;
    }
    .el-button span {
      padding: 10px;
    }
    .el-button .check-btn {
      background-color: #409eff;
      color: #fff;
      border-radius: 50%;
    }
    .el-button.btn:hover {
      background-color: #fff;
    }
    .el-button.btn:focus {
      background-color: #fff;
    }
  }
}

</style>

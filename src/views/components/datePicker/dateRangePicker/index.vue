<template>
  <div class="dateRangePicker" style="display:flex">
    <div v-show="date_Type === 'date' || date_Type === 'all'">
      <el-date-picker
        v-model="date_day"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :clearable="false"
        :class="dateClass"
      />
    </div>
    <div v-show="date_Type === 'week'">
      <el-date-picker
        v-model="date_week[0]"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周"
        :picker-options="{
          firstDayOfWeek: 1,
          disabledDate: disabledDateByWeek_1
        }"
        style="width:180px;"
        :clearable="false"
        :class="dateClass"
      />
      <span style="margin:5px 10px;">-</span>
      <el-date-picker
        v-model="date_week[1]"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周"
        :picker-options="{
          firstDayOfWeek: 1,
          disabledDate: disabledDateByWeek_2
        }"
        style="width:180px;"
        :clearable="false"
        :class="dateClass"
      />
    </div>
    <div v-show="date_Type === 'month'">
      <el-date-picker
        v-model="date_month"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM"
        :clearable="false"
        :class="dateClass"
      />
    </div>
    <el-select v-if="type === 'base'" v-model="date_Type" style="margin-left:10px">
      <el-option key="Day" label="Day" value="date" />
      <el-option key="Week" label="Week" value="week" />
      <el-option key="Month" label="Month" value="month" />
      <el-option v-if="dateTypeList.includes('all')" key="All" label="All" value="all" />
    </el-select>
  </div>
</template>

<script>
import { formatDate, getNowWeek } from './utils'
const startWeek = new Date(new Date(getNowWeek(new Date().getTime())[0]).getTime() + 3600 * 1000 * 24)
const endWeek = new Date(new Date(getNowWeek(new Date().getTime())[0]).getTime() + 3600 * 1000 * 24)
export default {
  name: 'DateRangePicker',
  props: {
    // 日期类型 日date 周week 月month allAll
    dateType: {
      type: String,
      default: 'date'
    },
    dateTypeList: {
      type: Array,
      default: () => {
        return ['date', 'week', 'month']
      }
    },
    type: { // base基础模式 single单一模式
      type: String,
      default: 'base'
    },
    dateClass: { // 日期选择器class选择器
      type: String,
      default: ''
    },
    // 日期范围
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      date_day: [], // 日范围
      date_week: [startWeek, endWeek], // 周范围
      date_month: [formatDate(new Date(), 'yyyy-MM'), formatDate(new Date(), 'yyyy-MM')] // 月范围
    }
  },
  computed: {
    date_Type: {
      get() {
        return this.dateType
      },
      set(val) {
        this.$emit('updateType', val)
      }
    },
    store: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        const { date_Type, date_day, date_week, date_month } = this
        const originalDate = {
          type: date_Type
        }
        if (date_Type === 'date' || date_Type === 'all') {
          originalDate.dates = date_day
        }
        date_Type === 'week' && (originalDate.dates = date_week)
        date_Type === 'month' && (originalDate.dates = date_month)
        this.$emit('change', val, originalDate)
      }
    }
  },
  watch: {
    date_Type: {
      handler(v) {
        this.formatData(v)
      },
      immediate: false,
      deep: true
    },
    date_day: {
      handler() {
        this.formatData()
      },
      immediate: false,
      deep: true
    },
    date_week: {
      handler() {
        this.formatData()
      },
      immediate: false,
      deep: true
    },
    date_month: {
      handler() {
        this.formatData()
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    // 初始化
    init(o) {
      if (typeof o.dates === 'undefined' || o.dates.length !== 2) return
      if (o.type === 'date' || o.type === 'all') {
        this.date_day = o.dates
      }
      o.type === 'week' && (this.date_week = o.dates)
      o.type === 'month' && (this.date_month = o.dates)
    },
    // 格式化数据
    formatData(t) {
      const date_Type = t || this.date_Type
      let v = []
      if (['date', 'all'].includes(date_Type)) {
        v = this.date_day
      }
      date_Type === 'week' && (v = this.date_week)
      date_Type === 'month' && (v = this.date_month)
      if (v.length !== 2) {
        this.store = []
        return
      }
      if (date_Type === 'date' || date_Type === 'all') {
        this.store = v
      } else if (date_Type === 'week') {
        const dates = []
        if (v[0] !== '' && v[1] !== '') {
          const startDate = v[0] === '' ? '' : formatDate(new Date(new Date(v[0]).getTime() - 3600 * 1000 * 24), 'yyyy-MM-dd')
          const endDate = v[1] === '' ? '' : formatDate(new Date(new Date(v[1]).getTime() + 3600 * 1000 * 24 * 5), 'yyyy-MM-dd')
          startDate !== '' && (dates.push(startDate))
          endDate !== '' && (dates.push(endDate))
        }
        this.store = dates
      } else if (date_Type === 'month') {
        this.store = [`${v[0]}-01`, `${v[1]}-${this.getmonthDates(new Date(v[1]))}`]
      }
    },
    // 获取当前月的天数
    getmonthDates(data) {
      const date = data
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const d = new Date(year, month, 0)
      return d.getDate()
    },
    disabledDateByWeek_1(time) {
      let isDisabled = true
      if (this.date_week[1] === '' || time.getTime() <= (new Date(this.date_week[1]).getTime() + 3600 * 1000 * 24 * 5)) {
        isDisabled = false
      }
      return isDisabled
    },
    disabledDateByWeek_2(time) {
      let isDisabled = true
      if (this.date_week[0] === '' || time.getTime() >= (new Date(this.date_week[0]).getTime() - 3600 * 1000 * 24)) {
        isDisabled = false
      }
      return isDisabled
    }
  }
}
</script>

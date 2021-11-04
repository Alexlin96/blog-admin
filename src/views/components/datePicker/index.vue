<template>
  <div class="datePicker g-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>日期细分类型组件</span>
      </div>
      <div>
        <date-range-picker
          ref="GtDateRangePicker"
          v-model="listdata_1.dates"
          :date-type="listdata_1.dateType"
          :date-type-list="['date', 'week', 'month']"
          @updateType="v => listdata_1.dateType = v"
          @change="dateChangeFn"
        />
      </div>
      <div id="dateRange-text" />
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>季度选择器组件</span>
      </div>
      <div class="fx">
        <quarter-picker
          v-model="listdata_2.dates[0]"
          type="quarter"
          :clearable="false"
          placeholder="开始日期"
          :disabled-date="{ type: 'lt', date: listdata_2.dates[1] }"
          @change="quarterChangeFn"
        />
        <span style="margin:0 10px">-</span>
        <quarter-picker
          v-model="listdata_2.dates[1]"
          type="quarter"
          :clearable="false"
          placeholder="结束日期"
          :disabled-date="{ type: 'gt', date: listdata_2.dates[0] }"
          @change="quarterChangeFn"
        />
      </div>
      <div id="dateQuarter-text" />
    </el-card>
  </div>
</template>

<script>
import dateRangePicker from './dateRangePicker'
import quarterPicker from './quarterPicker'
export default {
  name: 'DatePicker',
  components: { dateRangePicker, quarterPicker },
  data() {
    return {
      listdata_1: {
        dates: [], // 日期
        dateType: 'date' // 日期细分类型
      },
      listdata_2: {
        dates: ['', ''] // 日期
      }
    }
  },
  methods: {
    // 日期选择变化
    dateChangeFn(v) {
      const dom = document.getElementById('dateRange-text')
      dom.innerText = `时间段: ${v[0]} ~ ${v[1]}`
    },
    // 季度选择变化
    quarterChangeFn() {
      const { dates } = this.listdata_2
      const dom = document.getElementById('dateQuarter-text')
      dom.innerText = `时间段: ${dates[0]} ~ ${dates[1]}`
    }
  }
}
</script>
<style lang="scss" scoped>
.datePicker {
 #dateRange-text, #dateQuarter-text {
   margin-top: 20px;
 }
}
.box-card {
  margin: 10px 0;
}
</style>

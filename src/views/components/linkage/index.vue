<template>
  <div class="linkageCom">
    <linkage v-model="data" type="base" :data="optionData" style="height:500px;" />
  </div>
</template>

<script>
const target_Account = [
  {
    level: '新增',
    checked: false,
    isIndeterminate: false,
    children: {
      register: '注册',
      newuserthatpayed: '新用户累计付费人数',
      newuserpayedamount: '新用户累计付费金额',
      newuserpayrate: '新用户累计付费率',
      newuserarpu: '新用户累计ARPU',
      newuserarppu: '新用户累计ARPPU',
      retention2: '次留率',
      effectiveuserrate: '有效用户比例',
      firstorderloginrate: '一阶登录比',
      secondorderloginrate: '二阶登录比',
      cpu: 'CPU',
      cost: 'COST'
    }
  },
  {
    level: '首日数据',
    checked: false,
    isIndeterminate: false,
    children: {
      firstdaypaynum: '首日付费人数',
      firstdaypayrate: '首日付费率',
      firstdaypayamount: '首日付费金额',
      firstdayltv: '首日LTV',
      firstdayarppu: '首日ARPPU',
      firstdayaveragesession: '首日人均session',
      firstdayaverageonlinetime: '首日用户人均在线时长',
      firstdaytripleloginnum: '首日登录3次以上人数',
      firstdayquintupleloginnum: '首日登录5次以上人数'
    }
  },
  {
    level: '老用户',
    checked: false,
    isIndeterminate: false,
    children: {
      edau: 'EDAU',
      elderuserpayamount: '老用户付费金额',
      elderuserpayrate: '老用户付费率',
      elderuserpaynum: '老用户付费人数',
      elderuserarpu: '老用户ARPU',
      elderuserarppu: '老用户ARPPU',
      elderuseraveragesession: '老用户人均session',
      elderuseraverageonlinetime: '老用户人均在线时长'
    }
  },
  {
    level: '整体',
    checked: false,
    isIndeterminate: false,
    children: {
      dau: 'DAU',
      activepaynum: '活跃付费人数',
      activepayrate: '活跃付费率',
      activepayamount: '活跃付费金额',
      activepayarpu: '活跃ARPU',
      activepayarppu: '活跃ARPPU',
      activeaverageonlinetime: '活跃用户人均在线时长',
      activeaveragesession: '活跃人均session'
    }
  }
]
import linkage from './linkage'
export default {
  name: 'LinkageCom',
  components: { linkage },
  data() {
    return {
      data: ['register', 'newuserthatpayed', 'newuserpayedamount'],
      optionData: target_Account
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.linkageCom {
  width: 800px;
  border: 1px solid #ebecec;
  border-radius: 10px;
  padding: 10px;
  margin: 50px auto;
}
</style>

<template>
  <div class="tableCom g-container">
    <gt-table ref="gtTable" v-loading="listdata.loading" :max-height="700" :selection="false" :table-data="listdata.showdata" :col-configs="listdata.tableConfig" style="font-size: 12px;">
      <template v-slot:name="scope">
        <el-popover placement="right" trigger="hover">
          <p style="max-width:300px;text-indent:10px;">
            {{ scope.row.address }}
          </p>
          <div slot="reference">
            <span>{{ scope.row.name }}</span>
          </div>
        </el-popover>
      </template>
      <template v-slot:operate="scope">
        <el-button type="text" size="small" @click="editFn(scope.row)">编辑</el-button>
        <el-button type="text" size="small" @click="delFn(scope.row)">删除</el-button>
      </template>
    </gt-table>
  </div>
</template>

<script>
import GtTable from './gtTable'
export default {
  name: 'TableCom',
  components: { GtTable },
  data() {
    return {
      listdata: {
        loading: false,
        showdata: [
        ], // 表格数据
        tableConfig: [ // 表头配置
          { prop: 'id', label: '序号', type: 'id', width: '100px', align: 'center' },
          { prop: 'name', label: '名称', slot: 'name', type: 'slot', align: 'center' },
          { prop: 'address', label: '地址', type: 'address', align: 'center' },
          { prop: 'operate', label: '操作', slot: 'operate', type: 'slot', width: '120px', align: 'center' }
        ]
      }
    }
  },
  created() {
    const showdata = []
    for (let i = 0; i < 100; i++) {
      showdata.push({
        id: i + 1,
        name: `Alex_${i}`,
        address: `上海市普陀区金沙江路${i + 1}号`
      })
    }
    this.listdata.showdata = showdata
  },
  methods: {
    editFn(row) {
      const { name } = row
      this.$message.warning(`编辑${name}`)
    },
    delFn(row) {
      const { name } = row
      this.$message.warning(`删除${name}`)
    }
  }
}
</script>

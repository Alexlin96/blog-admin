<template>
  <el-table
    ref="multipleTable"
    border
    :data="tableData"
    size="mini"
    :class="{hasFixed: hasFixed}"
    :show-summary="showSummary"
    :span-method="spanMethod"
    :row-style="rowStyle"
    :row-key="getRowKeys"
    :row-class-name="tableRowClassName"
    :max-height="maxHeight"
    :select-on-indeterminate="true"
    @expand-change="expandChange"
    @header-dragend="colChange"
    @select="handleSele"
    @select-all="handleSeleAll"
    @selection-change="handleSeleChange"
    @row-click="rowClick"
    @cell-click="cellClick"
    @row-contextmenu="rowContextMenu"
    @sort-change="sortChange"
  >
    <el-table-column
      v-if="selection"
      :key="'selection'"
      :selectable="selectable"
      type="selection"
      width="40"
      align="center"
    />
    <el-table-column
      v-for="(item, index) in colConfigs"
      :key="`${item.prop}#${index}`"
      :prop="item.prop"
      :width="item.width"
      :fixed="item.fixed"
      :min-width="item.minWidth"
      :sortable="item.sortable"
      :sort-method="(a, b) => singlTextSort(a, b, item.prop)"
      :type="item.expand ? 'expand': ''"
      :align="item.align ? item.align : 'left'"
      :sort-orders="['ascending', 'descending']"
    >
      <!-- :label="item.label" -->
      <template v-slot:header>
        <el-tooltip popper-class="toolTip-item" effect="light" placement="top">
          <div slot="content">
            {{ item.label }}
          </div>
          <span>{{ item.label }}</span>
        </el-tooltip>
      </template>
      <template v-slot="scope">
        <!-- solt 自定义列-->
        <template v-if="item.type === 'slot'">
          <slot :name="item.slot" :row="scope.row" />
        </template>
        <template v-else-if="item.expand">
          <slot :name="item.slot" :row="scope.row" />
        </template>

        <!-- 值为数组时 -->
        <template v-else-if="item.component">
          <div
            v-for="(child, cindex) in scope.row[item.prop]"
            :key="cindex"
          >
            {{ child }}
          </div>
        </template>
        <!-- 普遍模式 -->
        <span v-else-if="item.horizontal">{{ scope.row[item.prop] === 0 ? '-' : scope.row[item.prop] }}</span>
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    colConfigs: {
      default: () => [],
      type: Array
    },
    tableData: {
      default: () => [],
      type: Array
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    selection: Boolean,
    selectable: {
      default: () => 1,
      type: Function
    },
    spanMethod: {
      default: () => {},
      type: Function
    },
    stripe: { // 斑马纹
      type: Boolean,
      default: false
    },
    maxHeight: { // 最大高度
      type: [String, Number],
      default: () => 500
    }
  },

  data() {
    return {
      highlightRowIndex: '',
      getRowKeys(row) {
        return row.id
      }
    }
  },

  computed: {
    hasFixed() {
      return this.colConfigs.filter(f => f.fixed).length
    }
  },

  mounted() {
  },

  methods: {
    // 拖动表头改变列宽
    colChange(newWidth, oldWidth, column, event) {
      setTimeout(() => {
        this.$emit('colChange', {
          newWidth, oldWidth, column, event
        })
      }, 100)
    },

    // 监听row-click事件
    rowClick(v) {
      this.$emit('row-click', v)
    },

    // 监听单元格点击事件
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },

    // 当某一行被鼠标右键点击时会触发该事件
    rowContextMenu(row, column, event) {
      event.preventDefault()
      this.$refs.multipleTable.setCurrentRow(row)
      this.highlightRowIndex = row.rowIndex
      this.$emit('row-contextmenu', row, column, event)
    },

    handleSele(v) {
      this.$emit('select', v)
    },

    handleSeleAll(v) {
      this.$emit('select-all', v)
    },

    handleSeleChange(v) {
      this.$emit('selection-change', v)
    },

    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },

    toggleRowSelection(row, flag) {
      this.$refs.multipleTable.toggleRowSelection(row, flag)
    },

    expandChange(row, expandedRows) {
      this.$emit('expand-change', row, expandedRows)
    },

    singlTextSort: function(a, b, prop) {
      let result = 0
      let left = a[prop]
      let right = b[prop]

      if (left === undefined || left === '-') {
        left = 0
      } else if (typeof left === 'string' && left.indexOf('%') > -1) {
        left = parseFloat(left.slice(0, left.indexOf('%')), 10)
      } else if (typeof left === 'string') {
        left = parseFloat(left, 10)
      }

      if (right === undefined || right === '-') {
        right = 0
      } else if (typeof right === 'string' && right.indexOf('%') > -1) {
        right = parseFloat(right.slice(0, right.indexOf('%')), 10)
      } else if (typeof right === 'string') {
        right = parseFloat(right, 10)
      }

      if (left > right) {
        result = 1
      } else if (left < right) {
        result = -1
      }

      return result
    },
    rowStyle({ row, rowIndex }) {
      Object.defineProperty(row, 'rowIndex', { // 给每一行添加不可枚举属性rowIndex来标识当前行 数据绑定
        value: rowIndex,
        writable: true,
        enumerable: false
      })
      if ((this.highlightRowIndex) === rowIndex) {
        return {
          'background-color': '#f0f3fa'
        }
      }
    },
    // 每行class (目前先写死)
    tableRowClassName({ rowIndex = 0 } = {}) {
      if (!this.stripe) return
      if (rowIndex % 2 === 0) {
        return 'bg-white'
      } else {
        return 'bg-blue'
      }
    },
    // 自定义排序
    sortChange({ column, prop, order }) {
      this.$emit('sortChange', { column, prop, order })
    }
  }
}
</script>

<style lang='scss'>
.toolTip-item {
  border: 1px solid #66b1ff!important;
  width: auto !important;
}
</style>

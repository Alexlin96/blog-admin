<template>
  <div class="linkage">
    <div class="linkage-left">
      <template v-for="item in data">
        <div :key="item.level">
          <div class="title">
            <span>{{ item.level }}</span>
            <el-checkbox v-model="item.checked" :indeterminate="item.isIndeterminate" class="check" @change="handleCheckAllChange(item)">全选</el-checkbox>
          </div>
          <div class="list">
            <el-checkbox-group v-model="store" @change="handleCheckItemChange(item)">
              <template v-for="(val,key) in item.children">
                <el-checkbox :key="key" :label="key">{{ val }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </div>
    <div v-if="type === 'base'" class="linkage-right">
      <div class="title">
        <span class="label">已选择指标</span>
        <span class="opt" @click="clearAllFn">清空</span>
      </div>
      <template v-if="store.length">
        <draggable v-model="store" class="list-group" tag="ul">
          <transition-group type="transition" name="flip-list">
            <template v-for="(item, index) in store">
              <li :key="index" class="list-group-item">
                <p>{{ dataMap[item] }}</p>
                <i class="el-icon-remove" @click="handleRemoveFn(index)" />
              </li>
            </template>
          </transition-group>
        </draggable>
      </template>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'QLinkage',
  components: { draggable },
  props: {
    // 选中的值
    value: {
      type: Array,
      default: () => []
    },
    // 类型 single单一 base基础
    type: {
      type: String,
      default: 'base'
    },
    // 展示数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dataMap: {}
    }
  },
  computed: {
    store: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      const dataMap = {}
      const { data } = this
      data.forEach(el => {
        this.handleCheckItemChange(el)
        Object.keys(el.children).forEach(key => {
          Object.assign(dataMap, {
            [key]: el.children[key]
          })
        })
      })
      this.dataMap = dataMap
    },
    // 当前级别全选
    handleCheckAllChange(item) {
      const v = item.checked
      const arr = []
      Object.keys(item.children).forEach(key => {
        arr.push(key)
      })
      if (v) { // 全选
        this.store = Array.from(new Set([...this.store, ...arr]))
      } else { // 反选
        const newData = []
        this.store.forEach(item => {
          if (!arr.includes(item)) {
            newData.push(item)
          }
        })
        this.store = newData
      }
      item.isIndeterminate = false
    },
    // 当前指标选择
    handleCheckItemChange(item) {
      const { store } = this
      let selectNum = 0
      const arr = Object.keys(item.children)
      const itemNum = arr.length // 当前层级下的所有指标个数
      arr.forEach(v => {
        store.includes(v) && (selectNum++)
      })
      item.checked = selectNum === itemNum
      item.isIndeterminate = selectNum > 0 && selectNum < itemNum
    },
    // 删除已选择指标
    handleRemoveFn(index) {
      this.store.splice(index, 1)
      this.data.forEach(item => {
        this.handleCheckItemChange(item)
      })
    },
    // 清空所有选择指标
    clearAllFn() {
      this.store = []
      this.data.forEach(el => {
        el.checked = false
        el.isIndeterminate = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .flip-list-move {
    transition: transform 0.5s;
  }
  .linkage {
    display: flex;
    width: 100%;
    height: 100%;
    .linkage-left {
      max-height: 100%;
      overflow: auto;
      flex: 1;
      .title {
        font-size: 14px;
        font-weight: 600;
        padding: 10px 0 10px 10px;
        border-bottom: 1px solid #e2e2e2;
        .check {
          margin-left: 20px;
        }
      }
      .list {
        padding: 10px;
        .el-checkbox {
          margin: 10px;
        }
      }
    }
    .linkage-right {
      max-height: 100%;
      overflow: auto;
      min-width: 250px;
      padding: 0 10px;
      .title {
        padding: 10px 0 10px 10px;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 14px;
          font-weight: 600;
        }
        .opt {
          font-size: 12px;
          cursor: pointer;
          color: #409EFF;
        }
      }
      .list-group {
        padding-left: 10px;
        margin: 0;
        display: flex;
        flex-direction: column;
        padding-left: 0;
        margin-top: 10px;
        border: 1px solid rgba(0,0,0,.125);
        .list-group-item {
          height: 30px;
          line-height: 30px;
          position: relative;
          list-style: none;
          cursor: move;
          border: 1px solid rgba(0,0,0,.125);
          p {
            text-indent: 20px;
            margin: 0;
          }
          .el-icon-remove {
            position: absolute;
            top: 30%;
            right: 10px;
            cursor: pointer;
            color: red;
          }
        }
      }
    }
  }
</style>

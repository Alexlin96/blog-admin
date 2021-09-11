<template>
  <div class="time-sheet">
    <div class="fastSet">
      快速选择：
      <el-button size="mini" @click="handleSetLange(9,24)">每天9:00-23:59时</el-button>
      <el-button size="mini" @click="handleSetLange(0,24)">全天</el-button>
      <el-button size="mini" @click="handleSetLange(0,0)">清空</el-button>
    </div>
    <div class="time-sheet-header oh">
      <div class="fl corner">星期/时间</div>
      <div class="fl time">
        <div class="oh">
          <div class="fl time-title">00:00-12:00</div>
          <div class="fl time-title">12:00-24:00</div>
        </div>
        <ul class="time-num oh">
          <li v-for="(timeItem, timeI) in time" :key="timeI" class="fl time-num-item">{{ timeItem }}</li>
        </ul>
      </div>
    </div>
    <div ref="boxMask" class="box-mask" />
    <div class="content oh">
      <ul class="week fl">
        <li v-for="(weekItem, weekI) in week" :key="weekI" class="week-item">{{ weekItem }}</li>
      </ul>
      <ul ref="box" class="box fl" @mousedown="drag">
        <li
          v-for="(boxItem, boxi) in box"
          :key="boxi"
          ref="boxItem"
          :class="{ 'active': boxItem.isActive === 1}"
          :data-row="boxItem.row"
          :data-col="boxItem.col"
          class="box-item"
        />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSheet',
  props: {
    value: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      week: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ],
      time: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ],
      box: [],
      firstBoxStatus: true,
      startPoint: {}
    }
  },
  watch: {
    value: {
      handler() {
        this.initBoxFn()
      },
      immediate: true
    }
  },
  methods: {
    // 初始化
    initBoxFn() {
      const { value } = this
      const weekLength = this.week.length
      const timeLength = this.time.length * 2 // 1格/半小时
      const newData = []
      for (let i = 0; i < weekLength; i++) {
        for (let j = 0; j < timeLength; j++) {
          newData.push({
            row: j + 1,
            col: i + 1,
            isActive: 0
          })
        }
      }
      const arr = value.split('')
      arr.forEach((el, index) => {
        newData[index].isActive = el - 0
      })
      this.box = newData
    },
    // 拖拽开始
    drag(e) {
      const evt = e || window.event
      const { row } = evt.target.dataset
      const { col } = evt.target.dataset
      const mask = this.$refs.boxMask
      this.startPoint = this.getClientPosition(evt.target)

      // 遮罩层
      mask.style.display = 'block'
      mask.style.top = `${this.startPoint.y}px`
      mask.style.left = `${this.startPoint.y}px`

      // 判断点击的首个元素，是否被激活
      if (evt.target.className.indexOf('active') === -1) {
        this.firstBoxStatus = true // 选中
      } else {
        this.firstBoxStatus = false // 取消选中
      }

      // 记录起始行列 从第几行，第几列开始
      if (row && col) {
        this.startPoint.startRow = row * 1
        this.startPoint.startCol = col * 1
      }

      this.$refs.box.addEventListener('mousemove', this.moveHandler, true)
      this.$refs.box.addEventListener('mouseup', this.upHandler, true)
    },
    // 拖拽移动
    moveHandler(e) {
      const evt = e || window.event
      const mask = this.$refs.boxMask
      const curLi = document.elementFromPoint(evt.clientX, evt.clientY) // 获取当前鼠标所在位置的元素
      const curPoint = this.getClientPosition(curLi, true) // 获取右下角坐标

      const xSpacing = curPoint.x - this.startPoint.x // x轴的距离
      const ySpacing = curPoint.y - this.startPoint.y // y轴的距离

      // 遮罩层
      const maskTop = ySpacing > 0 ? this.startPoint.y : curPoint.y - 35
      const maskLeft = xSpacing > 0 ? this.startPoint.x : curPoint.x - 13
      const maskWidth = xSpacing > 0 ? xSpacing : Math.abs(xSpacing) + 26
      const maskHeight = ySpacing > 0 ? ySpacing : Math.abs(ySpacing) + 70

      mask.style.left = `${maskLeft}px`
      mask.style.top = `${maskTop}px`
      mask.style.width = `${maskWidth}px`
      mask.style.height = `${maskHeight}px`
    },
    // 停止拖拽
    upHandler(e) {
      const evt = e || window.event
      const { row } = evt.target.dataset
      const { col } = evt.target.dataset

      // 获取结束时的第几行第几列
      const endRow = row * 1
      const endCol = col * 1

      this.$refs.box.removeEventListener('mousemove', this.moveHandler, true)
      this.$refs.box.removeEventListener('mouseup', this.upHandler, true)

      this.$refs.boxMask.style.display = 'none'

      // 获取 起始 和 结束时 的第几行和第几列
      const minRow = Math.min(this.startPoint.startRow, endRow)
      const maxRow = Math.max(this.startPoint.startRow, endRow)
      const minCol = Math.min(this.startPoint.startCol, endCol)
      const maxCol = Math.max(this.startPoint.startCol, endCol)
      let result = ''

      // 编辑选择中的元素
      this.box.forEach((item) => {
        const el = item
        // 处理在范围内的元素
        if (el.row <= maxRow && el.row >= minRow && el.col <= maxCol && el.col >= minCol) {
          if (this.firstBoxStatus) {
            el.isActive = 1
          } else {
            el.isActive = 0
          }
        }
        result += el.isActive
      })

      this.$emit('input', result)
      this.cleanEvent(e)
    },
    // 阻止冒泡和默认事件
    cleanEvent(e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
    },
    // 获取元素的坐标信息 flag为false 则返回左上角坐标，为 true 则返回右下角坐标
    getClientPosition(el, flag) {
      // getBoundingClientRect() 为原生 api (top:元素上边到视窗上边的距离, left:元素左边到视窗左边的距离)
      const elRect = el.getBoundingClientRect()
      return {
        x: elRect.left + (flag ? elRect.width : 0),
        y: elRect.top + (flag ? elRect.height : 0)
      }
    },
    // 时段快速设置
    handleSetLange(start, end) {
      let result = ''
      this.box.forEach((item, i) => {
        if (item.col > start * 2 && item.col <= end * 2) {
          item.isActive = 1
        } else {
          item.isActive = 0
        }
        result += item.isActive
      })

      this.$emit('input', result)
    }
  }
}
</script>

<style lang='scss' scoped>
.fl {
  float: left;
}
ul {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
  }
}

.oh {
  overflow: hidden;
}
.fastSet{
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.time-sheet {
  display: inline-block;
  position: relative;
  margin-top: 10px;
  border: 1px solid #eee;
  background: #fafafa;
  color: #555;
  text-align: center;
  font-size: 15px;
  box-sizing: border-box;
  &-header {
    box-sizing: border-box;
    .corner {
      width: 82px;
      line-height: 70px;
    }
    .time-title {
      height: 35px;
      width: 312px;
      line-height: 34px;
      border-left: 1px solid #eee;
      border-bottom: 1px solid #eee;
      font-weight: 700;
      box-sizing: border-box;
    }
    .time-num-item {
      width: 26px;
      line-height: 35px;
      border-left: 1px solid #eee;
      box-sizing: border-box;
    }
  }
  .week {
    width: 82px;
    line-height: 35px;
    &-item {
      height: 35px;
      border-top: 1px solid #eee;
      box-sizing: border-box;
    }
  }
  .box {
    position: relative;
    width: 624px;
    height: 100%;
    overflow: hidden;
    &-item {
      float: left;
      width: 13px;
      height: 35px;
      border-left: 1px solid #eee;
      border-top: 1px solid #eee;
      background-color: #fff;
      user-select: none;
      box-sizing: border-box;
      &:hover {
        background-color: #f2f2f2;
      }
    }
    .active {
      background-color: #1ba3f4;
    }
  }
  .box-mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #1ba3f4;
    opacity: 0.6;
    pointer-events: none;
    z-index: 1;
  }
}
</style>

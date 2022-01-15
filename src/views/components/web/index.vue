<template>
  <div class="web-template">
    <div class="web-main" />
    <div class="web-side">
      <el-tabs type="border-card" class="web-side-card">
        <el-tab-pane label="组件库">
          <div class="web-components">组件库</div>
        </el-tab-pane>
        <el-tab-pane label="组件配置">
          <div class="component-config">组件配置</div>
        </el-tab-pane>
        <el-tab-pane label="项目信息">
          <div class="web-info">
            <web-info v-model="webInfo" />
            <el-button type="primary" size="medium" @click="test">测试</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { meta, style } from './template'
import webInfo from './webInfo'
export default {
  name: 'Web',
  components: { webInfo },
  data() {
    return {
      webInfo: {
        title: '战火与荣耀',
        keywords: '高图，高图网络，战火与荣耀，战棋，魔幻，全球混战，手机游戏，SLG手游',
        description: '英雄终于出手游了，1:1还原电脑版经典玩法！兵种不断进化，还你真正的《战火与荣耀魔法之门》，传奇统帅汇聚的SLG手游，你要用谁统一全世界？'
      }
    }
  },
  methods: {
    test() {
      const { webInfo } = this
      const metaData = meta(webInfo)
      console.log('metaData', metaData)
      const styleData = style()
      console.log('styleData', styleData)
    }
  }
}
</script>
<style lang="scss">
.web-template {
  display: flex;
  .web-main {
    min-height: calc(100vh - 50px);
    flex: 1;
    overflow: auto;
    background-color: #E9EEF3;
  }
  .web-side {
    min-height: calc(100vh - 50px);
    width: 500px;
    background-color: #D3DCE6;
  }
}
</style>

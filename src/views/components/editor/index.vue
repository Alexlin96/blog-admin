<template>
  <div class="codeEditor">
    <div class="edit-config">
      <div class="config-item">
        <slot name="diff" />
      </div>
      <div class="config-item">
        <span>主题</span>
        <el-select v-model="codeTheme" size="small" class="config-select" filterable @change="handleThemeChange">
          <el-option v-for="(item, index) in themeList" :key="index" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="config-item">
        <span>模式</span>
        <el-select v-model="codeMode" size="small" class="config-select" filterable @change="handleModeChange">
          <el-option v-for="(val, key) in modeList" :key="key" :label="key" :value="key" />
        </el-select>
      </div>

    </div>
    <codemirror
      ref="mycode"
      v-model="store"
      :options="cmOptions"
      class="code"
    />
    <!-- 代码版本，差异对比 对话框内容 -->
    <el-dialog title="差异对比" :visible.sync="diffDialog" class="history" width="60%">
      <section class="box">
        <span>【注】左侧为历史版本，右侧为当前版本</span>
        <div id="diff-view" />
      </section>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
/*
  滚动条
*/
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js'
/*
  代码折叠
*/
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
/*
  代码模式
*/
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/jsx/jsx.js'
/*
  代码对比
*/
import CodeMirror from 'codemirror'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import DiffMatchPatch from 'diff-match-patch'
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0
export default {
  name: 'Editor',
  components: { codemirror },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    mode: { // 代码模式
      type: String,
      default: () => 'python'
    },
    theme: { // 主题
      type: String,
      default: () => 'abcdef'
    },
    option: { // 配置
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      codeTheme: '', // 主题
      codeMode: '', // 代码模式
      modeList: { // 模式列表
        python: 'text/x-python',
        json: 'text/javascript',
        yaml: 'text/x-yaml',
        xml: 'application/xml',
        sql: 'text/x-sql',
        php: 'text/x-php',
        vue: 'text/x-vue',
        jsx: 'text/typescript-jsx',
        go: 'text/x-go',
        javascript: 'text/javascript'
      },
      themeList: [ // 主题列表
        '3024-day',
        '3024-night',
        'abbott',
        'abcdef',
        'ambiance-mobile',
        'ambiance',
        'ayu-dark',
        'ayu-mirage',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'darcula',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'gruvbox-dark',
        'hopscotch',
        'icecoder',
        'idea',
        'isotope',
        'juejin',
        'lesser-dark',
        'liquibyte',
        'lucario',
        'material-darker',
        'material-ocean',
        'material-palenight',
        'material',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'moxer',
        'neat',
        'neo',
        'night',
        'nord',
        'oceanic-next',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'shadowfox',
        'solarized',
        'ssms',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'yonce',
        'zenburn'
      ],
      cmOptions: {
        mode: 'sql', // 代码模式
        theme: 'abcdef', // 主题
        indentWithTabs: true, // 在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false
        tabSize: 2, // tab的空格宽度
        indentUnit: 2, // 缩进单位为2
        lineNumbers: true, // 是否在编辑器左侧显示行号
        line: true,
        readOnly: false, // 是否只读
        matchBrackets: true, // 括号匹配
        extraKeys: { // 快捷键
          'Ctrl': 'autocomplete'
        },
        foldGutter: true, // 代码折叠
        lineWrapping: true, // 代码折叠
        styleActiveLine: true, // 光标所在行高亮
        scrollbarStyle: 'overlay', // 内侧滚动条
        autofocus: true, // 可用于使CodeMirror将焦点集中在初始化上
        lineWiseCopyCut: true, // 启用时（默认情况下），在没有选择时执行复制或剪切将复制或剪切其上有游标的整行
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        hintOptions: {
          completeSingle: false
        }
      },
      diffDialog: false // 对比弹窗
    }
  },
  computed: {
    store: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        console.log('xxx', val)
      }
    }
  },
  watch: {
    mode: {
      handler(v) {
        this.codeMode = v
        this.handleModeChange()
      },
      immediate: true
    },
    theme: {
      handler(v) {
        this.codeTheme = v
        this.handleThemeChange()
      },
      immediate: true
    },
    option: {
      handler(v) {
        const { cmOptions } = this
        this.cmOptions = Object.assign({}, cmOptions, v) // 覆盖配置
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 模式切换
    handleModeChange() {
      const { codeMode, modeList } = this
      this.cmOptions.mode = modeList[codeMode]
    },
    // 主题切换
    handleThemeChange() {
      const { codeTheme } = this
      require(`codemirror/theme/${codeTheme}.css`)
      this.cmOptions.theme = codeTheme
    },
    // 对比功能 (测试)
    testDiffFn() {
      this.diffDialog = true
      this.$nextTick(() => {
        const newVal = '#!/bin/bash\n' +
            'ip="123.21.12.11"\n' +
            'email="lgx@example"\n' +
            ' \n' +
            'while 1\n' +
            'do\n' +
            '  ping -c10 $ip > /dev/null 2>/dev/null\n' +
            '  if [ $? != "0" ]\n' +
            '  then\n' +
            '       # 调用一个用于发邮件的脚本\n' +
            '     python /usr/local/sbin/mail.py $email "$ip down" "$ip is down"\n' +
            '  fi\n' +
            '  sleep 30\n' +
            'done'
        const oldVal = '#!/bin/bash\n' +
            'ip="123.21.12.11"\n' +
            'email="admin@example"\n' +
            ' \n' +
            'while 1\n' +
            'do\n' +
            '  ping -c10 $ip > /dev/null 2>/dev/null\n' +
            '  if [ $? != "0" ]\n' +
            '  then\n' +
            '       # 调用一个用于发邮件的脚本\n' +
            '     python /usr/local/sbin/mail.py $email "$ip down" "$ip is down"\n' +
            '  fi\n' +
            'done'
        this.initDiffUI(newVal, oldVal)
      })
    },
    // 对比功能
    diff(newVal, oldVal) {
      this.diffDialog = true
      this.$nextTick(() => {
        this.initDiffUI(newVal, oldVal)
      })
    },
    // 对比内容初始化
    initDiffUI(newVal, oldVal) {
      if (!(newVal && oldVal)) return
      const target = document.getElementById('diff-view')
      target.innerHTML = '' // 清空
      CodeMirror.MergeView(target, {
        value: oldVal, // 上次内容
        origLeft: null,
        orig: newVal, // 本次内容
        lineNumbers: true, // 显示行号
        mode: '',
        highlightDifferences: true,
        foldGutter: true,
        lineWrapping: true,
        styleActiveLine: true,
        matchBrackets: true,
        connect: 'align',
        readOnly: true // 只读 不可修改
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.codeEditor {
  .edit-config {
    text-align: right;
    margin: 5px;
    .config-item {
      display: inline-block;
      margin: 0 5px;
      &>span {
        font-size: 14px;
      }
    }
    .config-select {
      margin: 0 5px;
      width: 150px;
    }
  }
  .code {
    border: 1px solid #f7f7f7;
  }
}
</style>

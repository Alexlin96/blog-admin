const templates = [
  {
    name: 'landingpage - 适用于落地页',
    dir: 'landingpage',
    config: [
      {
        type: 'input',
        name: 'title',
        message: '请输入网站标题：',
        default: '战火与荣耀'
      },
      {
        type: 'input',
        name: 'keywords',
        message: '请输入网站关键字：',
        default: '高图，高图网络，战火与荣耀，战棋，魔幻，全球混战，手机游戏，SLG手游'
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入网站描述：',
        default: '英雄终于出手游了，1:1还原电脑版经典玩法！兵种不断进化，还你真正的《战火与荣耀魔法之门》，传奇统帅汇聚的SLG手游，你要用谁统一全世界？'
      },
      {
        type: 'input',
        name: 'developer',
        message: '请输入开发者：',
        default: '海南高图网络科技有限公司'
      },
      {
        type: 'input',
        name: 'appName',
        message: '请输入应用名称：',
        default: '战火与荣耀'
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号：',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'updateTime',
        message: '请输入更新时间：',
        default: '2021.09.08'
      },
      {
        type: 'input',
        name: 'privacy',
        message: '请输入隐私政策链接地址：',
        default: 'https://www.goatgames.com/cn/privacy.html'
      },
      {
        type: 'input',
        name: 'authority',
        message: '请输入应用权限链接地址：',
        default: 'https://www.goatgames.com/cn/privacy.html'
      },
      {
        type: 'input',
        name: 'jDownload',
        message: '请输入顶部下载按钮图片地址：',
        default: 'assets/images/button.gif'
      },
      {
        type: 'input',
        name: 'jDownloadBtn',
        message: '请输入下载按钮图片地址：',
        default: 'assets/images/in-btn.png'
      },
      {
        type: 'input',
        name: 'img_1',
        message: '请输入内容图片1地址：',
        default: 'assets/images/1.jpg'
      },
      {
        type: 'input',
        name: 'img_2',
        message: '请输入内容图片2地址：',
        default: 'assets/images/2.jpg'
      },
      {
        type: 'input',
        name: 'img_3',
        message: '请输入内容图片3地址：',
        default: 'assets/images/3.jpg'
      },
      {
        type: 'input',
        name: 'img_5',
        message: '请输入底部下载按钮图片地址：',
        default: 'assets/images/5.png'
      }
    ]
  }
]

module.exports = [...templates]

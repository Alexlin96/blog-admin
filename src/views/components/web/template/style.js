const defaultStyle = {
  'html,body': {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0
  },
  'body': {
    font: '12px, "宋体", "Arial Narrow", HELVETICA',
    background: '#17191f'
  }
}
export default (config = {}) => {
  const styleConifg = { ...defaultStyle, ...config }
  let styleContent = ''
  Object.entries(styleConifg).forEach(el => {
    styleContent += `\t${el[0]}${JSON.stringify(el[1])}\n`
  })
  const res = `
<style>
  ${styleContent}</style>
  `
  return res
}

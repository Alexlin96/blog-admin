export default (config) => {
  const { title, keywords, description } = config
  const res = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="shortcut icon" href="https://www.goatgames.com/assets/images/favicon.ico" type="image/x-icon">
    <meta name="keywords" content="${keywords}">
    <meta name="description" content="${description}">
  `
  return res
}


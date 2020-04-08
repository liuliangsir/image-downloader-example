import avg from '../img/avg.png'
import json from '../json/app.json'

const [width, height] = [192, 108]
const imgs = ((datas) => {
  return datas.map(({ fileType: type, materialAlias: name, url }) => ({ type, name, url }))
})(json.data.list)

;(() => {
  const fragment = document.createDocumentFragment()
  const logos = imgs.slice(0, 18)

  logos.forEach(({ url, name, type }) => {
    const img = document.createElement('img')

    Object.assign(img, { width, height, src: `${url}?fop=imageView/2/w/${width}/h/${height}` })
    Object.assign(img.dataset, { name, type, url })

    fragment.appendChild(img)
  })

  root.appendChild(fragment)
})()

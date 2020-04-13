import json from '../json/app.json'
import jpg from '../media/lake.jpg'
import mp3 from '../media/soft.mp3'
import gif from '../media/emperor.gif'
import png from '../media/computer.png'

const map = {
  jpg,
  png,
  mp3,
  gif,
}
const [width, height] = [192, 108]
const imgs = ((datas) => {
  return datas.map(({ fileType: type, materialAlias: name, url }) => ({ type, name, url }))
})(json.data.list)

;((win, doc) => {
  const fragment = doc.createDocumentFragment()
  const logos = imgs.slice(0, 36)

  logos.forEach(({ url, name, type }) => {
    const img = doc.createElement('img')

    Object.assign(img, { width, height, src: `${url}?fop=imageView/2/w/${width}/h/${height}` })
    Object.assign(img.dataset, { name, type, url })

    fragment.appendChild(img)
  })

  root.appendChild(fragment)
  win.globalMap = map
})(window, document)

import JSZip from 'jszip'

const clickEventHandler = (event) => {
  const zip = new JSZip()
  const hash = new Set()

  const dataSets = [...document.querySelectorAll('.wrapper img')].map((element) => element.dataset)
  let counter = 1

  Promise.all(
    dataSets.map(({ url, name, type }) =>
      fetch(url).then((response) => {
        if (response.status === 200 || response.status === 0) {
          let finalName = `${name}.${type}`

          if (!hash.has(finalName)) {
            counter = 1
            hash.add(finalName)
          } else {
            finalName = finalName.replace(/.+(?=\.(?:jpe?g|png|gif|svg)$)/i, `$&${counter++}`)
          }

          return Promise.resolve({
            payload: response.blob(),
            meta: { name: finalName },
          })
        } else {
          return Promise.reject(new Error(response.statusText))
        }
      })
    )
  )
    .then((datas) => {
      datas.forEach(({ payload, meta: { name } }, id) => {
        zip.file(name, payload)
      })

      zip
        .generateAsync({
          type: 'blob',
        })
        .then((content) => {
          const element = document.createElement('a')

          element.download = '图片.zip'
          element.style.display = 'none'
          element.href = URL.createObjectURL(content)
          document.body.appendChild(element)

          element.click()
          document.body.removeChild(element)
        })
    })
    .catch((error) => {
      console.log(error)
    })
}

;(() => {
  downloader.addEventListener('click', clickEventHandler, false)
})()

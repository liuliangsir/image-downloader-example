import JSZip from 'jszip'

const clickEventHandler = async (event) => {
  const {
    target: {
      dataset: { type },
    },
  } = event

  const zip = new JSZip()
  const hash = new Set()

  const dataSets = [...document.querySelectorAll('.wrapper img')].map((element) => element.dataset)
  let counter = 1

  const startTime = window.performance.now()
  await Promise.all(
    dataSets.map(({ name }) =>
      fetch(window.globalMap[type]).then((response) => {
        if (response.status === 200 || response.status === 0) {
          let finalName = `${name}.${type}`

          if (!hash.has(finalName)) {
            counter = 1
            hash.add(finalName)
          } else {
            finalName = finalName.replace(/.+(?=\.(?:jpe?g|png|gif|svg|mp3)$)/i, `$&${counter++}`)
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

          downloaderTime.textContent = `耗时 ${(window.performance.now() - startTime) | 0} ms`
        })
    })
    .catch((error) => {
      console.log(error)
    })
}

;(() => {
  downloaders.addEventListener('click', clickEventHandler, false)
})()

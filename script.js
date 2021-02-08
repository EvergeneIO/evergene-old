const fetch = require('node-fetch')

async function outpud() {
  await fetch('https://cdn.evergene.io/image.json')
      .then(res => res.json())
      .then(json => {
          console.log(json.cuddle[0].image)
      });
}

outpud();
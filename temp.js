const fetch = require('node-fetch');

fetch('https://evergene.io/api/hug')
   .then(res => res.json())
   .then(json => {
      let image = json.url;
      console.log(image)
    });


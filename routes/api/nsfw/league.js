const Endpoint = require('../../../classes/ApiEndpoint');
const fetch = require('node-fetch')

// * https://evergene.io/api/league?tag=yuri

async function league(category) {
    try {
        let json = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/categories?slug=${category}`)).json();
  
        let id = json[0].id;
        let posts = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/posts?categories=${id}`)).json();
        let imgId = posts[0].id;
        let img = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/media?parent=${imgId}`)).json();
        let image = img[0].source_url
  
        return image;
      } catch (e) {
        throw e
      }
}

module.exports = (server, filename, path) => {

    new Endpoint(router, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, endpoint, tools) => {
            let tag = req.query.tag;
            if (tag) {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify({url: await league(tag)}, null, 3))
                //JSON.stringify({ url: output }, null, 3)
            } else {

            }
        });
}

/**
                  let category = tag;
                await fetch(`https://league-of-hentai.com/wp-json/wp/v2/categories?slug=${category}`)
                    .then(res => res.json())
                    .then(json => {
                        let id = json[0].id;
                        console.log(json)
                        await fetch(`https://league-of-hentai.com/wp-json/wp/v2/posts?categories=${id}`)
                            .then(res => res.json())
                            .then(json => {
                                console.log(json)
                                res.header("Content-Type", "application/json");
                                res.send(json);
                            });
                    });
 */
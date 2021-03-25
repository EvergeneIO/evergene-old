const Endpoint = require('../../../classes/Endpoints/LeagueEndpoint');
const fetch = require('node-fetch')

// * https://evergene.io/api/league?tag=yuri

async function league(category) {
    // return new Promise((reject, resolve) => {
    try {
        let { id, count } = Endpoint._categories[category.toLowerCase()];
        let page = Math.ceil(Math.random() * count);

        let post = await (await fetch(`https://league-of-hentai.com/wp-json/wp/v2/posts?tags=${id}&page=${page}&per_page=1`)).json();

        let attachmentURL = post[0]._links["wp:attachment"][0].href
        if(Endpoint.filter("check", attachmentURL.split("=").pop())) return league(category);
        let imgJson = await (await fetch(attachmentURL)).json();
        if(imgJson.length != 1) {
            Endpoint.filter("add", attachmentURL.split("=").pop());
            return league(category);
        }
        let img = imgJson[0].source_url || imgJson[0].media_details.sizes.large.source_url;

        return img;
    } catch (e) {
        throw (e);
    }
    // })
}

module.exports = async (server, filename, path) => {

    new Endpoint(server, filename, {
        method: Endpoint.GET,
        path
    }, null,
        async (req, res, endpoint, tools) => {
            if (process.env.APP_MODE != "production") {
                res.header("Content-Type", "application/json");
                return res.status('503').send({
                    status: 503, "reason": "Service Unavailable", "msg": "League-Endpoint only available in 'production' mode", "url": "https://http.cat/503"
                }, null, 3);
            }

            if (!Endpoint._ready) {
                res.header("Content-Type", "application/json");
                return res.status(102).send(JSON.stringify({ status: "102", msg: "Categories are still registering", url: "https://http.cat/102" }, null, 3))
            }
            let tag = req.query.tag;
            if (tag && Endpoint._categories[tag.toLowerCase()]) {
                res.header("Content-Type", "application/json");
                res.send(JSON.stringify({ url: await league(tag) }, null, 3))
                //JSON.stringify({ url: output }, null, 3)
            } else {
                res.header("Content-Type", "application/json");
                res.status(404).send(JSON.stringify({ status: "404", msg: "Tag not found", url: "https://http.cat/404", tags: Object.keys(Endpoint._categories) }, null, 3))
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
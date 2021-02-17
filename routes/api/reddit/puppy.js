const randomPuppy = require('random-puppy');

module.exports = {
    type: "get",
    execute: async (req, res, endpoint, tools) => {

        randomPuppy('puppies')
            .then(url => {
                let image = url;
                if (image.endsWith(".mp4")) {
                    res.redirect(`/api/${endpoint}`);
                } else {
                    res.header("Content-Type", "application/json")
                    res.send(JSON.stringify({ url: image }, null, 3));
                }
            })
    }
}
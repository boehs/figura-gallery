function getModel_new(player, callback) {
    var fetch = require('node-fetch'),
        MojangAPI = require('mojang-api');

    MojangAPI.nameToUuid(player, function(err, res) {
        if (err) console.log(err);
        else {
            let url = "http://figura.blancworks.org/api/avatar/" + res[0].id;
            let settings = { method: "GET" }

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => { return callback(json.data) });
        }
    });
}

module.exports = { getModel_new }
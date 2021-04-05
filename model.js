function getModel(player, callback) {
    var fs = require('fs'),
        nbt = require('nbt'),
        fetch = require('node-fetch'),
        MojangAPI = require('mojang-api');

    MojangAPI.nameToUuid(player, function(err, res) {
        if (err)
            console.log(err);
        else {
            // let url = "http://tmshader.me/figura-test/" + res[0].id + ".json";
            let url = "http://figura.blancworks.org/api/avatar/" + res[0].id;
            
            let settings = {
                method: "GET"
            }

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var raw = JSON.stringify(json.data)
                    const data = Buffer.from(raw, 'base64');

                    nbt.parse(data, function(error, data) {
                        if (error) { throw error; }

                        let model = JSON.stringify(data.value.model.value.parts.value.value);
                        var texture  = Buffer.from(data.value.texture.value.img2.value).toString('base64');

                        return callback([model, texture])
                    });
                });
        }
    });
}

module.exports = { getModel }
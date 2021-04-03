var fs = require('fs'),
    nbt = require('nbt'),
    fetch = require('node-fetch');
 
// var data = fs.readFileSync('base64.dat');

let url = "http://figura.blancworks.org/api/avatar/8e437b09425747dba1ef50f5eeef7cfa";
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
        
            //fs.writeFileSync('model.json', model);
            //fs.writeFileSync("texture.png", texture, 'base64');
        });
    });
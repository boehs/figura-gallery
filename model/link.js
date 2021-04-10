const mongoose = require("mongoose");

const LinkSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: false,
        default: ""
    },
    expireAt: {
        type: Date,
        default: (new Date()).setMinutes( (new Date()).getMinutes() + 5 )
    }
});

LinkSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("link", LinkSchema);


/*
mongoose.model("link").createIndexes(function(err) {
    console.log('create index', err)
})


,
    expire: {
        type: Date,
        index: {
            expireAfterSeconds: 5
        }
    }
*/
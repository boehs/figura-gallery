const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    minecraftUUID: {
        type: String,
        default: ""
    }, 
    models: {
        type: Array
    }
});

module.exports = mongoose.model("user", UserSchema);
const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    password: {
        type: String,
        required: true,
    }
}, { versionKey: false });

//versionKey 하면 몽고디비에 들어갈 때 __v필드값 안 들어가게 해줌

module.exports = mongoose.model('Posts', postsSchema);
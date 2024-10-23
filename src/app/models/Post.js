const User = require('./User')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    post_title: { 
        type: String, 
        required: true 
    },
    post_content: { 
        type: String, 
        required: true },
    post_comments: [{ 
        comment_content: String,
        reply_to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        // like: {type: Number, default: 0},
        // dislike: {type: Number, default: 0}
    }],
    date_created: { 
        type: Date, 
        default: Date.now 
    },
    is_deleted: { 
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('Post', Post)
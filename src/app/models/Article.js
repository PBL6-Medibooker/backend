const Doctor = require('./Doctor')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Article = new Schema({
    doctor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    article_title: { 
        type: String, 
        required: true 
    },
    article_description: { 
        type: String, 
        required: true 
    },
    article_image: { 
        type: Buffer, 
        required: true 
    },
    article_content: { 
        type: String, 
        required: true 
    },
    date_published: { 
        type: Date, 
        default: Date.now 
    },
    article_comments: [{ 
        replier: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        comment_content: String,
        date_published: { 
            type: Date, 
            default: Date.now 
        },
        // like: {type: Number, default: 0},
        // dislike: {type: Number, default: 0}
    }],
    is_deleted: { 
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('Article', Article)
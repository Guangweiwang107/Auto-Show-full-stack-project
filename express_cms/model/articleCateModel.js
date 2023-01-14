const mongoose = require('./core');
let Schema = mongoose.Schema;
let ArticleCateSchema = mongoose.Schema({
    title: { type: String },
    link: {
        type: String
    },
    pid: {
        type: Schema.Types.Mixed
    },
    sub_title: { type: String },
    keywords: { type: String },
    description: { type: String },
    status: { type: Number, default: 1 },
    sort: { type: Number, default: 100 },
    add_time: { type: Number }
})

module.exports = mongoose.model("ArticleCate", ArticleCateSchema, "article_cate")

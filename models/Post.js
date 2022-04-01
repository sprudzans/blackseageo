import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    // owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: { type: String},
    text: { type: String},
    desc: { type: String},
    type: { type: String},
    image: { type: mongoose.Schema.Types.Mixed },
    gallery: {type: Array},
    fields: { type: mongoose.Schema.Types.Mixed },
    comments: {type: Array},
    likes: {type: Number},
    social: {type: String},
    contact: {type: String},
    phone: {type: String},
    published: {type: Boolean, default: false}
}, {
    timestamps: true
})

export default mongoose.models.Post || mongoose.model('Post', postSchema)
import Post from "../models/Post.js";
import {dbConnect, dbDisconnect} from "../config/dbconnect.js";
import mongoose from "mongoose";
import fs from "fs"

export default {
    getPostData: async (id) => {
        if (!mongoose.isValidObjectId(id)) return {}
        await dbConnect()
        const result = await Post.findById(id).lean().exec()
        await dbDisconnect()
        if (result === null) return {}
        return {
            ...result,
            createdAt: result.createdAt.toString().slice(0, 21),
            link: result.social === "tg" ? `https://t.me/${result.contact}`
                : result.social === "fb" ? `https://www.facebook.com/${result.contact}`
                    : result.contact
        }
    },

    getPostsData: async (filter) => {
        await dbConnect()
        const result = await Post.find(filter).lean().exec()
        await dbDisconnect()
        if (result.length) return result.map(data => {
            return {
                ...data,
                createdAt: data.createdAt.toString().slice(0, 21),
                text: data.text ? data.text.replace(/(\r\n|\n|\r)/gm, '<br>') : "",
                link: data.social === "tg" ? `https://t.me/${data.contact}`
                    : data.social === "fb" ? `https://www.facebook.com/${data.contact}`
                        : data.contact
            }
        })
        else return []
    },

    createPost: async (data) => {
        await dbConnect()
        const result = await Post.create(data)
        await dbDisconnect()
        return result
    },

    updatePost: async (id, update) => {
        await dbConnect()
        const result = await Post.findById(id)
        if(update.image && result.image && fs.existsSync(result.image.path)) {
            fs.unlinkSync(result.image.path)
        }
        // save-array
        update.oldGallery = update.oldGallery.split(',')
        if(result.gallery.length){
            result.gallery.forEach(pic => {
                if(!update.oldGallery.includes(pic.filename)) fs.unlinkSync(pic.path)
            })
            update.gallery = update.gallery ? update.gallery : []
            update.gallery = [...result.gallery.filter(pic => update.oldGallery.includes(pic.filename)), ...update.gallery]
        }

        for (let key in update) {
            result[key] = update[key]
        }
        await result.save();
        await dbDisconnect()
        return result
    },

    deletePost: async (id) => {
        await dbConnect()
        const result = await Post.findByIdAndDelete(id)
        await dbDisconnect()
        if (result) {
            if (result.image && fs.existsSync(result.image.path)) await fs.unlinkSync(result.image.path);
            if (result.gallery) result.gallery.forEach(pic => fs.existsSync(pic.path) ? fs.unlinkSync(pic.path) : true)
        }
    },

    addComments: async (id, data) => {
        await dbConnect()
        const result = await Post.findById(id)
        result.comments = [...result.comments, data]
        await result.save();
        await dbDisconnect()
    }
}


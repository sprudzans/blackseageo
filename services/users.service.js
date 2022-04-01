import User from "../models/User.js"
import {dbConnect, dbDisconnect} from "../config/dbconnect.js";

// func for auth (passport)
export default {
     getUser: async function(username) {
        await dbConnect()
        const result = await User.findOne({username: username}).exec()
        await dbDisconnect()
        return result
    },

     getUserData: async function(username) {
        await dbConnect()
        const {_id, isAdmin, social, contact, phone} = await User.findOne({username: username}).lean().exec()
        await dbDisconnect()
        return {
            _id,
            username,
            isAdmin,
            social,
            contact,
            phone,
            link: social === "tg" ? `https://t.me/${contact}`
                : social === "fb" ? `https://www.facebook.com/${contact}`
                    : contact
        }
    },

     getUsersData: async function(filter) {
        await dbConnect()
        const result = await User.find(filter).lean().exec()
        await dbDisconnect()
        return result.map(el => {
            return {
                _id: el._id,
                username: el.username,
                isAdmin: el.isAdmin,
                social: el.social,
                contact: el.contact,
                phone: el.phone,
                link: el.social === "tg" ? `https://t.me/${el.contact}`
                    : el.social === "fb" ? `https://www.facebook.com/${el.contact}`
                        : el.contact
            }
        })
    },

     createUser: async function(username, password) {
        await dbConnect()
        const {_id} = await User.create({username, password})
        await dbDisconnect()
        return _id
    },

     updateUser: async function(username, update) {
        await dbConnect();
        await User.findOneAndUpdate({username: username}, update)
        await dbDisconnect()
    },

     deleteUser: async function(username) {
        await dbConnect();
        await User.findOneAndDelete({username: username})
        await dbDisconnect()
    }
}
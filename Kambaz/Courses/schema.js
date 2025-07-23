import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    image: {
        type: String,
        default: ""
    }
}, { collection: "courses" });

export default courseSchema;
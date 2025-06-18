import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
    _id: String,
    title: String,
    course: String,
    available_dt: Date,
    due_dt: Date,
    until_dt: Date,
    description: String,
    points: Number
},
    { collection: "assignments" }
);
export default assignmentSchema;
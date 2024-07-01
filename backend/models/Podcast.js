import mongoose from "mongoose";

const PodcastSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

export default mongoose.model('Podcast', PodcastSchema);
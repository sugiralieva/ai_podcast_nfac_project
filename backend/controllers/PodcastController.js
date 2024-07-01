import PodcastModel from '../models/Podcast.js';

export const create = async (episode, title, url) => {
    try {
        const doc = new PodcastModel({
            episode,
            title,
            url
        });

        const post = await doc.save()
        console.log('podcast data was saved')

    } catch (err) {
        console.log(err)
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PodcastModel.find()

        res.json(posts);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:'Не удалось получить подкасты'
        })
    }
}
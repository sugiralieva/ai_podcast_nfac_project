import PodcastModel from '../models/Podcast.js';

export const create = async (episode, title, url, description) => {
    try {
        const doc = new PodcastModel({
            episode,
            title,
            url,
            description
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

export const getOne = async (req, res) => {
    try {
        const podcastId = req.params.id;
        const doc = await PodcastModel.findById(podcastId)

        if (!doc) {
            return res.status(404).json({
                message: 'Подкаст не найден'
            });
        }

        res.status(200).json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить подкаст'
        });
    }
};
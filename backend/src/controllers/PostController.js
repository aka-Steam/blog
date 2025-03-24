import Post from '../models/Post.js';
import User from '../models/User.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
        });

        const tags = posts
            .map((post) => post.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить тэги',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findByPk(postId, {
            include: [{ model: User, as: 'user', attributes: ['_id', 'fullName', 'email'] }],
        });

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        post.viewsCount += 1;
        await post.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        await post.destroy();

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const { title, text, imageUrl, tags } = req.body;

        const post = await Post.create({
            title,
            text,
            imageUrl,
            tags: tags,
            userId: req.userId,
        });

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, text, imageUrl, tags } = req.body;

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        post.title = title;
        post.text = text;
        post.imageUrl = imageUrl;
        post.tags = tags;
        post.userId = req.userId;

        await post.save();

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

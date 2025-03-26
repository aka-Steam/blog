import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
import User from './User.js';

class Post extends Model { }

Post.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        tags: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
        viewsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Post',
        timestamps: true,
    },
);

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Post;

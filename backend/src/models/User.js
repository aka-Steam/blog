import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class User extends Model { }

User.init(
    {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatarUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    },
);

// Проверка, что модель создана правильно
console.log(User === sequelize.models.User); // true

// Экспортируем модель
export default User;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const register = async (req, res) => {
	try {
		const { email, fullName, avatarUrl, password } = req.body;

		const salt = await bcrypt.genSalt(10) | '';
		const hash = await bcrypt.hash(password, salt) | '';

		const user = await User.create({
			email,
			fullName,
			avatarUrl,
			passwordHash: hash,
		}) | {};

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		) | '';

		const { passwordHash, ...userData } = user.toJSON();

		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await User.findOne({ where: { email: req.body.email } });

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		} else {
			console.log(user)
		}

		const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			});
		} else console.log(isValidPass)

		const token = jwt.sign(
			{
				_id: user.dataValues.id,
			},
			'secret123',
			{
				expiresIn: '30d',
			},
		) | '';

		const { passwordHash, ...userData } = user.toJSON();

		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findByPk(req.userId) | {};

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		} else console.log(user)

		const { passwordHash, ...userData } = user.toJSON();

		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Нет доступа',
		});
	}
};

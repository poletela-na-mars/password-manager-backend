import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js';

const sendTokenAndUserDataResponse = (user, res) => {
	const token = jwt.sign({
			_id: user._id,
		},
		process.env.SECRET_HASH_KEY,
		{
			expiresIn: '2d',
		},
	);

	const { passwordHash, ...userData } = user._doc;

	return res.json({
		...userData,
		token,
	});
};

export const register = async (req, res) => {
	try {
		const password = req.body.password;
		const saltRounds = 12;
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			passwordHash: hash,
		});

		const user = await doc.save();

		sendTokenAndUserDataResponse(user, res);
	} catch (err) {
		console.error(err);
		if (err.name === 'MongoServerError' && err.code === 11000) {
			return res.status(400).json({
				path: 'email',
				msg: 'Аккаунт с таким email уже существует.',
			});
		}

		return res.status(500).json({
			msg: 'Проблемы на стороне сервера. Попробуйте позже',
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(400).json({
				msg: 'Неверный e-mail или пароль',
			});
		}

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		if (!isValidPass) {
			return res.status(400).json({
				msg: 'Неверный e-mail или пароль',
			});
		}

		sendTokenAndUserDataResponse(user, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			msg: 'Проблемы на стороне сервера. Попробуйте позже',
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				msg: 'Пользователь не найден',
			});
		}

		const { passwordHash, ...userData } = user._doc;

		res.json({ ...userData });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			msg: 'Нет доступа',
		});
	}
};
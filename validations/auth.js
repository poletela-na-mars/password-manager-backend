import { body } from 'express-validator';

// TODO - check for password fields equality

export const registerValidation = [
	body('email', 'Неверный формат почты.').isEmail().isLength({ min: 5, max: 40 }).withMessage('Неверный формат почты'),
	body('password',
		'Пароль должен содержать 8 и более символов, строчные(-ую) и заглавные(-ую) буквы(-у), цифры(-у) и специальный(-е) символ(-ы) (-#!$@%^&*()_+ и др.)')
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
			returnScore: false,
			pointsPerUnique: 1,
			pointsPerRepeat: 0.5,
			pointsForContainingLower: 10,
			pointsForContainingUpper: 10,
			pointsForContainingNumber: 10,
			pointsForContainingSymbol: 10,
		})
		.isLength({ max: 40 })
		.withMessage('Пароль должен содержать не более 40 символов.'),
		body('passwordRepeat')
		.custom((value, {req}) => value === req.body.password).withMessage('Пароли должны совпадать.'),
];
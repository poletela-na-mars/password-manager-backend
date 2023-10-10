import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { UserController } from './controllers/index.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { registerValidation } from './validations/auth.js';

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB OK'))
	.catch((err) => console.error('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/login', handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/checkAuth', checkAuth, UserController.getMe);

const port = process.env.PORT || 4444;
app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log('Server OK');
	console.log(`Server is running on ${port}`);
});
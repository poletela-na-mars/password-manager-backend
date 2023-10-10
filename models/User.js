import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
			required: true,
		}
	},
	{
		timestamps: true,
	},
);

UserSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.passwordHash;
	return obj;
};

export default mongoose.model('User', UserSchema);

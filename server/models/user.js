import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: { type: String, trim: true, required: true, min: 3, max: 64 },
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: { type: String, required: true, min: 6, max: 64 },
		role: {
			type: [String],
			default: ['Student'],
			enum: ['Student', 'Instructor', 'Admin'],
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		passwordResetCode: {
			type: String,
			default: '',
		},
		courses:{
			type: [String],
			default: []
		}
	},

	{ timestamps: true }
);

export default mongoose.model('User', userSchema);

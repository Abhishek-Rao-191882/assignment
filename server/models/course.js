import mongoose from 'mongoose';
const { Schema } = mongoose;

const courseSchema = new Schema(
	{
        name: { 
            type: String,
            trim: true,
            required: true 
        },
		syllabus: { 
            type: [String],
            required: true 
        }
	},

	{ timestamps: true }
);

export default mongoose.model('Course', courseSchema);

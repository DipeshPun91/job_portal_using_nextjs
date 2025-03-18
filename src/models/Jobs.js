import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    remote: {
      type: Boolean,
      required: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Jobs || mongoose.model("Jobs", jobSchema);

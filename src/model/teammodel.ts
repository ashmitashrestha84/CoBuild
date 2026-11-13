import mongoose from "mongoose";
import { Schema } from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [3, "Team name must be at least 3 characters"],
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
      unique: true,
    },

    leader: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],

    max_members: {
      type: Number,
      default: 5,
      min: [2, "A team must allow at least 2 members"],
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model("team", teamSchema);
export default Team;

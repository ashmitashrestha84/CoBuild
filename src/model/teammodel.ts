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
//ensure leader is in member list
teamSchema.pre("validate", function () {
  if (
    this.leader &&
    !this.members.some((member) => member.toString() === this.leader.toString())
  ) {
    this.members.push(this.leader);
  }
});

// Prevent duplicate members
teamSchema.path("members").validate(function (members) {
  const memberIds = members.map((member:any) => member.toString());

  return new Set(memberIds).size === memberIds.length;
}, "Duplicate team members are not allowed");

const Team = mongoose.model("team", teamSchema);

export default Team;

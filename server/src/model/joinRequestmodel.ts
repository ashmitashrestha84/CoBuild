
import mongoose, { Schema } from "mongoose";
import { RequestStatus } from "../types/enumtypes";

const joinRequestSchema = new mongoose.Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: [true, "Project ID is required"],
    },

    requester: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending requests
joinRequestSchema.index(
  { project: 1, requester: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: RequestStatus.PENDING,
    },
  }
);

const JoinRequest = mongoose.model("joinRequest", joinRequestSchema);

export default JoinRequest;

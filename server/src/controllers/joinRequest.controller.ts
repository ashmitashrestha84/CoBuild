import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import appError from "../utils/appError.utils";
import Project from "../model/projectmodel";
import { ProjectStatus, RequestStatus } from "../types/enumtypes";
import Team from "../model/teammodel";
import JoinRequest from "../model/joinRequestmodel";
import { sendResponse } from "../utils/sendResponse.utils";

//*createJoinRequest
export const createJoinRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const { projectId } = req.params;
    const projectData = await Project.findOne({ _id: projectId });
    if (!projectData) {
      throw new appError("Provided ProjectId doesnot exist", 404);
    }
    const requester = req.user._id;

    if (projectData.owner.toString() === requester.toString()) {
      throw new appError(
        "You cannot send a join request to your own project",
        400,
      );
    }
    if (projectData.status === ProjectStatus.COMPLETED) {
      throw new appError("Project is already completed", 400);
    }
    const teamData = await Team.findOne({ project: projectId });
    if (!teamData) {
      throw new appError("Team not found for this project", 404);
    }
    const isMember = teamData.members.some(
      (member) => member.toString() === requester.toString(),
    );

    if (isMember) {
      throw new appError("You are already a team member", 400);
    }
    const existingRequest = await JoinRequest.findOne({
      project: projectId,
      requester: requester,
      status: RequestStatus.PENDING,
    });
    if (existingRequest) {
      throw new appError("You have already requested to join team", 404);
    }
    const newJoinRequest = new JoinRequest({
      project: projectId,
      requester,
      message,
    });
    await newJoinRequest.save();
    sendResponse(res, {
      message: "Join Request created successfully",
      statusCode: 201,
      data: newJoinRequest,
    });
  },
);
//*getProjectJoinRequests
//* getMyJoinRequests
//* acceptJoinRequest
//* rejectJoinRequest
//* cancelJoinRequest
//* Test authorization and edge cases

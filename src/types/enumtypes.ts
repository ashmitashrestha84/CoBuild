export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const All_Admin = [Role.ADMIN, Role.SUPER_ADMIN];
export const User = [Role.USER];

export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum ProjectVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

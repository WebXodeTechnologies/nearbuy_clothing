import { ROLES } from "./roles";

export const PERMISSIONS = {
  WEBSITE: [ROLES.USER, ROLES.VENDOR, ROLES.ADMIN],

  VENDOR: [ROLES.VENDOR, ROLES.ADMIN],

  ADMIN: [ROLES.ADMIN],
};

export default PERMISSIONS;

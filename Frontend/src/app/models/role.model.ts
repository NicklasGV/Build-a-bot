export interface Role {
    id: number;
    name: string;
  }
export enum RoleId {
  User      = 0,
  Developer = 1,
  Admin     = 2
}
export const constRoles: Role[] = [
  {
    id: 0, 
    name: "User"
  },
  {
    id: 1,
    name: "Developer"
  },
  {
    id: 2,
    name: "Admin"
  }
]
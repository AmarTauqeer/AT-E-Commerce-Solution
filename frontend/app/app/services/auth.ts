import { api } from "../lib/axios";
import { getPermission } from "./user-permissions";
export async function loginUser(data: {
  username: string;
  password: string;
  role: number;
}) {
  try {
    const response = await api.post("/auth/signin", data);
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export async function getUser() {
  try {
    const response = await api.get("/auth/me");
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export async function getUsers() {

  try {
    const response = await api.get("/user/");
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export async function getUserById(id: number) {

  try {
    const response = await api.get("/user/" + id);
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}


export async function logout() {

  try {
    const response = await api.post("/auth/logout");
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export const loggedIn = async () => {
  const user = await getUser()
  let loginStatus = "loggedin"
  if (!user.detail) {
    loginStatus = "loggedin"
  } else {
    loginStatus = "loggedout"
  }
  return loginStatus
}

export async function userAddOrUpdateFormData(data: any) {
  const id = data.id

  if (id == 0) {

    try {
      const response = await api.post("/user", data);
      return await response.data
    } catch (error: any) {
      return await error.response.data
    }
  } else {

    try {
      const response = await api.patch("/user/update/" + id, data);
      return await response.data
    } catch (error: any) {
      return await error.response.data
    }
  }

}

export async function getUserAndPermissions() {
  const currentUser = await getUser()
  const users = await getUsers()
  const filterUsers = users.filter((u: any) => u.email == currentUser.sub)
  if (filterUsers.length > 0) {
    const userId = filterUsers[0].id
    const userPermissions = await getPermission()
    const filterPermission = userPermissions.filter((up: any) => up.user == userId)
    const data = {
      'user': filterUsers[0],
      'permissions': filterPermission
    }
    return data
  } else {
    const data = {
      'user': {},
      'permissions': []
    }
    return data
  }

}

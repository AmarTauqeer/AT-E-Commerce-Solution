import { api } from "../lib/axios";
import { DeletePermissionData } from "./helper/delete_data";

export async function getPermission() {
  const response = await api.get("/user-permission/");
  return response.data;
}

export async function permissionDelete(requestData:any) {
    return await DeletePermissionData(requestData);
}

export async function permissionAddOrUpdateFormData(formObj: any) {
    const id = formObj.id

    if (id=="0") {
      const response = await api.post("/user-permission/", formObj);
      return await response.data[0]  
    }else{
      const response = await api.patch("/user-permission/"+id, formObj);
      return await response.data
    }
    
}
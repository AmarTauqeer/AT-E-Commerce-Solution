import { api } from "../lib/axios";
import { DeleteCategoryData } from "./helper/delete_data";
export async function getCategories() {
  const response = await api.get("/category/");
  return response.data;
}

export async function categoryDelete(requestData:any) {
    return await DeleteCategoryData(requestData);
}

export async function categoryAddOrUpdateFormData(formObj: any) {
    const id = formObj.id
    

    if (id=="0") {
      const response = await api.post("/category/", formObj);
      return await response.data[0]  
    }else{
      const response = await api.patch("/category/"+id, formObj);
      return await response.data
    }
    
}
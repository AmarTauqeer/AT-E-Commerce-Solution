import { api } from "../lib/axios";
import { DeleteCategoryData } from "./helper/delete_data";

export async function getCategories() {

  try {
    const response = await api.get("/category/");
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export async function categoryDelete(requestData: any) {
  return await DeleteCategoryData(requestData);
}

export async function categoryAddOrUpdateFormData(formObj: any) {
  const id = formObj.id


  if (id == "0") {

    try {
      const response = await api.post("/category/", formObj);
      return await response.data[0]
    } catch (error: any) {
      return await error.response.data
    }
  } else {

    try {
      const response = await api.patch("/category/" + id, formObj);
      return await response.data
    } catch (error: any) {
      return await error.response.data
    }
  }

}
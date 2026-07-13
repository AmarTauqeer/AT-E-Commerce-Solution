import { api } from "../lib/axios";
import { DeleteProductData } from "./helper/delete_data";

export async function getProducts() {

  try {
    const response = await api.get("/product/");
    return await response.data
  } catch (error: any) {
    // console.log(error.response.data)
    return await error.response.data
  }
}

export async function productDelete(requestData: any) {
  return await DeleteProductData(requestData);
}

export async function productAddOrUpdateFormData(formObj: any) {
  const id = formObj.get("id")

  if (id == "0") {

    try {
      const response = await api.post("/product/", formObj);
      return await response.data[0]
    } catch (error: any) {
      return await error.response.data
    }
  } else {

    try {
      const response = await api.patch("/product/" + id, formObj);
      return await response.data
    } catch (error: any) {
      return await error.response.data
    }
  }

}
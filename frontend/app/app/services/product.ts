import { api } from "../lib/axios";
import { DeleteProductData } from "./helper/delete_data";

export async function getProducts() {
  const response = await api.get("/product/");
  return response.data;
}

export async function productDelete(requestData:any) {
    return await DeleteProductData(requestData);
}

export async function productAddOrUpdateFormData(formObj: any) {
    const id = formObj.get("id")

    if (id=="0") {
      const response = await api.post("/product/", formObj);
      return await response.data[0]  
    }else{
      const response = await api.patch("/product/"+id, formObj);
      return await response.data
    }
    
}
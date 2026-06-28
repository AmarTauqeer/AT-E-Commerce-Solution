import { api } from "../lib/axios";
import { DeleteOrderItemsData } from "./helper/delete_data";

export async function deleteOrderItems(requestData:any) {
    return await DeleteOrderItemsData(requestData);
}

export async function getOrderItems() {
  const response = await api.get("/orderItems/");
  return response.data;
}

export async function orderItemsAddOrUpdateFormData(formObj: any) {
    const id = formObj.id
    console.log(id)

    if (id=="0") {
      const response = await api.post("/orderItems/", formObj);
      return await response.data[0]  
    }else{
      const response = await api.patch("/orderItems/"+id, formObj);
      console.log(response)
      return await response.data
    }
    
}
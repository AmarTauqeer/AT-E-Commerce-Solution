import { api } from "../lib/axios";
import { DeleteOrderData } from "./helper/delete_data";

export async function deleteOrder(requestData:any) {
    return await DeleteOrderData(requestData);
}

export async function getOrders() {
  const response = await api.get("/order/");
  return response.data;
}

export async function orderAddOrUpdateFormData(formObj: any) {
    const id = formObj.id

    if (id=="0") {
      const response = await api.post("/order/", formObj);
      return await response.data[0]  
    }else{
      const response = await api.patch("/order/"+id, formObj);
      return await response.data
    }
    
}

export async function getOrderDetailView(from:string, to:string) {
  const response = await api.get(`/order/view/order-detail-report/${from}/${to}`);
  return response.data;
}
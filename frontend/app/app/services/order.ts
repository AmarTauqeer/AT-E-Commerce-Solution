import { api } from "../lib/axios";
import { DeleteOrderData } from "./helper/delete_data";

export async function deleteOrder(requestData: any) {
  return await DeleteOrderData(requestData);
}

export async function getOrders() {

  try {
    const response = await api.get("/order/");
    return await response.data
  } catch (error: any) {
    return await error.response.data
  }
}

export async function orderAddOrUpdateFormData(formObj: any) {
  const id = formObj.id

  if (id == "0") {

    try {
      const response = await api.post("/order/", formObj);
      return await response.data[0]
    } catch (error: any) {
      return await error.response.data
    }
  } else {

    try {
      const response = await api.patch("/order/" + id, formObj);
      return await response.data
    } catch (error: any) {
      return await error.response.data
    }
  }

}

export async function getOrderDetailView(from: string, to: string) {
  const response = await api.get(`/order/view/order-detail-report/${from}/${to}`);
  return response.data;
}
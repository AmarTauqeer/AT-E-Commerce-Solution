import { api } from "@/app/lib/axios";

export type requestDataType = {
  id: {
    id: string
  }
}

export async function DeleteCategoryData(requestData: requestDataType) {

  const id = parseInt(requestData.id.id);

  try {
    const response = await api.delete("/category/" + id);
    return await response.data.message
  } catch (error: any) {
    return await error.response.data
  }
}

export async function DeleteProductData(requestData: requestDataType) {

  const id = parseInt(requestData.id.id);

  try {
    const response = await api.delete("/product/" + id);
    return await response.data.message
  } catch (error: any) {
    return await error.response.data
  }
}

export async function DeletePermissionData(requestData: requestDataType) {

  const id = parseInt(requestData.id.id);

  try {
    const response = await api.delete("/user-permission/" + id);
    return await response.data.message
  } catch (error: any) {
    return await error.response.data
  }
}

export async function DeleteOrderData(requestData: requestDataType) {

  const id = parseInt(requestData.id.id);

  try {
    const response = await api.delete("/order/" + id);
    return await response.data.message
  } catch (error: any) {
    return await error.response.data
  }


  // if (response.status == 204) {
  //   return "deleted"
  // } else return "not deleted"
}

export async function DeleteOrderItemsData(id: string) {

  // const id =parseInt(requestData.id.id);

  try {
    const response = await api.delete("/orderItems/" + parseInt(id));
    return await response.data.message
  } catch (error: any) {
    return await error.response.data
  }
}
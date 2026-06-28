'use server'
import { cookies } from "next/headers";

export async function getSideBarState() {
  const cookie = await cookies();
  return cookie.get("sidebar_state")?.value    
}



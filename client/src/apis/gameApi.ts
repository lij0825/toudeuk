import { BaseResponse } from "@/types/Base"
import instance from "./clientApi"

export const fetchClick = async ():Promise<void>=> {
    const response = await instance.post<BaseResponse<void>>(`/game/click`)
    if (!response.data.success) {
        throw new Error(response.data.message)
      }
      if (!response.data.data) {
        throw new Error(response.data.message)
      }
}
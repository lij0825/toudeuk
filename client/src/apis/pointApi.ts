import { PointInfo } from "@/types/point";
import instance from "./clientApi";
import { BaseResponse } from "@/types/Base";

export const fetchPoints = async (): Promise<PointInfo[]> => {
    const response = await instance.get<BaseResponse<PointInfo[]>>("/point");
    if(!response.data.success) {
        throw new Error(response.data.message)
    }

    return response.data.data || [];
}
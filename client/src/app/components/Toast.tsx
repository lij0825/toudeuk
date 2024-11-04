import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ToastType enum 정의
export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  LOADING = "loading",
  INFO = "info",
}

// showToast 함수 정의
export function showToast(type: ToastType, message: string) {
  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, {
        className: "bg-green-500 text-white font-semibold rounded-lg shadow-md",
        progressClassName: "bg-white",
      });
      break;
    case ToastType.ERROR:
      toast.error(message, {
        className: "bg-red-500 text-white font-semibold rounded-lg shadow-md",
        progressClassName: "bg-white",
      });
      break;
    case ToastType.LOADING:
      toast.loading(message, {
        className:
          "bg-yellow-500 text-white font-semibold rounded-lg shadow-md",
        progressClassName: "bg-white",
      });
      break;
    case ToastType.INFO:
    default:
      toast.info(message, {
        className: "bg-blue-500 text-white font-semibold rounded-lg shadow-md",
        progressClassName: "bg-white",
      });
      break;
  }
}

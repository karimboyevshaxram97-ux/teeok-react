import Swal from "sweetalert2";
import { Messages } from "./config";

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: message,
    showConfirmButton: false,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });
  Toast.fire({ icon: "success", title: msg }).then();
};

export const sweetLoginRequiredAlert = async (): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "warning",
    title: "로그인이 필요합니다",
    text: "이 기능을 사용하려면 먼저 로그인해 주세요.",
    showCancelButton: true,
    confirmButtonText: "로그인",
    cancelButtonText: "닫기",
  });
  return result.isConfirmed;
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") window.location.replace(forward_url);
  });
};

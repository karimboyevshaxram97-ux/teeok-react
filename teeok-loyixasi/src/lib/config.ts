import axios from "axios";

export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
};

export const axiosInstance = axios.create({
  baseURL: serverApi,
  withCredentials: true,
  timeout: 10000,
});

// Registered by ContextProvider so the interceptor can clear React auth state too, not just localStorage
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;
export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

// On 401 → clear local auth state and go home
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("memberData");
      unauthorizedHandler?.();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

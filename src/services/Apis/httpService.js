import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";
import { apiUrl } from "../../config.json";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    logger.log(error);
    toast.error("An unexpected error occurrred.");
  }

  return Promise.reject(error);
});

// function setJwt(jwt) {
//   axios.defaults.headers.common["x-auth-token"] = jwt;
// }

var localhost=false;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  localhost=true;

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  baseUrl: localhost?"http://localhost:3009":apiUrl
  // setJwt
};

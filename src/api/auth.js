import { postData } from "@/api/api";

export const login = async (formData) => {
  let uri = "/api/auth/signin";
  return await postData(uri, formData);
};

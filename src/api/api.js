import axios from "axios";

export const getData = async (uri) => {
  return await axios.get(`http://127.0.0.1:8080${uri}`);
};

export const deleteData = async (uri) => {
  return await axios.delete(`http://127.0.0.1:8000${uri}`);
};

export const postData = async (uri, formData) => {
  return await axios.post(`http://127.0.0.1:8080${uri}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const patchFormData = async (uri, formData) => {
  return await axios.post(`http://127.0.0.1:8080${uri}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

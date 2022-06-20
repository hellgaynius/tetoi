import axios from 'axios';

export const apiMethods = {
  publishInstance(storage) {
    return this.decorateResponse(axios.post(process.env.BASE_API_URL + '/', storage));
  },

  getInstance(id) {
    return this.decorateResponse(axios.get(process.env.BASE_API_URL + id));
  },

  updateInstance(storage, id) {
    return this.decorateResponse(axios.put(process.env.BASE_API_URL + id, storage));
  },

  deleteInstance(id) {
    return this.decorateResponse(axios.delete(process.env.BASE_API_URL + id));
  },

  decorateResponse(axiosPromise) {
    return axiosPromise
      .then(responseObj => {
        return responseObj.data;
      })
      .catch(error => {
        return Promise.reject(error.response.data);
      });
  },
};

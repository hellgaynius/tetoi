import axios from 'axios';

const PATH = import.meta.env.VITE_BASE_API_URL;

export default {
  publish(storage) {
    return this.decorateResponse(axios.post(PATH + '/', storage));
  },

  get(id) {
    return this.decorateResponse(axios.get(PATH + id));
  },

  update(storage, id) {
    return this.decorateResponse(axios.put(PATH + id, storage));
  },

  delete(id) {
    return this.decorateResponse(axios.delete(PATH + id));
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

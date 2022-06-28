import axios from 'axios';

const PATH = import.meta.env.VITE_BASE_API_URL;

export const projectApi = {
  publish(storage) {
    return decorateResponse(axios.post(PATH + '/', storage));
  },

  get(id) {
    return decorateResponse(axios.get(PATH + id));
  },

  update(storage, id) {
    return decorateResponse(axios.put(PATH + id, storage));
  },

  delete(id) {
    return decorateResponse(axios.delete(PATH + id));
  },
};

function decorateResponse(axiosPromise) {
  return axiosPromise
    .then(responseObj => {
      return responseObj.data;
    })
    .catch(error => {
      return Promise.reject(error.response.data);
    });
};

export const browserStorage = {
  reset() {
    localStorage.clear();
  },

  handle(isProjectFilled, isProjectPublished, itemName, post) {        
    if (!isProjectFilled) {
      this.reset();
    } else if (isProjectPublished) {
      return false;
    } else {
      localStorage.setItem(itemName, JSON.stringify(post));
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(itemName);

    if (storage) {
      return JSON.parse(storage);
    } else {
      return null;
    }
  },
};

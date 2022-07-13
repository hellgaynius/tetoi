export const browserStorage = {
  reset() {
    localStorage.clear();
  },

  handle(isProjectFilled, isProjectPublished, itemName, object) {        
    if (!isProjectFilled) {
      this.reset();
    } else if (isProjectPublished) {
      return false;
    } else {
      localStorage.setItem(itemName, JSON.stringify(object));
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(itemName);

    return storage ? JSON.parse(storage) : null;
  },
};

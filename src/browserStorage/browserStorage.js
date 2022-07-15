export const browserStorage = {
  remove(itemName) {
    localStorage.removeItem(itemName);
  },

  saveItem(itemName, object) {
    localStorage.setItem(itemName, JSON.stringify(object))
  },

  handlePostObject(isProjectFilled, isProjectPublished, itemName, object) {        
    if (!isProjectFilled) {
      this.remove(itemName);
    } else if (isProjectPublished) {
      return false;
    } else {
      this.saveItem(itemName, object);
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(itemName);

    return storage ? JSON.parse(storage) : null;
  },
};

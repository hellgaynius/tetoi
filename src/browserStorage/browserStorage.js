const SETTINGS_ITEM_NAME = 'settings';
const PROJECT_ITEM_NAME = 'project';

const storageMatchingTable = {
  'settings': SETTINGS_ITEM_NAME,
  'project': PROJECT_ITEM_NAME,
};

export const browserStorage = {
  remove(itemName) {
    localStorage.removeItem(storageMatchingTable[itemName]);
  },

  saveItem(itemName, object) {
    localStorage.setItem(storageMatchingTable[itemName], JSON.stringify(object));
  },

  handlePostObject(isProjectFilled, isProjectPublished, itemName, object) {
    if (!isProjectFilled) {
      this.remove(storageMatchingTable[itemName]);
    } else if (isProjectPublished) {
      return false;
    } else {
      this.saveItem(itemName, object);
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(storageMatchingTable[itemName]);

    return storage ? JSON.parse(storage) : null;
  },
};

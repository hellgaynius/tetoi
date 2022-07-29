const SETTINGS_ITEM_NAME = 'settings';
const POST_ITEM_NAME = 'post';

const storageMatchingTable = {
  'settings': SETTINGS_ITEM_NAME,
  'post': POST_ITEM_NAME,
};

export const browserStorage = {
  remove(...items) {
    items.forEach(item => localStorage.removeItem(storageMatchingTable[item]));
  },

  saveItem(itemName, object, isProjectPublished, isProjectFilled = true ) {
    if (!isProjectFilled) {
      this.remove(storageMatchingTable[itemName]);
    } else if (isProjectPublished) {
      return false;
    } else {
      localStorage.setItem(storageMatchingTable[itemName], JSON.stringify(object));
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(storageMatchingTable[itemName]);

    return storage ? JSON.parse(storage) : null;
  },
};

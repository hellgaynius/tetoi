const LOCAL_SETTINGS_ITEM_NAME = 'localSettings';
const LOCAL_PROJECT_ITEM_NAME = 'localProject';

const storageItems = {
  'settings': LOCAL_SETTINGS_ITEM_NAME,
  'project': LOCAL_PROJECT_ITEM_NAME,
};

export const browserStorage = {
  remove(itemName) {
    localStorage.removeItem(storageItems[itemName]);
  },

  saveItem(itemName, object) {
    localStorage.setItem(storageItems[itemName], JSON.stringify(object));
  },

  handlePostObject(isProjectFilled, isProjectPublished, itemName, object) {
    if (!isProjectFilled) {
      this.remove(storageItems[itemName]);
    } else if (isProjectPublished) {
      return false;
    } else {
      this.saveItem(itemName, object);
    }
  },

  fetch(itemName) {
    const storage = localStorage.getItem(storageItems[itemName]);

    return storage ? JSON.parse(storage) : null;
  },
};

function toggleDisabledInDomCollection(collectionObject, isActive = false) {
  Object
    .values(collectionObject)
    .forEach(item => {
      item.toggleAttribute('disabled', !isActive);
    });
};



export { toggleDisabledInDomCollection, debounce }

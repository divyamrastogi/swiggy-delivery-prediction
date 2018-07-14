function setItem(key, value) {
  try {
    let v = value;
    if (typeof (value) === 'object') {
      v = JSON.stringify(value);
    }
    localStorage.setItem(key, v);
    return true;
  } catch (e) {
    console.log('utils:setItem:error', e);
    return false;
  }
}

function getItem(key) {
  let item = localStorage.getItem(key);
  try {
    item = JSON.parse(item);
  } catch (e) {
    // It wasn't an object
  }
  return item;
}

const localStorageUtil = {
  setItem,
  getItem,
};

export default localStorageUtil;

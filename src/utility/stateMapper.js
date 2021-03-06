import { localForageService } from './localForageService';
import localforageGetItems from 'localforage-getitems';

export const setPersistedState = (state) => {
  const persistedState = mapToPersistedState(state);

  const promises = [];
  return new Promise((resolve, reject) => {
    persistedState.forEach(thing => {
      promises.push(localForageService.setItem(thing.id, thing));
    });

    Promise.all(promises)
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      reject(error);
    })
  });
};

export const getPersistedState = (fetchKey) => {
  if(fetchKey) {
    return localForageService.getItem(fetchKey);
  } else {
    // get everything!!
    return localForageService.getItems().then(resultObj => {
      return Promise.resolve(Object.values(resultObj));
    });
  }
  // u decide how to fetch from cache
}

export const deletePersistedState = (state, payload) => {
  console.log('delete', state, payload)
  return localForageService.removeItem(payload);
  // u decide how to delete cache
}

export const mapToPersistedState = (state) => {
  // whatever your business logic is.
  return JSON.parse(JSON.stringify(state.partList.partLists));
};
// import whatever u need from your 'statemapper'... this is just an example.
import { setPersistedState, deletePersistedState } from '@/utility/idb/stateMapper'; 

//decide which mutations you want to listen in on, for persisting app data
const mutationsOfInterest = [
  'partList/setPartList',
  'partList/addToPartList'
];

const ofInterest = (mutation) => {
  return mutationsOfInterest.includes(mutation);
};

export const persistencePlugin = (store) => {
  store.subscribe((mutation, state) => {
    if(mutation.type == 'partList/deletePartList') {
      deletePersistedState(state, mutation.payload);
    }else if (ofInterest(mutation.type)) {
      // handover to relevant get/set mappings. straightfwd example would be:
      setPersistedState(state).catch(error => {
        // wow why so unlucky... handle error here
      }); 
    }
  });
};
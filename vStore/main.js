import { proxy, useSnapshot, subscribe } from "valtio";
import { derive, subscribeKey, watch } from "valtio/utils";
import Fuse from "fuse.js";
let fuse;
const state = proxy({
  prescriptions: [],
  search: "",
  searchResult: [],
  userInfo: {},
  prescriptionPersonalizeData:{
    personalize:"NO",
    week1:'',
    week2:'',
    week3:'',
    week4:'',
  },
  list:[],
  users:[]
});

export const setUsers = (usersDTO)=>{
  return state.users = usersDTO;
  }
export const setPrescriptions = (prescriptions) => {
  state.prescriptions = prescriptions
  /* console.log('prescriptions',prescriptions)  
  console.log('state.prescriptions',state.prescriptions)
  state.prescriptions = prescriptions
  
  console.log('after state.prescriptions',state.prescriptions) */
  /* state.list = prescriptions;
  state.prescriptions = prescriptions */
  /* console.log('after setPrescriptions',state.list) */
  fuse = new Fuse(state.prescriptions, {
    keys: [
      "id",
      "register.pet.name",
      "register.pet.breed",
      "register.owner.name",
    ],
    includeScore: true,
    shouldSort: true,
  });
  evalSearch();
};
export const setSearch = (search) => {
  state.search = search;
};

export const evalSearch = () => { 
  if (!fuse || state.search == "") {
    state.searchResult = state.prescriptions.map((val) => ({
      item: val,
      matches: [],
      score: 1,
    }));
    // state.searchTrans = state.transactions.map((val) => ({
    //   item: val,
    //   matches: [],
    //   score: 1,
    // }));
  } else {
    const result = fuse.search(state.search);
    // console.log("FuzzResult: ", result);
    state.searchResult = result.filter((fuzzResult) => fuzzResult.score <= 0.2);
  }
};

export const setUserInfo = (info) => {
  return state.userInfo = info
};

export const setPersonalizePrescription = (personalizeinfo) => {
  return state.prescriptionPersonalizeData = personalizeinfo
};

export const setPrescription2 = (prescription) => {
  return state.prescriptions = ()=>prescription
};

subscribeKey(state, 'userInfo', (v) =>
  console.log('state.count has changed to', v)
)
subscribeKey(state, "search", evalSearch);

// subscribe(state, () => {
//   state.prescriptions = state.prescriptions;
// });
export const useMain =  ()=>useSnapshot(state);
export default state;


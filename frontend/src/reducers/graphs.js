const initialState = [];

export default function graphs(state = initialState, action){
  if(action.type === "ADD_TRACK"){
    return [
      ...state,
      action.payload
    ]
  } else if(action.type === "FETCH_GRAPHS_SUCCESS"){
    return [
      ...action.payload
    ]
    // return [
    //   ...state,
    //   // ...action.payload
    //   action.payload
    // ]
  }
  return state;
}

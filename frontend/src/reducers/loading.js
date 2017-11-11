const initialState = {
  graphsData: true
};

export default function loading(state = initialState, action){
  switch (action.type) {
    case "LOADING_STATE":
      return Object.assign({}, state, {
          graphsData: action.payload
      });
    default:
      return state;
  }
}

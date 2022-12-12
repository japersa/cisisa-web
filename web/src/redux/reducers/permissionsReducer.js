const initialState = {
    isLoaded: false,
    permissions: []
}

export const getInitialState = () => JSON.parse(JSON.stringify(initialState));

const permissionsReducer = (
    state = getInitialState(),
    action
) => {
    switch (action.type) {
      case "DEFINE_PERMISSIONS":
        return Object.assign({}, state, {
          isLoaded: true,
          permissions: action.payload,
        });
      case "RESET_PERMISSIONS":
        return getInitialState();
      default:
        return state;
    }
}

export default permissionsReducer;

const initialState = {
  requests: {
    list: [],
  },
  users: {
    list: [],
  },
  posts: {
    list: [],
  },
  err: null,
  busy: false,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_BUSY':
      return { ...state, busy: action.busy };
    case 'LOAD_REQUESTS':
      return { ...state, requests: { list: action.requests }, err: null };
    case 'LOAD_USERS':
      return { ...state, users: { list: action.requests }, err: null };
    case 'LOAD_POSTS':
      return { ...state, posts: { list: action.posts }, err: null };
    default:
      return { ...state };
  }
}

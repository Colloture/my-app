import firebase from '../../auth/firebase';

export const loadRequests = () => {
  return dispatch => {
    const setBusy = busy => {
      dispatch({ type: 'LOAD_BUSY', busy });
    };

    setBusy(true);

    firebase
      .database()
      .ref(`requests`)
      .on('value', snap => {
        let requests = snap.val() ? Object.values(snap.val()) : [];
        dispatch({ type: 'LOAD_REQUESTS', requests });

        setBusy(false);
      });
  };
};

export const loadUsers = () => {
  return dispatch => {
    const setBusy = busy => {
      dispatch({ type: 'LOAD_BUSY', busy });
    };

    setBusy(true);

    firebase
      .database()
      .ref(`users`)
      .on('value', snap => {
        let requests = Object.values(snap.val());
        dispatch({ type: 'LOAD_USERS', requests });

        setBusy(false);
      });
  };
};

export const loadPosts = () => {
  return dispatch => {
    const setBusy = busy => {
      dispatch({ type: 'LOAD_BUSY', busy });
    };

    setBusy(true);

    firebase
      .database()
      .ref(`posts`)
      .on('value', snap => {
        let posts = Object.values(snap.val());
        dispatch({ type: 'LOAD_POSTS', posts });

        setBusy(false);
      });
  };
};

import firebase from '../../auth/firebase';

export const login = ({ email, password }) => {
  return dispatch => {
    const setBusy = busy => {
      dispatch({ type: 'LOGIN_BUSY', busy });
    };

    setBusy(true);

    let err = null;
    dispatch({ type: 'USER_LOGIN_ERROR', err });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        firebase
          .database()
          .ref(`users/${data.user?.uid}`)
          .on('value', snap => {
            let user = snap.val();
            dispatch({ type: 'USER_LOGIN', user });
            console.log('loginnn: ', user);
            setBusy(false);
          });
      })
      .catch(err => {
        dispatch({ type: 'USER_LOGIN_ERROR', err });
        setBusy(false);
      });
  };
};

export const register = values => {
  return dispatch => {
    let { fullnames, email, phoneno, role, location, password, post, type } =
      values;
    let userData =
      role === 'police'
        ? {
            fullnames,
            email,
            phoneno,
            type,
            role,
            location,
            post,
          }
        : {
            fullnames,
            email,
            phoneno,
            role,
            location,
          };

    const setBusy = busy => {
      dispatch({ type: 'REGISTER_BUSY', busy });
    };

    setBusy(true);

    let err = null;
    dispatch({ type: 'USER_REGISTER_ERROR', err });

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        firebase
          .database()
          .ref('users/' + data.user.uid)
          .set(userData)
          .then(() => {
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                const user = userData;

                dispatch({ type: 'USER_LOGIN', user });
                console.log('loginnn: ', user);
                setBusy(false);
              });
          })
          .catch(err => {
            dispatch({ type: 'USER_LOGOUT_ERROR', err });
            setBusy(false);
          });
      });
  };
};

export const update = values => {
  return (dispatch, getState) => {
    let { firstName, surname, bio, phoneNumber, email, location, interests } =
      values;

    const setBusy = busy => {
      dispatch({ type: 'UPDATE_BUSY', busy });
    };

    setBusy(true);

    firebase
      .firestore()
      .collection('users')
      .doc(`${getState().auth.user?.uid}`)
      .update({
        displayName: firstName + ' ' + surname,
        firstName,
        surname,
        email,
        bio,
        location,
        phoneNumber,
        interests,
      })
      .then(() => {
        // dispatch({ type: 'USER_UPDATE' });
        setBusy(false);
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'USER_UPDATE_ERROR', err });
        setBusy(false);
      });
  };
};

export const logout = () => {
  return dispatch => {
    const setBusy = busy => {
      dispatch({ type: 'LOGIN_BUSY', busy });
    };

    setBusy(true);

    let err = null;
    dispatch({ type: 'USER_LOGOUT_ERROR', err });

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: 'USER_LOGOUT' });
        setBusy(false);
      })
      .catch(err => {
        dispatch({ type: 'USER_LOGOUT_ERROR', err });
        setBusy(false);
      });
  };
};

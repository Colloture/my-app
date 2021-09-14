import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export default function Screen({ children, auth }) {
  const history = useHistory();
  const state = useSelector(state => state);
  const user = state.auth.user;

  useEffect(() => {
    if (JSON.stringify(user) === '{}') {
      !auth && history.push('/');
    }
  }, [history, auth, user]);

  return <div>{children}</div>;
}

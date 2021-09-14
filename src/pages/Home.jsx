import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Screen from '../templates/Screen';

export default function Home() {
  const state = useSelector(state => state);
  const user = state.auth.user;
  const history = useHistory();

  useEffect(() => {
    user.role === 'police' && history.push('/police-home');
    user.role === 'witness' && history.push('/witness-home');
  }, [history, user.role]);

  return <Screen>Redirecting ...</Screen>;
}

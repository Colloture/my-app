import { Avatar, Button, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import imagename from '../Images/icons8-police-96.png';
import { login } from '../store/actions/authActions';
import Screen from '../templates/Screen';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();

  const state = useSelector(state => state);
  const user = state.auth.user;
  const error = state.auth.err;

  useEffect(() => {
    JSON.stringify(user) !== '{}' && history.push('/home');
  }, [history, user]);

  return (
    <Screen auth>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 36,
        }}
      >
        <Avatar
          alt='Remy Sharp'
          src={imagename}
          style={{
            marginBottom: 20,
            height: 100,
          }}
        />
        <Typography
          variant='h5'
          style={{
            fontWeight: 'bold',
            marginBottom: 16,
          }}
        >
          Users Login Page
        </Typography>
        <TextField
          fullWidth
          style={{
            marginBottom: 16,
          }}
          id='P_email'
          label='Input Email'
          variant='outlined'
          value={email}
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          fullWidth
          label='Input password'
          variant='outlined'
          style={{
            marginBottom: 16,
          }}
          value={password}
          onChange={event => {
            setPassword(event.target.value);
          }}
        />
        <div>{error?.message}</div>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          style={{
            marginBottom: 16,
          }}
          onClick={() => {
            dispatch(login({ email, password }));
          }}
        >
          Login
        </Button>
        <Typography
          variant='h6'
          style={{
            float: 'left',
          }}
          onClick={() => {
            history.push('/register');
          }}
        >
          Don't have an Account? Click Here
        </Typography>
      </div>
    </Screen>
  );
}

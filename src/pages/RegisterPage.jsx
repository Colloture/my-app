import {
  Avatar,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import imagename from '../Images/icons8-police-96.png';
import { register } from '../store/actions/authActions';
import { loadPosts } from '../store/actions/dataActions';
import Screen from '../templates/Screen';

export default function RegisterPage() {
  const state = useSelector(state => state);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = state.auth.user;
  const posts = state.data?.posts?.list;

  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [fullnames, setFullnames] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(null);
  const [type, setType] = useState('');
  const [post, setPost] = useState('');
  const [err, setErr] = useState('');

  const userType = [
    {
      value: 'witness',
      label: 'Witness',
    },
    {
      value: 'police',
      label: 'Police officer',
    },
  ];

  const policeType = [
    {
      value: 'investigative',
      label: 'Investigative',
    },
    {
      value: 'traffic',
      label: 'Traffic',
    },
    {
      value: 'wildlife',
      label: 'Wildlife',
    },
  ];

  function getLocation() {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(function (result) {
          if (result.state === 'granted') {
            report(result.state);
            navigator.geolocation.getCurrentPosition(pos => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            });
          } else if (result.state === 'prompt') {
            report(result.state);
            navigator.geolocation.getCurrentPosition(pos => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            });
          } else if (result.state === 'denied') {
            report(result.state);
          }
          result.onchange = function () {
            report(result.state);
          };
        });
      function report(state) {
        console.log('Permission ' + state);
      }
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  useEffect(() => {
    dispatch(loadPosts());
    getLocation();
    JSON.stringify(user) !== '{}' && history.push('/home');
  }, [history, user, dispatch]);

  const submitForm = () => {
    if (fullnames.length < 1 || email.length < 1 || phoneno.length < 1) {
      setErr('Please fill in all fields');
      return;
    }

    if (fullnames.length < 3) {
      setErr('Name is too short');
      return;
    }

    if (phoneno.length !== 10) {
      setErr('Enter valid phone');
      return;
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      setErr('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setErr('Password should have 6 or more characters');
      return;
    }

    if (role === 'police') {
      if (post.length < 1 || type.length < 1) {
        setErr('Please fill in all fields');
        return;
      }
    }

    if (!location) {
      setErr('Location is required');
      return;
    }

    role === 'police'
      ? dispatch(
          register({
            fullnames,
            email,
            phoneno,
            role,
            location,
            password,
            type,
            post: JSON.parse(post),
          })
        )
      : dispatch(
          register({
            fullnames,
            email,
            phoneno,
            role,
            location,
            password,
          })
        );
  };

  // console.log('locain', location);

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
          User SignUp Page
        </Typography>
        <TextField
          required
          fullWidth
          id='p_fullname'
          label='Input FullNames'
          variant='outlined'
          value={fullnames}
          onChange={event => setFullnames(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          fullWidth
          required
          id='p_phoneno'
          label='Input Phone Number'
          variant='outlined'
          value={phoneno}
          onChange={event => setPhoneno(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          required
          fullWidth
          style={{
            marginBottom: 16,
          }}
          type='email'
          id='P_email'
          label='Input Email'
          variant='outlined'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <TextField
          required
          fullWidth
          type='password'
          id='p_password'
          label='Input password'
          variant='outlined'
          value={password}
          onChange={event => setPassword(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          required
          select
          fullWidth
          label='Select Your Role'
          variant='outlined'
          style={{
            marginBottom: 16,
          }}
          value={role}
          onChange={event => setRole(event.target.value)}
        >
          {userType.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {role === 'police' && (
          <>
            <TextField
              select
              fullWidth
              label='Select Police Type'
              variant='outlined'
              style={{
                marginBottom: 16,
              }}
              value={type}
              onChange={event => setType(event.target.value)}
            >
              {policeType.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label='Select Police Post'
              variant='outlined'
              style={{
                marginBottom: 16,
              }}
              value={post}
              onChange={event => setPost(event.target.value)}
            >
              {posts.map(option => (
                <MenuItem key={option.name} value={JSON.stringify(option)}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}

        {location === null && (
          <Button
            variant={'outlined'}
            fullWidth
            style={{
              marginBottom: 16,
            }}
            onClick={() => {
              getLocation();
            }}
          >
            Enable location to proceed
          </Button>
        )}
        {err && (
          <Typography
            color='error'
            variant='body1'
            style={{
              marginBottom: 16,
            }}
          >
            {err}
          </Typography>
        )}
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={submitForm}
          disabled={location === null}
          style={{}}
        >
          Register
        </Button>
        <Typography
          variant='body1'
          style={{
            marginTop: 16,
          }}
          onClick={() => {
            history.push('/');
          }}
        >
          Already have an Account? Click Here
        </Typography>
      </div>
    </Screen>
  );
}

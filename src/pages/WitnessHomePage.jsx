import { Button, Card, Typography } from '@material-ui/core';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../store/actions/authActions';
import { loadUsers } from '../store/actions/dataActions';
import Screen from '../templates/Screen';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

export default function WitnessHomePage() {
  const state = useSelector(st => st);
  const user = state.auth.user;

  const [location, setLocation] = useState(null);
  const [recenter, setRecenter] = useState(false);
  const [displayType, setDisplayType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const police = state.data.users.list
    .filter(({ role }) => role === 'police')
    .filter(police => {
      if (displayType) {
        return police?.type === displayType;
      } else {
        return police;
      }
    });

  const history = useHistory();
  const dispatch = useDispatch();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: '',
  });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    // setMap(null);
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  setTimeout(() => {
    setRecenter(true);
  }, 2000);

  useEffect(() => {
    dispatch(loadUsers());
    getLocation();
  }, [dispatch, recenter]);

  return (
    <Screen>
      <Card
        variant='outlined'
        style={{
          zIndex: 2,
          position: 'fixed',
          top: 8,
          left: 12,
          width: window.innerWidth - 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography color='primary'>
              <b>{user.fullnames}</b>
            </Typography>
            . Witnes
          </div>
          <Button
            size='small'
            variant='outlined'
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Button>
        </div>
      </Card>

      <div
        style={{
          zIndex: 2,
          position: 'fixed',
          top: 64,
          left: 12,
          width: window.innerWidth - 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              setDisplayType(null);
            }}
          >
            All
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              setDisplayType('investigative');
            }}
          >
            Investigative
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              setDisplayType('traffic');
            }}
          >
            Traffic
          </Button>
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              setDisplayType('wildlife');
            }}
          >
            Wildlife
          </Button>
        </div>
      </div>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: location?.latitude, lng: location?.longitude }}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {location && (
            <Marker
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
            ></Marker>
          )}

          {police &&
            police.map(
              ({ location, fullnames, phoneno, email, post, type }) => {
                return (
                  <Marker
                    key={Math.random() * 1000}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                    onClick={() => {
                      setSelectedLocation(location);
                    }}
                  >
                    {selectedLocation === location && (
                      <InfoWindow
                        position={{
                          lat: location.latitude,
                          lng: location.longitude,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            // alignItems: 'center',
                          }}
                        >
                          <Typography variant='body2' color='textPrimary'>
                            {fullnames}
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            {type || 'Investigative'}
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            {phoneno}
                          </Typography>
                          <Typography variant='body2' color='primary'>
                            {post?.name}
                          </Typography>
                          <Button
                            variant='outlined'
                            size='small'
                            onClick={() => {
                              location &&
                                user &&
                                history.push({
                                  pathname: '/send-request',
                                  state: {
                                    currentUser: user,
                                    pemail: email,
                                    location,
                                  },
                                });
                            }}
                          >
                            Send request
                          </Button>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              }
            )}
        </GoogleMap>
      )}
    </Screen>
  );
}

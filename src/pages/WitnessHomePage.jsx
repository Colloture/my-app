import {
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Room } from '@material-ui/icons';
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

const center = {
  lat: -0.43010375799626616,
  lng: 36.98321622015955,
};

export default function WitnessHomePage() {
  const state = useSelector(st => st);
  const user = state.auth.user;
  const police = state.data.users.list.filter(({ role }) => role === 'police');

  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  console.log(police);

  useEffect(() => {
    getLocation();
    dispatch(loadUsers());
  }, [dispatch]);

  return (
    <Screen>
      <Card
        variant='outlined'
        style={{
          zIndex: 2,
          position: 'fixed',
          top: 14,
          left: 18,
          width: window.innerWidth - 36,
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

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location || center}
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
            police.map(({ location, fullnames, phoneno, email }) => {
              console.log('mapLoc: ', location);
              return (
                <Marker
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
                      <List>
                        <ListItem key={email + fullnames}>
                          <ListItemAvatar>
                            <Avatar>
                              <Room />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={fullnames}
                            secondary={phoneno}
                          />
                        </ListItem>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Button
                            variant='outlined'
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
                      </List>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
        </GoogleMap>
      )}
    </Screen>
  );
}

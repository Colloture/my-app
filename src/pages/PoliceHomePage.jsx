import {
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
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
import { logout } from '../store/actions/authActions';
import { loadRequests } from '../store/actions/dataActions';
import Screen from '../templates/Screen';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

export default function PoliceHome() {
  const state = useSelector(st => st);
  const user = state.auth.user;
  const requests = state.data.requests.list;

  const dispatch = useDispatch();

  const [location, setLocation] = useState(null);
  const [otherLocation, setOtheLocation] = useState(null);

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

  getLocation();

  useEffect(() => {
    dispatch(loadRequests());
  }, [dispatch, location]);

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
            . Police
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

      <Card
        style={{
          zIndex: 2,
          position: 'fixed',
          bottom: 16,
          left: 16,
          width: window.innerWidth - 32,
          maxHeight: 200,
          overflowY: 'scroll',
        }}
      >
        <List>
          {requests.map(({ witness, phoneno, location }) => (
            <ListItem key={Math.random() * 1000}>
              <ListItemAvatar>
                <Avatar>
                  <Room />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={witness} secondary={phoneno} />
              <ListItemSecondaryAction>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setOtheLocation({ witness, phoneno, location });
                  }}
                >
                  Show Location
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Card>

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
          {otherLocation && (
            <Marker
              position={{
                lat: otherLocation.location.latitude,
                lng: otherLocation.location.longitude,
              }}
            >
              <InfoWindow
                position={{
                  lat: otherLocation.location.latitude,
                  lng: otherLocation.location.longitude,
                }}
              >
                <div>{otherLocation.witness}</div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      )}
    </Screen>
  );
}

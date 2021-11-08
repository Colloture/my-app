import {
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Modal,
  Typography,
  CardContent,
  CardMedia,
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
import { useHistory } from 'react-router';
import { logout } from '../store/actions/authActions';
import { loadRequests } from '../store/actions/dataActions';
import Screen from '../templates/Screen';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

export default function PoliceHome() {
  const history = useHistory();
  const state = useSelector(st => st);
  const user = state.auth.user;
  const requests = state.data.requests.list;

  const dispatch = useDispatch();

  const [location, setLocation] = useState(null);
  const [otherLocation, setOtherLocation] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);

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
    user?.role === 'witness' && history.push('/witness-home');
    dispatch(loadRequests());
  }, [dispatch, history, location, user?.role]);

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
            . <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          <div>
            {user?.role === 'police' && (
              <Button
                size='small'
                variant='outlined'
                onClick={() => {
                  history.push('/reports');
                }}
                style={{ marginRight: 8 }}
              >
                Reports
              </Button>
            )}
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
          {requests
            .filter(({ pemail }) => user?.email == pemail)
            .slice(0)
            .reverse()
            .map(({ witness, phoneno, location, imageURL, message }) => (
              <ListItem key={Math.random() * 1000}>
                <ListItemAvatar>
                  <Avatar>
                    <Room />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={witness} secondary={phoneno} />
                <ListItemSecondaryAction>
                  <Button
                    style={{ marginRight: 8 }}
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setOtherLocation({
                        witness,
                        phoneno,
                        location,
                        imageURL,
                        message,
                      });
                    }}
                  >
                    Show
                  </Button>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setOtherLocation({
                        witness,
                        phoneno,
                        location,
                        imageURL,
                        message,
                      });

                      setReportOpen(true);
                    }}
                  >
                    View
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

      <ViewRequestModal
        open={reportOpen}
        onClose={() => {
          setReportOpen(false);
        }}
        phone={otherLocation?.phoneno} //
        message={otherLocation?.message}
        imageURL={otherLocation?.imageURL}
        fullnames={otherLocation?.witness} //
      />
    </Screen>
  );
}

const ViewRequestModal = ({
  open,
  onClose,
  phone,
  message,
  imageURL,
  fullnames,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Card style={{ margin: 14 }}>
        <CardContent>
          {imageURL && (
            <CardMedia
              style={{ height: 200, marginBottom: 16 }}
              src={imageURL}
              image={imageURL}
            />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography color='primary'>
              <b>{fullnames} </b>
            </Typography>
            | Witness Request
          </div>
          <Typography color='primary'>{message}</Typography>
          {/* <Button
            color='primary'
            variant='contained'
            size='small'
            style={{ marginRight: 10, marginTop: 16 }}
            onClick={onShowLocation}
          >
            Show
          </Button> */}
          <Button
            variant='outlined'
            size='small'
            style={{ marginRight: 10, marginTop: 16 }}
            onClick={onClose}
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
};

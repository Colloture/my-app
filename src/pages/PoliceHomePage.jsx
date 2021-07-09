import {
  Button,
  Card,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../auth/firebase";
import Screen from "../templates/Screen";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { ListItem } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { Room } from "@material-ui/icons";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: -0.43010375799626616,
  lng: 36.98321622015955,
};

export default function PoliceHome() {
  // const [map, setMap] = useState(null);
  const history = useHistory();
  const mounted = useRef(false);
  const [requests, setRequests] = useState([]);
  const [otherLocation, setOtheLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
  });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    // if (mounted.current) {
    //   setMap(map);
    // }
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    // setMap(null);
  }, []);

  const logout = () => {
    firebase.auth().signOut();
  };

  const dataload = () => {
    firebase
      .database()
      .ref("requests")
      .on("value", (info) => {
        let mydata = info.toJSON();
        console.log("Data: ", Object.values(mydata));
        // if (mounted.current) {
        setRequests(Object.values(mydata));
        // }
      });
  };

  useEffect(() => {
    dataload();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //
      } else {
        history.push("/");
      }
    });
  }, [history]);

  return (
    <Screen>
      <Card
        style={{
          zIndex: 2,
          position: "fixed",
          top: 16,
          left: 16,
          width: window.innerWidth - 32,
        }}
      >
        Police Home
        <Button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Card>

      <Card
        style={{
          zIndex: 2,
          position: "fixed",
          bottom: 16,
          left: 16,
          width: window.innerWidth - 32,
          maxHeight: 200,
          overflowY: "scroll",
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
                  variant="outlined"
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
          center={center}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <Marker
            position={{
              lat: -0.43010375799626616,
              lng: 36.98321622015955,
            }}
          >
            <InfoWindow
              position={{
                lat: -0.43010375799626616,
                lng: 36.98321622015955,
              }}
            >
              <div>Your Position</div>
            </InfoWindow>
          </Marker>
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
                <div>
                  {otherLocation.witness}
                  {/* <br />
                  {otherLocation.phoneno} */}
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      )}
    </Screen>
  );
}

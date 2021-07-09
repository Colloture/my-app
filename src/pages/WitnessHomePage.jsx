import {
  Avatar,
  Button,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import React, { useCallback, useRef, useState } from "react";
import Screen from "../templates/Screen";
import { useHistory } from "react-router-dom";
import firebase from "../auth/firebase";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Room } from "@material-ui/icons";
import { useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: -0.43010375799626616,
  lng: 36.98321622015955,
};

export default function WitnessHomePage() {
  const history = useHistory();
  const mounted = useRef(false);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [map, setMap] = useState(null);
  const [police, setpolice] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const loadPolice = () => {
    firebase
      .database()
      .ref("users")
      .on("value", (info) => {
        let mydata = info.toJSON();
        setpolice(
          Object.values(mydata).filter((user) => user.role !== "witness")
        );
      });
  };

  const logout = () => {
    firebase.auth().signOut();
  };

  useEffect(() => {
    loadPolice();
    getLocation();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref("users/" + user.uid)
          .get()
          .then((info) => {
            // if (mounted.current) {
            setTimeout(() => {
              setCurrentUser(info.val());
            }, 1000);
            // }
          });
      } else {
        history.push("/");
      }
    });

    return () => {
      mounted.current = false;
    };
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
        Witness Home {currentUser?.fullnames}
        <Button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Card>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
          {location && (
            <Marker
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
            >
              <InfoWindow
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
              >
                <div>Your Position</div>
              </InfoWindow>
            </Marker>
          )}

          {police &&
            police.map(({ location, fullnames, phoneno, email }) => {
              console.log("mapLoc: ", location);
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
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => {
                              location &&
                                currentUser &&
                                history.push({
                                  pathname: "/send-request",
                                  state: {
                                    currentUser,
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

import {
  Avatar,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../auth/firebase";
import imagename from "../Images/icons8-police-96.png";
import Screen from "../templates/Screen";

export default function RegisterPage() {
  const history = useHistory();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [fullnames, setFullnames] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);

  const users = [
    {
      value: "witness",
      label: "Witness",
    },
    {
      value: "police",
      label: "Police officer",
    },
  ];

  const register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        firebase
          .database()
          .ref("users/" + data.user.uid)
          .set({
            fullnames,
            email,
            phoneno,
            role,
            location,
          })
          .then(() => {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                //redirect
                firebase
                  .database()
                  .ref("users/" + user.uid)
                  .get()
                  .then((info) => {
                    if (info.val().role === "police") {
                      //redirect to police home
                      history.push("/police-home");
                    } else {
                      //redirect to witness home
                      history.push("/witness-home");
                    }
                  });
              }
            });
          });
      });
  };

  function getLocation() {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            report(result.state);
            // geoBtn.style.display = 'none';
            navigator.geolocation.getCurrentPosition((pos) => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            });
          } else if (result.state === "prompt") {
            report(result.state);
            // geoBtn.style.display = 'none';
            navigator.geolocation.getCurrentPosition((pos) => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            });
          } else if (result.state === "denied") {
            report(result.state);
            // geoBtn.style.display = 'inline';
          }

          result.onchange = function () {
            report(result.state);
          };
        });

      function report(state) {
        console.log("Permission " + state);
      }

      //
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  useEffect(() => {
    getLocation();
  }, [history]);

  return (
    <Screen>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 36,
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src={imagename}
          style={{
            marginBottom: 20,
            height: 100,
          }}
        />
        <Typography
          variant="h5"
          style={{
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Users Sign Up Page
        </Typography>
        <TextField
          fullWidth
          id="p_fullname"
          label="Input FullNames"
          variant="outlined"
          value={fullnames}
          onChange={(event) => setFullnames(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          fullWidth
          id="p_phoneno"
          label="Input Phone Number"
          variant="outlined"
          value={phoneno}
          onChange={(event) => setPhoneno(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          fullWidth
          style={{
            marginBottom: 16,
          }}
          id="P_email"
          label="Input Email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          fullWidth
          id="p_password"
          label="Input password"
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{
            marginBottom: 16,
          }}
        />
        <TextField
          select
          fullWidth
          label="Select Your Role"
          variant="outlined"
          style={{
            marginBottom: 16,
          }}
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          {users.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {location === null && (
          <Button
            variant={"outlined"}
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
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            register();
          }}
          disabled={location === null}
          style={{}}
        >
          Register
        </Button>
      </div>
    </Screen>
  );
}

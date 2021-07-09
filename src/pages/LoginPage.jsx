import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Avatar } from "@material-ui/core";
import imagename from "../Images/icons8-police-96.png";
import Screen from "../templates/Screen";
import firebase from "../auth/firebase";
import { useHistory } from "react-router-dom";

export default function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function userLogin(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setError(null);
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //redirect
        firebase
          .database()
          .ref("users/" + user.uid)
          .on("value", (info) => {
            if (info.val()?.role === "police") {
              //redirect to police home
              history.push("/police-home");
            } else {
              //redirect to witness home
              history.push("/witness-home");
            }
          });
      }
    });
  }, [history]);

  return (
    <Screen auth>
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
          Users Login Page
        </Typography>
        <TextField
          fullWidth
          style={{
            marginBottom: 16,
          }}
          id="P_email"
          label="Input Email"
          variant="outlined"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <TextField
          fullWidth
          label="Input password"
          variant="outlined"
          style={{
            marginBottom: 16,
          }}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <div>{JSON.stringify(error)}</div>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{
            marginBottom: 16,
          }}
          onClick={() => {
            userLogin(email, password);
          }}
        >
          Login
        </Button>
        <Typography
          variant="h6"
          style={{
            float: "left",
          }}
          onClick={() => {
            history.push("/register");
          }}
        >
          Don't have an Account? Click Here
        </Typography>
      </div>
    </Screen>
  );
}

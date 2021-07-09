import { Button, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import firebase from "../auth/firebase";

export default function SendRequestPage() {
  const location = useLocation();
  const state = location.state;
  const uid = firebase.auth().currentUser.uid;
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div
      style={{
        padding: 36,
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Input Your Message here"
        variant="outlined"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={{
          marginBottom: 16,
        }}
      />
      {sent && (
        <Typography color="textSecondary">
          Your message was sent successfully
        </Typography>
      )}
      <Button
        style={{
          marginTop: 16,
        }}
        disabled={sent}
        variant="outlined"
        onClick={() => {
          console.log(location);
          state &&
            firebase
              .database()
              .ref("requests")
              .push({
                accepted: "false",
                witness: state.currentUser.fullnames,
                phoneno: state.currentUser.phoneno,
                wuid: uid,
                pemail: state.pemail,
                location: state.location,
                time: Date.now(),
                message,
              })
              .then(() => {
                setSent(true);
              });
        }}
      >
        Send request
      </Button>
    </div>
  );
}

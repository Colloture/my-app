import {
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@material-ui/core';
import { PhotoCamera, PhotoCameraOutlined } from '@material-ui/icons';
import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import firebase from '../auth/firebase';

const Input = styled('input')({
  display: 'none',
});

export default function SendRequestPage() {
  const location = useLocation();
  const state = location.state;
  const uid = firebase.auth().currentUser.uid;
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

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
        label='Input Your Message here'
        variant='outlined'
        value={message}
        onChange={event => setMessage(event.target.value)}
        style={{
          marginBottom: 16,
        }}
      />
      <div>
        <label htmlFor='contained-button-file'>
          <Input
            accept='image/*'
            id='contained-button-file'
            // multiple
            type='file'
            onChange={event => {
              console.log(event.target.files[0]);
              setImage(event.target.files[0]);
            }}
          />
          <Button
            fullWidth
            startIcon={<PhotoCameraOutlined />}
            variant='contained'
            component='span'
            color='primary'
          >
            Upload Image (Optional)
          </Button>
        </label>
        {image && <Typography>IMAGE: {image?.name}</Typography>}
      </div>
      {sent && (
        <Typography color='textSecondary'>
          Your message was sent successfully
        </Typography>
      )}
      <Button
        style={{
          marginTop: 16,
        }}
        disabled={sent || busy}
        variant='outlined'
        onClick={() => {
          console.log(location);
          setBusy(true);

          state &&
            firebase
              .storage()
              .ref(`/requests/${Date.now()}.png`)
              .put(image)
              .then(snap => {
                snap.ref.getDownloadURL().then(url => {
                  const imageURL = image ? url : null;
                  console.log(`imageURL ${imageURL} \n Blob Image ${image}`);

                  firebase
                    .database()
                    .ref('requests')
                    .push({
                      accepted: 'false',
                      witness: state.currentUser.fullnames,
                      phoneno: state.currentUser.phoneno,
                      wuid: uid,
                      pemail: state.pemail,
                      location: state.location,
                      time: Date.now(),
                      message,
                      imageURL,
                    })
                    .then(() => {
                      setSent(true);
                      setBusy(false);
                    });
                });
              })
              .catch(err => {
                setBusy(true);
                console.log('image err: ', err);
              });
        }}
      >
        Send request
      </Button>
    </div>
  );
}

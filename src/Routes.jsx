import { IconButton, Snackbar } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Router as BrowserRouter, Route, Switch } from 'react-router-dom';
import firebase from './auth/firebase';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import PoliceHomePage from './pages/PoliceHomePage';
import RegisterPage from './pages/RegisterPage';
import ReportsPage from './pages/ReportsPage';
import RequestsPage from './pages/RequestsPage';
import SendRequestPage from './pages/SendRequestPage';
import WitnessHomePage from './pages/WitnessHomePage';
import history from './utilities/history';

const messaging = firebase.messaging();

export default function Routes() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({});

  messaging?.onMessage(payload => {
    console.log('Message received. ', payload);
    setShow(true);
    setNotification({
      title: payload.notification.title,
      body: payload.notification.body,
    });
  });

  useEffect(() => {
    messaging
      ?.getToken()
      .then(token => {
        console.log('Tkn: ', token);
      })
      .catch(err => {
        console.log('msgerrfbws: ', err);
      });
  }, []);

  return (
    <>
      <BrowserRouter history={history}>
        <Switch>
          <Route exact component={LoginPage} path='/' />
          <Route exact component={RegisterPage} path='/register' />
          <Route exact component={Home} path='/home' />
          <Route exact component={PoliceHomePage} path='/police-home' />
          <Route exact component={WitnessHomePage} path='/witness-home' />
          <Route exact component={SendRequestPage} path='/send-request' />
          <Route exact component={ReportsPage} path='/reports' />
          <Route exact component={RequestsPage} path='/requests' />
        </Switch>
      </BrowserRouter>
    </>
  );
}

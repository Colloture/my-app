import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ExpandMore, Room } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../store/actions/authActions';
import { loadRequests } from '../store/actions/dataActions';
import Screen from '../templates/Screen';

export default function ReportsPage() {
  const state = useSelector(st => st);
  const user = state.auth.user;
  const requests = state.data.requests.list;
  const allanAIRead = state.data.requestsRead;
  const history = useHistory();

  const dispatch = useDispatch();

  const [location, setLocation] = useState(null);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
            <b>. Crime Reports{allanAIRead?.index}</b>
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
          margin: 16,
          marginTop: 72,
        }}
        variant='outlined'
        // elevation={0}
      >
        {requests
          .slice(0)
          .reverse()
          .map(({ witness, phoneno, location, imageURL, message }, index) => (
            <Accordion
              key={Math.random() * 1000}
              expanded={expanded === index || index === allanAIRead?.index}
              onChange={handleChange(index)}
              style={{
                border:
                  (expanded === index || index === allanAIRead?.index) &&
                  '2px solid #3f51b5',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${index}bh-content`}
                id={`${index}panel4bh-header`}
              >
                <ListItem key={Math.random() * 1000}>
                  <ListItemAvatar>
                    <Avatar>
                      <Room />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={witness} secondary={phoneno} />
                </ListItem>
              </AccordionSummary>
              <AccordionDetails>
                {imageURL && (
                  <div
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundImage: `url("${imageURL}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 20,
                      margin: 8,
                    }}
                  ></div>
                )}
                <Typography style={{ margin: 8 }}>{message}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
      </Card>
    </Screen>
  );
}

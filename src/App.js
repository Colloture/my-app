import React, { useEffect } from 'react';
import './App.css';
import Routes from './Routes';
import alanBtn from '@alan-ai/alan-sdk-web';
import history from './utilities/history';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/actions/authActions';
import { readRequests } from './store/actions/dataActions';

function App() {
  const dispatch = useDispatch();
  const state = useSelector(st => st);
  const user = state.auth.user;
  const requests = state.data.requests.list;
  const revRequests = requests.slice(0).reverse();

  useEffect(() => {
    let allanBtnInstance = alanBtn({
      key: '8b1a57ed13ce215851fa29498704c1a32e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, reportIndex }) => {
        switch (command) {
          case 'openReports':
            !user?.email && allanBtnInstance.playText('Please log in first');
            user?.role !== 'police' &&
              allanBtnInstance.playText("Sorry, you're not a cop");
            user?.email && user?.role === 'police' && history.push('/reports');
            break;
          case 'logout':
            dispatch(logout());
            break;
          case 'goBack':
            history.goBack();
            break;
          case 'readReports':
            allanBtnInstance.callProjectApi('readReportsClient', {
              requests: revRequests,
            });
            break;
          case 'readSpecificReport':
            dispatch(readRequests(true, reportIndex));
            break;
          default:
            return null;
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Routes />;
}
export default App;

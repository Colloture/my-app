import React from 'react';
import {
  ShareOutlined,
  StarRateOutlined,
  InfoOutlined,
  FolderOutlined,
  FavoriteOutlined,
} from '@material-ui/icons';

export const groups = [
  { name: 'Nyeri Football Club' },
  { name: 'Groove Music' },
  { name: 'Epic Sports' },
  { name: 'Nanyuki Farmers' },
  { name: 'HesGoal' },
];

export const helpActions = [
  {
    name: 'Share The App',
    desc: 'Tell friends and family about this app',
    icon: <ShareOutlined color='primary' />,
    link: 'https://play.google.com/store/apps/details?id=com.morfie.kanisa',
    full: true,
    share: true,
    blank: true,
  },
  {
    name: 'Rate The App',
    desc: 'Rate and leave a review on playstore',
    icon: <StarRateOutlined color='primary' />,
    link: 'https://play.google.com/store/apps/details?id=com.morfie.kanisa',
    full: true,
    blank: true,
  },
];

export const aboutActions = [
  {
    name: 'Privacy Policy',
    icon: <FolderOutlined color='primary' />,
    link: '/privacy',
    full: true,
  },
  {
    name: 'Terms and Conditions',
    icon: <InfoOutlined color='primary' />,
    link: '/terms',
    full: true,
  },
  {
    name: 'Our Promise To You',
    icon: <FavoriteOutlined color='primary' />,
    link: '/promise',
    full: true,
  },
];

export const onboard = [
  {
    title: 'Kanisa App',
    desc: 'Welcome to Kanisa App. Heres a brief tour.',
    image: null,
    id: 0,
  },
  {
    title: 'Services and Appointments',
    desc: 'Book seats on the church service center and make appointments.',
    image: null,
    id: 1,
  },
  {
    title: 'View Events',
    desc: 'See all upcoming events by the church.',
    image: null,
    id: 2,
  },
  {
    title: 'Acess Livestream',
    desc: 'Get involved with livestream where you can follow along a service',
    image: null,
    id: 3,
  },
];

export const appName = 'myKanisa App';
export const Environment = {
  apiUrl: 'https://api.kanisa.morfie.co.ke/api',
};

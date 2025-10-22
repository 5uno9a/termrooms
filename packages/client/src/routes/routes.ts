import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import GameLibraryPage from '../pages/GameLibraryPage';
import DevSandboxPage from '../pages/DevSandboxPage';
import GameRoomPage from '../pages/GameRoomPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: Layout,
    children: [
      {
        index: true,
        element: HomePage,
      },
      {
        path: 'library',
        element: GameLibraryPage,
      },
      {
        path: 'sandbox',
        element: DevSandboxPage,
      },
      {
        path: 'room',
        element: GameRoomPage,
      },
    ],
  },
];

export default routes;

import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import GameLibraryPage from '../pages/GameLibraryPage';
import DevSandboxPage from '../pages/DevSandboxPage';
import GameRoomPage from '../pages/GameRoomPage';
import HelpPage from '../pages/HelpPage';
import AboutPage from '../pages/AboutPage';
import DocumentationPage from '../pages/DocumentationPage';
import NotFoundPage from '../pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'library',
        element: <GameLibraryPage />,
      },
      {
        path: 'sandbox',
        element: <DevSandboxPage />,
      },
      {
        path: 'room',
        element: <GameRoomPage />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'docs',
        element: <DocumentationPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;

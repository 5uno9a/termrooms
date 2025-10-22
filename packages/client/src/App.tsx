import { BrowserRouter as Router } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <GameProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GameProvider>
  );
}

export default App;

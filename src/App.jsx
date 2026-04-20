import { Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import { TripProvider } from './context/TripContext';

export default function App() {
  return (
    <TripProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </TripProvider>
  );
}

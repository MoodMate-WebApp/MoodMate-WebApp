import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AI from './pages/AI';
import History from './pages/History';
import Stats from './pages/Stats';
import Games from './pages/Games';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="ai" element={<AI />} />
              <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="stats" element={<ProtectedRoute><ProtectedRoute><Stats /></ProtectedRoute></ProtectedRoute>} />
              <Route path="games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
              <Route path="about" element={<About />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            fontSize: '14px'
          }
        }} />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;

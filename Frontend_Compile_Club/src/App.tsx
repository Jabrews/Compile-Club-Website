import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';



// components
import HomePage from './components/HomePage/HomePage'
import ServerPage from './components/ServerPage/ServerPage'

export default function App() {

  const location = useLocation();
  const page = location.pathname.replace('/', '') || 'home';


  return (
    <div className={`app-wrapper page-${page}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/server" element={<ServerPage />} />
      </Routes>
    </div>
  );
}
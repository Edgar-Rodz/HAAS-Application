import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './component/SideBar';
import LoginPage from './LoginPage';
import ResourcePage from './ResourcePage';
import ProjectPage from './ProjectPage';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

function App() {
  return (
    <Router>
      <div className="App">
        <SideBar />
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resource" element={<ResourcePage />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="*" element={<LoginPage />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/modify" element={<ForgotPasswordForm />} />
            <Route path="/projects/:projectName" element={<ResourcePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

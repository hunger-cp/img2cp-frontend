import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";

import Home from './views/home'

function App() {
  return (
    <div className="App">
      <div className="px-4 md:px-10 mx-auto w-full md:pt-10">
				  <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate replace to="/home" />} />
				  </Routes>
			</div>
    </div>
  );
}

export default App;

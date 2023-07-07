import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateComponent from './component/PrivateComponent';
import Sidebar from './component/Sidebar';
import Login from './page/Signin';
import Dashboard from './page/Dashboard';
import Massage from './page/Massage';
import FoodMenu from './page/FoodMenu';
import IPTV from './page/IPTV';
import WorldClock from './page/WorldClock';
import Navigations from './page/Navigations';
import Promotions from './page/Promotions';
import Action from './page/Action';
import ActionType from './page/ActionType';

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="position-fixed">
          <Sidebar title="Hotel App" />
        </div>
        <div className="container">
          <Routes>
            <Route element={<PrivateComponent />} >
              <Route path="/" element={<Dashboard />} />
              <Route path="/Navigations" element={<Navigations />} />
              <Route path="/foodmenu" element={<FoodMenu />} />
              <Route path="/massage" element={<Massage />} />
              <Route path="/worldclock" element={<WorldClock />} />
              <Route path="/iptv" element={<IPTV />} />
              <Route path="/action" element={<Action />} />
              <Route path="/actiontype" element={<ActionType />} />
              <Route path="/promotions" element={<Promotions />} />
            </Route>
            <Route path="/signin" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
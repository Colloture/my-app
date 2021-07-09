import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PoliceHomePage from "./pages/PoliceHomePage";
import WitnessHomePage from "./pages/WitnessHomePage";
import SendRequestPage from "./pages/SendRequestPage";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={LoginPage} path="/" />
        <Route exact component={RegisterPage} path="/register" />
        <Route exact component={PoliceHomePage} path="/police-home" />
        <Route exact component={WitnessHomePage} path="/witness-home" />
        <Route exact component={SendRequestPage} path="/send-request" />
      </Switch>
    </BrowserRouter>
  );
}

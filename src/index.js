import React from 'react';
import ReactDOM from 'react-dom';
import "./whole-app-style.css";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import appRoutes from './route';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            {appRoutes.map((prop, key) => (
                <Route
                    exact
                    path={prop.path}
                    component={prop.component}
                    key={key}
                />
            ))}
        </Switch>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route exact path="/admin" render={() => <Redirect to="/admin/login" />} />
    </BrowserRouter>,
    document.getElementById('root')
);

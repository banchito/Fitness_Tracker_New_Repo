import React, {useState} from "react";
import { ReactDOM } from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

const App = () => {
    return(
        <Header />
    );
};

ReactDOM.render(<App />, document.getElementById("app"))
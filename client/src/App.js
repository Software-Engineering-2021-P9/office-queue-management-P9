import "./App.css";
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginComponent";
import { MyNavBar } from "./components/NavBarComponent";
import { Container, Row } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { UserPage } from "./components/UserComponent";
import OfficerPage from "./components/OfficerPage";
import ManagerPage from "./components/ManagerPage";
import API from "./API";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const isAuthenticated = async () => {
    try {
      let user = await API.getUserInfo();
      setUser(user);
      setLoggedIn(true);
      //TODO load any useful info for the authenticated user (admin, officer, manager)
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  //useEffect to manage refresh page data persistence
  useEffect(() => {
    isAuthenticated();
  }, [loggedIn]);

  //TODO implement another userEffect to load clients info to be displayed

  // login utente, si appoggia sull'apposita API che restituisce l'id dell'utente loggato
  // le variabili di stato dirty e message vengono "pulite"
  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      //setLoading(true);
      //setDirty(true);
    } catch (err) {
      //handleErrors(err)
      console.log("APPJSERROR " + err);
      throw err;
    }
  };

  // logout utente, si puliscono tutte le variabili di stato ad eccezione dei template
  // e dei meme (che vengono successivamente ricalcolati a seguito della useEffect #3)
  const doLogOut = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    //setName(null);
    //setDirty(true)
    //setLoading(true);
  };

  return (
    <Router>
      <Container fluid className='App'>
        <Row>
          {loggedIn ? (
            <MyNavBar loggedIn={loggedIn} logout={doLogOut} user={user} />
          ) : (
            <MyNavBar loggedIn={loggedIn} logout={doLogOut} user={""} />
          )}
        </Row>
        <Switch>
          <Route exact path='/'>
            <Row>
              {loggedIn && user.role === "officer" ? (
                <div>
                  <h1 className='d-flex justify-content-center'>
                    {" "}
                    Officer Page
                  </h1>
                  <OfficerPage />
                </div>
              ) : (
                ""
              )}

              {loggedIn && user.role === "admin" ? (
                <>
                  <h1 className='d-flex justify-content-center'>Admin Page</h1>
                  <ManagerPage />
                </>
              ) : (
                ""
              )}

              {loggedIn && user.role === "manager" ? (
                <>
                  <h1 className='d-flex justify-content-center'>
                    Manager Page
                  </h1>{" "}
                </>
              ) : (
                ""
              )}

              {loggedIn === false ? (
                <>
                  <h1 className='d-flex justify-content-center'>User Page</h1>
                  <UserPage />
                </>
              ) : (
                ""
              )}
            </Row>
          </Route>

          <Route exact path='/login'>
            {loggedIn ? <Redirect to='/' /> : <LoginForm login={doLogIn} />}
          </Route>

          <Route path='/'>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

import React, {useEffect, useState} from 'react';
import SignUpModel from "./components/SignUpModel"
import LoginModel from "./components/LoginModel";
import NavBar from "./components/NavBar";
import {User} from "./models/user";
import * as NotesApi from "./network/notes_api";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Container} from "react-bootstrap";
import NotesPages from "./pages/NotesPages";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/app.module.css"


function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const [showSignUpModel, setShowSignUpModel] = useState(false);
    const [showLoginModel, setShowLoginModel] = useState(false);

    useEffect(() => {
        async function fetchLoggedInUser(){
            try {
                const user = await NotesApi.getLoggedInUser();
                setLoggedInUser(user);
            }catch (error){
                console.log(error);
            }
        }
        fetchLoggedInUser();
    }, []);
    return (
<BrowserRouter>
        <div>
            <NavBar
                loggedInUser={loggedInUser}
                onLoginClicked={() => {
                    setShowLoginModel(true);
                }}
                onSignUpClicked={() => {
                    setShowSignUpModel(true);
                }}
                onLogoutSuccessful={() => {
                    setLoggedInUser(null);
                }}
            />
            <Container className={styles.pageContainer}>
                <Routes>
                    <Route
                        path='/'
                        element={<NotesPages loggedInUser={loggedInUser} />}
                    />
                    <Route
                        path='/privacy'
                        element={<PrivacyPage />}
                    />
                    <Route
                        path='/*'
                        element={<NotFoundPage />}
                    />
                </Routes>
            </Container>
            {showSignUpModel &&
                <SignUpModel
                    onDismiss={() => {
                        setShowSignUpModel(false);
                    }}
                    onSignUpSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowSignUpModel(false);
                    }}
                />
            }
            {showLoginModel &&
                <LoginModel
                    onDismiss={() => {
                        setShowLoginModel(false)
                    }}
                    onLoginSuccessful={(user) => {
                        setLoggedInUser(user);
                        setShowSignUpModel(false);
                    }}
                />

            }
        </div>
</BrowserRouter>
    );
}

export default App;

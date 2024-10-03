import {Container} from "react-bootstrap";
import styles from "../styles/NotesPage.module.css";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import React from "react";
import {User} from "../models/user";

interface NotesPageProps {
    loggedInUser: User | null;
}

const NotesPages = ({loggedInUser}:NotesPageProps) => {
    return (
        <Container className={styles.notesPage}>
            <>
                {<NotesPageLoggedInView/>}
            </>
        </Container>

    );
}

export default NotesPages;
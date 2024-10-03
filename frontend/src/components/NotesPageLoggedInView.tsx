import {Button, Col, Row, Spinner} from "react-bootstrap";
import styleUtils from "../styles/utils.module.css";
import {FaPlus} from "react-icons/fa";
import AddEditNoteDialog from "./AddEditNoteDialog";
import React, {useEffect, useState} from "react";
import {Note as NoteModel} from "../models/note";
import * as NotesApi from "../network/notes_api";
import styles from "../styles/NotesPage.module.css";
import Note from "./Note";


interface NotesPageLoggedInViewProps {

}


const NotesPageLoggedInView = () => {
    const [notes, setNotes] = useState<NoteModel[]>([]);

    const [notesLoading, setNotesLoading] = useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

    useEffect(() => {
        async function loadNotes() {
            try {
                setShowNotesLoadingError(false);
                setNotesLoading(true);
                const notes = await NotesApi.fetchNotes()
                console.log(notes);
                setNotes(notes);
            } catch (error) {
                console.log(error);
                setShowNotesLoadingError(true);
            } finally {
                setNotesLoading(false);
            }
        }

        loadNotes();
    }, []);

    async function deleteNote(note: NoteModel) {
        try {
            await NotesApi.deleteNote(note._id);
            setNotes(notes.filter(existingNote => existingNote._id !== note._id));
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }

    const notesGrid = <Row xs={1} className={`g-4 ${styles.notesGrid}`}>
        {notes.map(note => (
            <Col key={note._id}>
                <Note note={note}
                      className={styles.note}
                      onNoteClicked={setNoteToEdit}
                      onDeleteNoteClicked={deleteNote}/>
            </Col>
        ))}
    </Row>

    return (
        <>
            <Button className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                    onClick={() => {
                        setShowAddNoteDialog(true)
                    }}>
                <FaPlus></FaPlus>
                Add new note
            </Button>

            {notesLoading && <Spinner animation="border" variant="primary"/>}
            {showAddNoteDialog && <p>Something went wrong. Please refresh the page</p>}
            {!noteToEdit && !showNotesLoadingError &&
                <>
                    {
                        notes.length > 0
                            ? notesGrid :
                            <p>You don't have any notes yet</p>
                    }
                </>
            }
            {showAddNoteDialog &&
                <AddEditNoteDialog
                    onDismiss={() => setShowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([newNote, ...notes]);
                        setShowAddNoteDialog(false);
                    }}/>
            }
            {noteToEdit &&
                <AddEditNoteDialog noteToEdit={noteToEdit}
                                   onDismiss={() => setNoteToEdit(null)}
                                   onNoteSaved={(updatedNote) => {
                                       setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
                                       setNoteToEdit(null);
                                   }}/>
            }
        </>
    );
}

export default NotesPageLoggedInView;
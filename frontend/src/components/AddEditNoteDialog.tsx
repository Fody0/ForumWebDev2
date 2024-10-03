import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {Note} from "../models/note";
import {useForm} from "react-hook-form";
import {NoteInput} from "../network/notes_api";
import * as NotesApi from "../network/notes_api"
import note from "./Note";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog= ({noteToEdit ,onDismiss, onNoteSaved}: AddEditNoteDialogProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }} = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if(noteToEdit){
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
            }
            else {
                noteResponse = await NotesApi.createNote(input);
            }
            onNoteSaved(noteResponse);
        }catch(err){
            console.log(err);
            alert(err);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="title"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                    />

                    <TextInputField
                        name="text"
                        label="Text"
                        as="textarea"
                        rows={3}
                        placeholder="text"
                        register={register}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditNoteDialog;
import { NoteForm } from "./NoteForm";
import { NoteData, Tag } from "./App"
import {useNote} from "./NoteLayout";

type EditNoteProps = {
    onSubmit: (id: string, data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

// Ф-ции onSubmit в NoteForm и EditNote не совпадают - тип описан без id, поэтому возьмем все данные
// и отправим в ф-цию в NoteForm, а так же используем наш необычный контекст через useNote
export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
    const note = useNote()
    return (<>
        <h1>Edit Note</h1>
        <NoteForm
            title = {note.title}
            markdown = {note.markdown}
            tags = {note.tags}
            onSubmit={ data => onSubmit(note.id, data)}
            onAddTag={onAddTag}
            availableTags={availableTags}
        />
    </>)
}

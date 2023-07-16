import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useMemo } from 'react'
import { Container } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import { NewNote } from "./NewNote";
import { NoteList } from "./NoteList";
import { useLocalStorage } from "./useLocalStorage";
import { v4 }  from 'uuid';
export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}
export type Note = {
    id: string
} & NoteData

export type RawNote = {
    id: string
} & RawNoteData
// если обновится тег то не придется обновлять каждую заметку
export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}
export type Tag = {
    id: string
    label: string
}

// состояние хранится в родительском компоненте, в дочерние компоненты передаем функции обновления
// для хэндлеров событий
function App() {
    // сохраняем идентификатор заметки
    const [notes, setNotes] = useLocalStorage<RawNote[]>('notes',[]);
    const [tags, setTags] = useLocalStorage<Tag[]>('tags',[]);
    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
        })
    }, [notes, tags])
    function addTag(tag: Tag) {
        setTags(prev => [...prev, tag])
    }
    function onCreateNote({tags, ...data}:NoteData) {
        setNotes(prevNotes => {
            return [...prevNotes,
                    // Добавляем заметку, тип для setNotes - RawNote
                    {...data, id: v4(), tagIds: tags.map(tag=>tag.id)}
            ]
        })
    }
    return (
      <Container className='my-4'>
          <Routes>
            <Route path='/' element={
                <NoteList/>
            } />
            <Route path='/new' element={
                <NewNote
                    onSubmit={onCreateNote}
                    onAddTag={addTag}
                    availableTags={tags}
                />
            }>

            </Route>
              <Route path='*' element={<h1>404 Not Found</h1>}>

              </Route>

          </Routes>
      </Container>
    );
}

export default App;

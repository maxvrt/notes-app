import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useMemo } from 'react'
import { Container } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import { NewNote } from "./NewNote";
import { EditNote } from "./EditNote";
import {NoteCard, NoteList} from "./NoteList";
import { useLocalStorage } from "./useLocalStorage";
import { v4 }  from 'uuid';
import { NoteLayout } from './NoteLayout';
import { Note } from './Note';

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
    // тут тип RawNote[] не присваевается
    const [notes, setNotes] = useLocalStorage<RawNote[]>('notes',[]);
    const [tags, setTags] = useLocalStorage<Tag[]>('tags',[]);
    /*
    Вычисляем значение переменной notesWithTags на основе массивов notes и tags. В этой переменной происходит
    преобразование каждого элемента массива notes из типа RawNote в тип Note. Это делается с помощью метода map,
    где каждый элемент note преобразуется в новый объект, который расширяет note и добавляет свойство tags. Значение
    свойства tags получается с помощью фильтрации массива tags по tagIds каждой заметки.
    * */
    const notesWithTags = useMemo(() => {
        return notes.map(note => {
            return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
        })
    }, [notes, tags])
    function addTag(tag: Tag) {
        setTags(prev => [...prev, tag])
    }
    function updateTag(tag: Tag, label: string) {
        setTags(()=>tags.map((item)=>{
            if (tag === item) {
                return {...item, ...tag, label: label}
            }
            return item
        }))
    }
    function delTag(tag: Tag) {
        setTags(prev => prev.filter((item)=>{return item !== tag}))
    }
    //NoteData: title, markdown, tags. Выделяем tags
    function onCreateNote({tags, ...data}:NoteData) {
        setNotes(prevNotes => {
            return [...prevNotes,
                    // В ...data осталось: title, markdown
                    // Добавляем заметку, тип для setNotes - RawNote: id, title, markdown, tagIds
                    {...data, id: v4(), tagIds: tags.map(tag=>tag.id)}
            ]
        })
    }
    //NoteData: title, markdown, tags. Выделяем tags. Также нам нужен id
    function onUpdateNote(id: string, {tags, ...data}:NoteData) {
        setNotes(prevNotes => {
            return prevNotes.map(note=>{
                if(note.id === id) {
                        // В ...data осталось: title, markdown
                        // Одинаковые свойства из ...data перезапишут свойства из ...note
                        return { ...note, ...data, tagIds: tags.map(tag=>tag.id)}
                }
                return note
            })

        })
    }
    function onDelete(id: string) {
        notes.map(note => {
            if (note.id === id) {
                return setNotes(prevNotes => {
                    return prevNotes.filter(note => {
                        if (note.id !== id) return true
                        return false
                    })
                })
            }
            return note
        })
    }
    return (
      <Container className='my-4'>
          <Routes>
            <Route path='/' element={
                <NoteList availableTags={tags} notes={notesWithTags} onUpdateTag={updateTag} onDeleteTag={delTag}/>
            } />
            <Route path='/new' element={
                <NewNote
                    onSubmit={onCreateNote}
                    onAddTag={addTag}
                    availableTags={tags}
                />
            } />
            <Route path='/:id' element={
                <NoteLayout notes={notesWithTags}/>
            }>
                <Route index element={<Note onDelete={onDelete}/>}/>
                <Route path="edit" element={<EditNote  onSubmit={onUpdateNote}
                                                      onAddTag={addTag}
                                                      availableTags={tags} />}>

                </Route>
            </Route>
              <Route path='*' element={<h1>404 Not Found</h1>}>

              </Route>

          </Routes>
      </Container>
    );
}

export default App;

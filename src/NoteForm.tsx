import { Form, Row, Col, Stack, Button } from "react-bootstrap";
import CreatableReactSelect from "react-select/creatable";
import {Link, useNavigate} from "react-router-dom";
import {FormEvent, useRef, useState} from "react";
import {NoteData, Tag} from "./App";
import {v4} from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export function NoteForm({onSubmit, onAddTag, availableTags, title='', markdown='', tags = []}:NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        })
        navigate('..');
    }

    return <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} defaultValue={title} required />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect
                            value={selectedTags.map(tag => {
                                return {label: tag.label, value: tag.id}
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return {label: tag.label, id: tag.value}
                                }))
                                }
                            }
                            onCreateOption={label => {
                                const newTag = { id: v4(), label }
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev, newTag])
                            }}
                            options={availableTags.map(tag=>{
                                return {label:tag.label, value: tag.id}
                            })}
                            isMulti />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId='markdown'>
                <Form.Label>Text</Form.Label>
                <Form.Control required as='textarea' ref={markdownRef} rows={11} defaultValue={markdown}/>
            </Form.Group>
            <Stack direction='horizontal' gap={2} className='justify-content-end'>
                <Button type='submit' variant='primary'>Add</Button>
                <Link to='..'>
                    <Button type='button' variant='outline-secondary'>Cancel</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
}

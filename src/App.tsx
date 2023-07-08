import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useMemo } from 'react'
import { Container } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from 'react-router-dom'
import { NewNote } from "./NewNote";

function App() {
  return (
      <Container className='my-4'>
          <Routes>
            <Route path='/' element={
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </header>
                </div>
            } />
            <Route path='/new' element={<NewNote/>}>

            </Route>
              <Route path='*' element={<h1>404 Not Found</h1>}>

              </Route>

          </Routes>
      </Container>
  );
}

export default App;

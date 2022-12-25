import React from 'react';
import './App.css';
import { useEffect, useState} from 'react'
import Note from './components/Note';

const baseUrl = 'http://blendon.pythonanywhere.com/'

function App() {
  const [visibe, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);

  const SaveNote = async (refresh) => {
    refresh.preventDefault();

    const request = new Request(
      `${baseUrl}/posts/`,
      {
        body:JSON.stringify({title, content}),
        headers: {
          'Content-Type': 'Application/Json'
        },method:'POST'
      }
    );
    const res = await fetch(request);
    const data = await res.json();

    if (res.ok){
      console.log(data);
  }
  else{
      console.log("Failed Post method")
  }
    setContent('');
    setTitle('');
    setVisible(false);
    getNotes();
  }

  const getNotes = async () =>{
    const response = await fetch(`${baseUrl}/posts/`);

    const data = await response.json()

    if (response.ok){
        console.log(data)
        setNotes(data)
    }
    else{
        console.log("Failed fetch")
    }
}

useEffect(
    ()=>{
      getNotes()
    },[]
)


const deleteNote = async (note_id) => {
  const resp = await fetch(`${baseUrl}/posts/${note_id}/`,{
    method: 'DELETE'
  })

  if (resp.ok) {
    console.log(resp.status)
  }
  else {
    console.log("Failed delete api")
  }

  getNotes();
}

  return (
    <div>
      <div className="header">
        <div className="logo">
          <p className="title">NOTE</p>
        </div>

        <div className="add-section">
          <a className="add-btn"
          onClick={()=>{
            return setVisible(true)
          }}
          >ADD NOTE</a>
        </div>
      </div>

      {notes.length > 0 ?(
        <div className="notes-list">
          {notes.map(
          (item) => (
            <Note title={item.title}
            content={item.content}
            onclick={
              ()=>deleteNote(item.id)}
            key={item.id}/>
          )
        )}
        </div>
      ):<div className="notes">
        No Notes....Add Note
        </div>}

      
      <div className={visibe? 'modal':'modal-not'}>
        <div className="form">
        <div className="form-header">
          <div>
            <p className="form-header-text">Create a Note</p>
          </div>
          <div>
            <a href="#" className='close-btn'
            onClick={()=>{
              return setVisible(false)
            }}
            >X</a>
          </div>
        </div>

        <form action="">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" 
            value={title} onChange={(e) =>{
              return setTitle(e.target.value)
            }}
            className="form-control"/>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea name="content" id="" cols="30" rows="5" 
            value={content} onChange={(e) =>{
              return setContent(e.target.value)
            }}
            className="form-control"></textarea>
          </div>

          <div className="form-group">
            <input type="submit" value="Save" 
            onClick={SaveNote}
            className="btn" />
          </div>

        </form>
        </div>
      </div>
    </div>
  );
}

export default App;

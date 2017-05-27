import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import Note from 'omrComponents/SheetStave/StaveView/Actions/Note';

import SheetActions from 'omrActions/Sheet';

const mapStateToProps = (state) => {
 return {
  stave: state.sheet.currentStave,
  clickedNotes: state.sheet.clickedNotes
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  removeNote: (noteID) => {
   dispatch({ 'type': SheetActions.REMOVE_NOTE, 'noteID': noteID });
  },
  editNote: (note) => {
   dispatch({ 'type': SheetActions.EDIT_NOTE, 'note': note });
  },
  controlClickNote: (noteID) => {
   dispatch({ 'type': SheetActions.NOTE_CLICKED_CONTROL, 'noteID': noteID });
  }
 });
}

const NoteList = ({ stave, clickedNotes, removeNote, editNote, controlClickNote }) => (
 <div className='notes__list'>
  {
   stave.stave.notes.filter( (section) => {
    return stave.section[0] < section.x && section.x <= stave.section[1];
   }).map( (note) => {
    return (<Note key={note.id} note={note} clickedNotes={clickedNotes} removeNote={removeNote} editNote={editNote} controlClickNote={controlClickNote}/>);
   })
  }
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);

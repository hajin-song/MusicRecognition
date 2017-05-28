/**
* NoteList.js
* Container component for Note Items
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';
import { connect } from 'react-redux';

import Note from 'omrComponents/SheetStave/StaveView/Actions/Note';

import SheetActions from 'omrActions/Sheet';

const mapStateToProps = (state) => {
 return {
  stave: state.sheet.current_stave,
  clicked_notes: state.sheet.clicked_notes
 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  removeNote: (note_id) => {
   dispatch({ 'type': SheetActions.REMOVE_NOTE, 'note_id': note_id });
  },
  editNote: (note) => {
   dispatch({ 'type': SheetActions.EDIT_NOTE, 'note': note });
  },
  controlClickNote: (note_id) => {
   dispatch({ 'type': SheetActions.NOTE_CLICKED_CONTROL, 'note_id': note_id });
  }
 });
}

const NoteList = ({
 stave,
 clicked_notes,
 removeNote,
 editNote,
 controlClickNote
}) => (
 <div className='notes__list'>
  {
   stave.stave.notes.filter( (section) => {
    return stave.section[0] < section.x && section.x <= stave.section[1];
   }).map( (note) => {
    return (<Note key={note.id}
                  note={note}
                  clicked_notes={clicked_notes}
                  removeNote={removeNote}
                  editNote={editNote}
                  controlClickNote={controlClickNote}
            />);
   })
  }
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);

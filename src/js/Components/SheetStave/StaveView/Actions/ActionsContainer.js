/**
* ActionsContainer.js
* Container Component for Actions
* Author: Ha Jin Song
* Last Modified: 28-May-2017
*/

import React from 'react';
import { connect } from 'react-redux';

import NoteList from 'omrComponents/SheetStave/StaveView/Actions/NoteList';
import NewNote from 'omrComponents/SheetStave/StaveView/Actions/AddNote';

import SheetActions from 'omrActions/Sheet';

const mapStateToProps = (state) => {
 return {

 }
}

const mapDispatchToProps =(dispatch) => {
 return ({
  addNewNote: () => {
   dispatch({ "type": SheetActions.ADD_NOTE });
  },
  setRepeatStart: () => {
   dispatch({ 'type': SheetActions.SET_REPEAT_START });
  },
  setRepeatEnd: () => {
   dispatch({ 'type': SheetActions.SET_REPEAT_END });
  },
  setAsBarNote: () => {
   dispatch({ 'type': SheetActions.GROUP_AS_BAR });
  },
  setAsSlur: () => {
   dispatch({ 'type': SheetActions.GROUP_AS_SLUR });
  },
  addArticulation: (symbol) => {
   dispatch({ 'type': SheetActions.ADD_ARTICULATION, 'symbol': symbol });
  }
 });
}

const ActionsContainer = ({
 addNewNote,
 setAsBarNote,
 addArticulation,
 setAsSlur,
 setRepeatStart,
 setRepeatEnd,
}) => (
 <div className='row notes'>
  <div className='col-xs-3 notes__annotate'>
   <div>
    <input type="number" value="4" />
    <span>/</span>
    <input type="number" value="4" />
   </div>
   <button onClick={setRepeatStart} className="btn btn-primary">Repeat Start</button>
   <button onClick={setRepeatEnd  } className="btn btn-primary">Repeat End</button>
   <button onClick={setAsBarNote} className="btn btn-primary">Bar</button>
   <button onClick={setAsSlur} className="btn btn-primary">Slur</button>
   <button onClick={()=>{ addArticulation('a@a');}}
           className="btn btn-primary">
    Fermata
   </button>
   <button onClick={()=>{ addArticulation('a.');}}
           className="btn btn-primary">
    Staccato
   </button>
  </div>
  <div className='col-xs-9'>
   <NewNote addNewNote={addNewNote} />
   <NoteList />
  </div>
 </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ActionsContainer);

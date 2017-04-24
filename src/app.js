import React from 'react';
import MusicSheet from 'omrComponents/SheetView/MusicSheet'
import Form from 'omrComponents/SheetForm/SheetForm';

class App extends React.Component{
 render() {
   return (
    <div className="container-fluid">
     <MusicSheet />
     <Form />
    </div>
   )
 }
}
export default App;

import React from 'react';
import StaveMode from 'omrComponents/SheetStave/Container';
import CropMode from 'omrComponents/SheetCrop/Container';
import Form from 'omrComponents/SheetForm/SheetForm';

class App extends React.Component{
 render() {
   return (
    <div className="container-fluid">
     <StaveMode />
     <CropMode />
    </div>
   )
 }
}
export default App;

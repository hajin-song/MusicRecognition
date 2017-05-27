import React from 'react';
import StaveMode from 'omrComponents/SheetStave/Container';
import CropMode from 'omrComponents/SheetCrop/Container';
import UnstavedMode from 'omrComponents/SheetUnstaved/Container';
import SheetExport from 'omrComponents/SheetExport/Container';

class App extends React.Component{
 render() {
   return (
    <div className="container-fluid">
     <StaveMode />
     <CropMode />
     <UnstavedMode />
     <SheetExport />
    </div>
   )
 }
}
export default App;

import React from 'react';
import PropTypes from 'prop-types';

import Action from 'omrComponents/Common/ActionButton';

const Actions = ({ mergeStave, toEditUnstaved, toDetect })=> {
 return(
  <div className="col-xs-3 content__actions content__actions--sheet">
   <Action className="action" text="Merge Section" onClick={mergeStave} />
   <Action className="action" text="Edit Unstaved Image" onClick={toEditUnstaved} />
   <Action className="action" text="To Detect" onClick={toDetect} />
  </div>
 );
}

Actions.propTypes = {
 mergeStave: PropTypes.func,
 toEditUnstaved: PropTypes.func,
 toDetect: PropTypes.func,
}

export default Actions;

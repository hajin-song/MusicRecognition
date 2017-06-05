import React from 'react';
import PropTypes from 'prop-types';

import Action from 'omrComponents/Common/ActionButton';

const Actions = ({ toMain, saveChanges }) => {
 return(
  <div className="col-xs-3 content__actions content__actions--sheet">
   <Action className="action" text="Save Changes" onClick={saveChanges} />
   <Action className="action" text="To Main" onClick={toMain} />
  </div>
 );
}

Actions.propTypes = {
 saveChanges: PropTypes.func,
 toMain: PropTypes.func,
}

export default Actions;

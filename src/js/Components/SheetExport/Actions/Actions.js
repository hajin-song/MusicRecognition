import React from 'react';
import PropTypes from 'prop-types';

import Action from 'omrComponents/Common/ActionButton';

const Actions = ({ toEdit, transpose, download }) => {
 return(
  <div className="col-xs-3 content__actions content__actions--sheet">
   <Action className="action" text="To Edit" onClick={toEdit} />
   <Action className="action" text="Transpose" onClick={transpose} />
   <Action className="action" text="Download" onClick={download} />
  </div>
 );
}

Actions.propTypes = {
 toEdit: PropTypes.func,
 transpose: PropTypes.func,
 download: PropTypes.func,
}

export default Actions;

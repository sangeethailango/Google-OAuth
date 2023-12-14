import React, {Fragment, useState, useEffect} from 'react';
import Overlay from './Overlay/index';

const NonAuthenticatedContent = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  console.log("NonAuthenticatedContent")

  return (  
    <div>
      <Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)}>
        User is not authenticated
      </Overlay>
  </div>

  );
};

export default NonAuthenticatedContent;

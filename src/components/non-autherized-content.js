import React, {Fragment, useState, useEffect} from 'react';
import Overlay from './Overlay/overlay';

const NonauthorizedContent = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  console.log("NonauthorizedContent")

  return (  
    <div>
      <Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)}>
       <p style={{fontSize: "20px"}}> User is not autherized </p>
      </Overlay>
  </div>

  );
};

export default NonauthorizedContent;

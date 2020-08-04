import React, { useRef, useState, useEffect } from 'react';
import { render } from 'react-dom';

import Audio from '../../src';

const App = (): JSX.Element => {
  const ref = useRef(null);
  const [src, setSrc] = useState(`http://112.125.26.246/public_static/teachingassistant/1.mp3?${Date.now()}`);
  useEffect(() => {
    setTimeout(() => {
      setSrc(`http://112.125.26.246/public_static/teachingassistant/1.mp3?${Date.now()}`);
    }, 8000);
  }, []);
  return <Audio key={src} src={src} ref={ref} />;
};

export default render(<App />, document.querySelector('#app'));

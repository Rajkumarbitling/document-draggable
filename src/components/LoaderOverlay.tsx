import React from 'react';
import Loader from './Loader';
import Overlay from './Overlay/Overlay';
import { LoaderOverlayProps } from '../types/App.types';


const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ children }) => {

  return (
    <Overlay>
      <Loader />
      {children}
    </Overlay>
  );
};

export default LoaderOverlay;

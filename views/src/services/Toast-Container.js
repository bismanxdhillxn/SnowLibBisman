// services/Toast-Container.js
import React from 'react';
import { ToastContainer, Flip } from 'react-toastify';

const ToastSetup = () => (
  <ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar
  newestOnTop={false}
  closeOnClick={false}
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  transition={Flip}
  />
);

export default ToastSetup;

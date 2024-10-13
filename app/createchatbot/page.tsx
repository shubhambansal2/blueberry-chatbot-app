'use client'
import React from 'react';
import Form from './form';
import { AppWrapperHOC } from '../../Root/HOC';


const CreateChatbotPage = () => {
  return (
   <Form/>      
  );
};

export default AppWrapperHOC(CreateChatbotPage);
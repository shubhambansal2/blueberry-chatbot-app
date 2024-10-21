'use client'
import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button, Steps } from 'antd';
import { AppWrapperHOC } from '@/Root/HOC';
import axios from 'axios';
import CreateChatbotForm from './CreateChatbotForm';
import UploadData from './UploadData';
import ActivateChatbot from './ActivateChatbot';

const { Step } = Steps;

const steps = [
  {
    id: 'Step 1',
    name: 'Add Company Info',
  },

  { id: 'Step 2', name: 'Upload Data' },
  { id: 'Step 3', name: 'Create Chatbot' }
]


const CreateChatbot: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [createChatbotFormData, setCreateChatbotFormData] = useState({
      company_name: '',
      company_details: '',
      chatbot_name: '',
      chatbot_role: '',
      chatbot_instructions: ''
  })
  const [fileData, setFileData] = useState<File | null>(null);

  const handleNext = (formData: object): void => {
    if (currentStep == 0) {
      setCreateChatbotFormData(prevData => ({
        ...prevData,
        ...formData
      }));
      setCurrentStep(step => step + 1)
      console.log('createChatbotFormData', createChatbotFormData);
    }
  }

  // useEffect(() => {
  //   if (currentStep === 0 && Object.keys(createChatbotFormData).length > 0) {
  //     setCurrentStep(step => step + 1);
  //     console.log('Updated createChatbotFormData:', createChatbotFormData); // Updated data after state change
  //   }
  // }, [createChatbotFormData, currentStep]);

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1)
    }
  }

  const callCreatechatbotApi = (e: any): void => {
    // log that form is submitted
    console.log("Formsubmitted");
    // get user from local storage

    e.preventDefault()
    const user = localStorage.getItem('user');
    const is_rag_enabled = false;
    const rag_source = "FAQ Database 1 and 2";
    const token = localStorage.getItem('accessToken');
    axios.post('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/chatbots/', {
        ...createChatbotFormData,
        is_rag_enabled: is_rag_enabled,
        rag_source: rag_source,
        user: user
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Chatbot created successfully:', response.data);
            // getChatbots();
            setCurrentStep(step => step + 1)
        })
        .catch(error => {
            console.error('Error creating chatbot:', error);
        });
  };

  return (
    <Fragment>
      {/* Steps */}
      <Steps current={currentStep} className="mb-8">
        {steps.map((step) => (
          <Step key={step.id} title={step.name} />
        ))}
      </Steps>

      {currentStep === 0 && (
            <CreateChatbotForm
            next={handleNext}
            createChatbotFormData={createChatbotFormData}
            />
        )}

        {currentStep === 1 && (
            <UploadData
            fileData={fileData}
            setFileData={setFileData}
             />
        )}

        {currentStep === 2 && (
          <ActivateChatbot/>      
        )}

        {/* Navigation */}
        <div className="mt-8">
          <div className='flex justify-between'>
          {currentStep < steps.length - 1 ?
            <Button onClick={prev} disabled={currentStep === 0}>
              Prev
            </Button> : null
          }
          {currentStep == 1 ?
            <Button onClick={(e: any) => callCreatechatbotApi(e)}>
              Next
            </Button> : null
          }
          </div>
        </div>
    </Fragment>
  );
};

export default AppWrapperHOC(CreateChatbot);
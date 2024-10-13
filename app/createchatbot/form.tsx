'use client'
import React, { Fragment, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { fetchChatbots, Chatbot } from '../../lib/chatbotsfetch';
import { useForm, SubmitHandler } from 'react-hook-form'
import CreateChatbotBasicDetails from '../../components/create_chatbot_basic_details';
import DocumentUpload from '../../components/document_upload';
import { zodResolver } from '@hookform/resolvers';
import { FormDataSchema } from '@/lib/zodSchema';
import { z } from 'zod'


const steps = [
    { id: 'Step 1',
     name: 'Add Company Info',
     fields: ['company_name',
        'company_details',
        'chatbot_name',
        'chatbot_role',
        'chatbot_instructions']
    },
     
    { id: 'Step 2', name: 'Upload Data' },
    { id: 'Step 3', name: 'Create Chatbot' }
  ]


type Inputs = z.infer<typeof FormDataSchema>

const Form = () => {
    const [currentStep, setCurrentStep] = useState(0)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { errors }
      } = useForm<Inputs>({
        defaultValues: {
          company_name: '',
          company_details: '',
          chatbot_name: '',
          chatbot_role: '',
          chatbot_instructions: '',
        }
      })

    const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
    }

    type FieldName = keyof Inputs
    
    const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
        if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
        }
        setCurrentStep(step => step + 1)
        }
    }
    
    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(step => step - 1)
        }
    }
    
    return (
    <Fragment className='absolute inset-0 flex flex-col justify-between p-24'>
      {/* steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <button
                  onClick={() => setCurrentStep(index)}
                  className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors hover:border-sky-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                >
                  <span className='text-sm font-medium text-sky-600 transition-colors group-hover:text-sky-800'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </button>
              ) : currentStep === index ? (
                <button
                  onClick={() => setCurrentStep(index)}
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(index)}
                  className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                >
                  <span className='text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className='mt-12 py-12'>
        {currentStep === 0 && (
          <>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Chatbot Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Provide chatbot details.
            </p>
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-4'>
                <label
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Company Name
                </label>
                <div className='mt-2'>
                  <input
                    id='company_name'
                    type='text'
                    {...register('company_name')}
                    autoComplete='given-name'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                   {errors.company_name?.message && (
                    <p className='text-sm text-red-400'>{errors.company_name.message}</p>
                    )}
                </div>
              </div>

              <div className='sm:col-span-4'>
                <label
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Company Details
                </label>
                <div className='mt-2'>
                  <input
                    id='company_details'
                    type='text'
                    {...register('company_details')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.company_details?.message && (
                    <p className='text-sm text-red-400'>{errors.company_details.message}</p>
                    )}
                </div>
              </div>

              <div className='sm:col-span-4'>
                <label
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Chatbot Name
                </label>
                <div className='mt-2'>
                  <input
                    id='chatbot_name'
                    type='text'
                    {...register('chatbot_name')}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.name?.message && (
                    <p className='text-sm text-red-400'>{errors.chatbot_name.message}</p>
                    )}
                </div>
              </div>

              <div className='sm:col-span-4'>
                <label
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Chatbot Role
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.name?.message && (
                    <p className='text-sm text-red-400'>{errors.name.message}</p>
                    )}
                </div>
              </div>

              <div className='sm:col-span-4'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Chatbot Instructions
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.name?.message && (
                    <p className='text-sm text-red-400'>{errors.name.message}</p>
                    )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Upload Data
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Finetune your data
            </p>

            <DocumentUpload/>

          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Chatot Complete
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Chatbot Created Succesfully.
            </p>
          </>
        )}
      </form>

      {/* Navigation */}
      <div className='mt-8 pt-3'>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={prev}
            disabled={currentStep === 0}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Prev
          </button>
          <button
            type='button'
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </Fragment>
    );
};

export default Form;
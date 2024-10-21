'use client'
import React, { Fragment, useState } from 'react';
import { Form, Button, Input } from 'antd';
import { validationRules } from '@/utils';

interface CreateChatbotFormProps {
  next: (formValues: any) => void;
  createChatbotFormData?: {
    company_name?: string;
    company_details?: string;
    chatbot_name?: string;
    chatbot_role?: string;
    chatbot_instructions?: string;
  };
}

const CreateChatbotForm: React.FC<CreateChatbotFormProps> = ({ 
  next,
  createChatbotFormData = {},
 })=> {

  const [form] = Form.useForm();

  const {
    company_name = '',
    company_details = '',
    chatbot_name = '',
    chatbot_role = '',
    chatbot_instructions = ''
  } = createChatbotFormData;

  const onSubmit = (data: any) => {
    console.log('Form Values:', data); // Handle successful form submission
    next(data)
  };

  return (
    <Fragment>
      {/* Form */}
      <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit} // Triggers when form passes validation
    >
      <h2>Chatbot Information</h2>
      <p>Provide chatbot details.</p>

      <Form.Item
        label="Company Name"
        name="company_name"
        initialValue={company_name}
        rules={[validationRules.mandatory]}
      >
        <Input placeholder="Enter company name" />
      </Form.Item>

      <Form.Item
        label="Company Details"
        name="company_details"
        initialValue={company_details}
        rules={[validationRules.mandatory]}
      >
        <Input placeholder="Enter company details" />
      </Form.Item>

      <Form.Item
        label="Chatbot Name"
        name="chatbot_name"
        initialValue={chatbot_name}
        rules={[validationRules.mandatory]}
      >
        <Input placeholder="Enter chatbot name" />
      </Form.Item>

      <Form.Item
        label="Chatbot Role"
        name="chatbot_role"
        initialValue={chatbot_role}
        rules={[validationRules.mandatory]}
      >
        <Input placeholder="Enter chatbot role" />
      </Form.Item>

      <Form.Item
        label="Chatbot Instructions"
        name="chatbot_instructions"
        initialValue={chatbot_instructions}
        rules={[validationRules.mandatory]}
      >
        <Input placeholder="Enter chatbot instructions" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </Form.Item>
    </Form>
    </Fragment>
  );
};

export default CreateChatbotForm;
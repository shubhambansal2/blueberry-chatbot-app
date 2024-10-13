import { z } from 'zod'

const FormDataSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_details: z.string().min(1, 'Company details is required'),
  chatbot_name: z.string().min(1, 'Chatbot name is required'),
  chatbot_role: z.string().min(1, 'Chatbot role is required'),
  chatbot_instructions: z.string().min(8, 'Chatbot Instructions is required'),
})

export { FormDataSchema };
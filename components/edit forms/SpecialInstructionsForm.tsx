import { useForm, useFieldArray } from 'react-hook-form';
import { editChatbotStore } from '../../store/editChatbotStore';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Plus, Trash2 } from 'lucide-react';

interface SpecialInstructionsInputs {
  specialinstructions: string;
  exampleresponses: Array<{
    question: string;
    answer: string;
  }>;
}

export const SpecialInstructionsForm = () => {
  const { specialInstructions, updateSpecialInstructions } = editChatbotStore();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<SpecialInstructionsInputs>({
    defaultValues: {
      specialinstructions: specialInstructions.specialinstructions,
      exampleresponses: specialInstructions.exampleresponses?.length
        ? specialInstructions.exampleresponses
        : [{ question: '', answer: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exampleresponses',
  });

  // Watch all form fields
  const watchedFields = watch();

  // Debounced update function
  const debouncedUpdate = debounce((data: SpecialInstructionsInputs) => {
    updateSpecialInstructions(data);
  }, 500);

  // Update store when form values change
  useEffect(() => {
    debouncedUpdate({
      specialinstructions: watchedFields.specialinstructions,
      exampleresponses: watchedFields.exampleresponses,
    });
  }, [watchedFields]);

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="space-y-2">
        <label htmlFor="specialinstructions" className="block text-sm font-medium">
          Special Instructions
        </label>
        <textarea
          id="specialinstructions"
          className="w-full h-48 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6 resize-y"
          placeholder="Enter any special instructions or guidelines for your chatbot"
          {...register('specialinstructions', { required: 'Special instructions are required' })}
        />
        {errors.specialinstructions && (
          <p className="text-sm text-red-500">{errors.specialinstructions.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Example Q&A Pairs</label>
          <button
            type="button"
            onClick={() => append({ question: '', answer: '' })}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Example
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Example {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Question</label>
              <input
                type="text"
                className="w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter an example question"
                {...register(`exampleresponses.${index}.question` as const, {
                  required: 'Question is required',
                })}
              />
              {errors.exampleresponses?.[index]?.question && (
                <p className="text-sm text-red-500">
                  {errors.exampleresponses[index]?.question?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Answer</label>
              <textarea
                className="w-full h-16 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                placeholder="Enter the expected answer"
                {...register(`exampleresponses.${index}.answer` as const, {
                  required: 'Answer is required',
                })}
              />
              {errors.exampleresponses?.[index]?.answer && (
                <p className="text-sm text-red-500">
                  {errors.exampleresponses[index]?.answer?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
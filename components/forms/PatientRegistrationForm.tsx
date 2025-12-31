
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../ui/FormField';
import Button from '../ui/Button';

// Updated schema to handle coercion and correct error message format for the specific environment
const patientSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  age: z.coerce.number().min(1).max(120, 'Invalid age'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], {
    message: 'Please select a blood type'
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface Props {
  onSuccess: (data: PatientFormValues) => void;
}

const PatientRegistrationForm: React.FC<Props> = ({ onSuccess }) => {
  // Use z.input to satisfy RHF's internal types while the resolver handles number transformation
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<z.input<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<PatientFormValues> = (data) => {
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border">
      <h3 className="text-lg font-black uppercase text-gray-900 border-b pb-2 mb-4">Register New Patient ID</h3>
      
      <FormField label="Full Name" error={errors.fullName?.message} required>
        <input 
          {...register('fullName')} 
          placeholder="Jane Doe"
          className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Age" error={errors.age?.message} required>
          <input 
            {...register('age')} 
            type="number"
            placeholder="35"
            className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition ${errors.age ? 'border-red-500' : 'border-gray-200'}`}
          />
        </FormField>
        <FormField label="Blood Type" error={errors.bloodType?.message} required>
          <select 
            {...register('bloodType')}
            className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition font-bold ${errors.bloodType ? 'border-red-500' : 'border-gray-200'}`}
          >
            <option value="">Select...</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Contact Phone" error={errors.phone?.message} required>
        <input 
          {...register('phone')} 
          placeholder="+1234567890"
          className={`w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
        />
      </FormField>

      <Button type="submit" isLoading={isSubmitting} disabled={!isValid} className="w-full">
        GENERATE PATIENT ID
      </Button>
    </form>
  );
};

export default PatientRegistrationForm;

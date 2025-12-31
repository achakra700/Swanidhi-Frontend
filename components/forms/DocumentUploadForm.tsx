
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const uploadSchema = z.object({
  file: z.any()
    .refine((files) => files?.length === 1, "Image or PDF is required")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB`)
    .refine((files) => ACCEPTED_TYPES.includes(files?.[0]?.type), "Only PDF, JPEG and PNG are supported"),
  description: z.string().min(5, 'Brief description required')
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface Props {
  onSuccess: (data: UploadFormValues) => void;
}

const DocumentUploadForm: React.FC<Props> = ({ onSuccess }) => {
  const { showToast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid } } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    mode: 'onChange'
  });

  const fileWatch = watch('file');

  React.useEffect(() => {
    if (fileWatch && fileWatch[0] && fileWatch[0].type.startsWith('image/')) {
      const url = URL.createObjectURL(fileWatch[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const handleFormSubmit = (data: UploadFormValues) => {
    try {
      onSuccess(data);
      showToast('Medical document successfully attached.', 'success');
    } catch (e) {
      showToast('Critical upload failure. Please retry.', 'error');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-4 bg-white p-8 rounded-[2rem] border shadow-sm group"
      aria-labelledby="upload-title"
    >
      <h3 id="upload-title" className="text-sm font-black uppercase text-gray-900 border-b border-dashed pb-3 mb-6 tracking-widest">
        Clinical Notes Upload
      </h3>

      {/* Cast complex FieldError to any to match FormField's expected string prop */}
      <FormField label="Secure Document Target" error={errors.file?.message as any} required>
        <div className={`relative border-2 border-dashed rounded-[1.5rem] p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
          fileWatch?.[0] ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-red-400 hover:bg-red-50'
        }`}>
          <input 
            {...register('file')}
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload PDF or Image medical document"
          />
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-center">
            {fileWatch?.[0] ? (
              <p className="text-xs font-black text-green-700 uppercase tracking-tighter">{fileWatch[0].name}</p>
            ) : (
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Drop clinical PDF or JPEG</p>
            )}
            <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-[0.2em]">Limit: 5.0 MB</p>
          </div>
        </div>
      </FormField>

      {preview && (
        <div className="mt-4 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl animate-in fade-in zoom-in duration-300">
          <img src={preview} alt="Document Preview" className="w-full h-40 object-cover" />
        </div>
      )}

      <FormField label="Clinical Context" error={errors.description?.message} required>
        <textarea 
          {...register('description')}
          rows={3}
          placeholder="Specify clinical urgency or additional patient context..."
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-100 focus:outline-none transition-all text-sm font-medium"
        />
      </FormField>

      <Button type="submit" variant="secondary" isLoading={isSubmitting} disabled={!isValid} className="w-full py-4 rounded-2xl shadow-xl shadow-gray-100">
        ENCRYPT & ATTACH
      </Button>
    </form>
  );
};

export default DocumentUploadForm;

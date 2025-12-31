
import React, { useState, useRef } from 'react';
import { DonorProfile, EligibilityStatus } from '../../types';
import { useUpdateDonorProfile } from '../../hooks/useDonor';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { useToast } from '../../context/ToastContext';

interface Props {
  donor: DonorProfile;
  onComplete: () => void;
}

type ScreeningStep = 'INTRO' | 'IDENTITY' | 'MEDICAL' | 'DOCUMENTS' | 'REVIEW';

const ScreeningWizard: React.FC<Props> = ({ donor, onComplete }) => {
  const [step, setStep] = useState<ScreeningStep>('INTRO');
  const { mutate: updateProfile, isPending } = useUpdateDonorProfile();
  const { showToast } = useToast();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [medicalForm, setMedicalForm] = useState({
    noIllness: false,
    noMedication: false,
    noRecentTattoo: false,
    weightCheck: false
  });

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast("Camera access denied or unavailable", "error");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvas.toDataURL('image/png'));
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const handleStepComplete = (nextStep: ScreeningStep, checkpointKey?: keyof DonorProfile['checkpoints']) => {
    if (checkpointKey) {
      const updatedCheckpoints = { ...donor.checkpoints, [checkpointKey]: true };
      const progress = Object.values(updatedCheckpoints).filter(v => v).length * 33.3;
      updateProfile({ checkpoints: updatedCheckpoints, verificationProgress: Math.min(progress, 100) });
    }
    setStep(nextStep);
  };

  const finalizeScreening = () => {
    updateProfile({ 
      eligibility: EligibilityStatus.ELIGIBLE,
      verificationProgress: 100,
      checkpoints: { identity: true, medicalHistory: true, documents: true }
    }, {
      onSuccess: () => {
        showToast("Preliminary Screening Successful. Node Eligible.", "success");
        onComplete();
      }
    });
  };

  return (
    <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {step === 'INTRO' && (
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" /></svg>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight">Node Verification</h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Protocol SWN-V1. Preliminary Donor Screening</p>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed uppercase font-medium">
            To participate in the National Emergency Grid, every node must undergo a three-stage clinical and identity verification process.
          </p>
          <Button onClick={() => setStep('IDENTITY')} className="w-full py-5 rounded-2xl">Initialize Screening</Button>
        </div>
      )}

      {step === 'IDENTITY' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">01</span>
            <h3 className="text-xl font-black uppercase tracking-tight">Identity Handshake</h3>
          </div>
          
          <div className="aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden relative flex items-center justify-center group">
            {capturedImage ? (
              <img src={capturedImage} className="w-full h-full object-cover" alt="Verification" />
            ) : cameraActive ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-4">
                <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural face verification required</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!capturedImage && !cameraActive && <Button onClick={startCamera} variant="outline" className="flex-1 rounded-xl">Enable Lens</Button>}
            {cameraActive && <Button onClick={capturePhoto} variant="emergency" className="flex-1 rounded-xl">Capture Frame</Button>}
            {capturedImage && <Button onClick={() => setCapturedImage(null)} variant="outline" className="flex-1 rounded-xl">Retake</Button>}
            <Button 
              disabled={!capturedImage} 
              onClick={() => handleStepComplete('MEDICAL', 'identity')} 
              className="flex-1 rounded-xl"
            >
              Verify Identity
            </Button>
          </div>
        </div>
      )}

      {step === 'MEDICAL' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">02</span>
            <h3 className="text-xl font-black uppercase tracking-tight">Clinical Assessment</h3>
          </div>

          <div className="space-y-4">
            {[
              { id: 'noIllness', label: 'No history of chronic infectious disease' },
              { id: 'noMedication', label: 'Not currently on heavy systemic medication' },
              { id: 'noRecentTattoo', label: 'No tattoos/piercings in the last 6 months' },
              { id: 'weightCheck', label: 'Self-verified weight > 50kg' }
            ].map((q) => (
              <label key={q.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white transition-colors group">
                <input 
                  type="checkbox" 
                  checked={(medicalForm as any)[q.id]}
                  onChange={() => setMedicalForm(prev => ({ ...prev, [q.id]: !(prev as any)[q.id] }))}
                  className="w-5 h-5 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500" 
                />
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{q.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setStep('IDENTITY')} variant="outline" className="flex-1 rounded-xl">Previous</Button>
            <Button 
              disabled={!Object.values(medicalForm).every(v => v)} 
              onClick={() => handleStepComplete('DOCUMENTS', 'medicalHistory')} 
              className="flex-1 rounded-xl"
            >
              Confirm Status
            </Button>
          </div>
        </div>
      )}

      {step === 'DOCUMENTS' && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">03</span>
            <h3 className="text-xl font-black uppercase tracking-tight">Document Vault</h3>
          </div>

          <div className="p-10 bg-slate-900 rounded-[2rem] text-center space-y-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5"/></svg>
            </div>
            <div className="space-y-2">
              <p className="text-white text-sm font-black uppercase tracking-widest">Medical Certificate</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Upload health clearance (PDF/JPEG)</p>
            </div>
            <input type="file" className="hidden" id="doc-upload" onChange={() => handleStepComplete('REVIEW', 'documents')} />
            <label htmlFor="doc-upload" className="block w-full py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
              Transmit Asset
            </label>
          </div>

          <Button onClick={() => setStep('MEDICAL')} variant="outline" className="w-full rounded-xl">Previous</Button>
        </div>
      )}

      {step === 'REVIEW' && (
        <div className="space-y-10 text-center">
           <div className="space-y-3">
             <h3 className="text-3xl font-black uppercase tracking-tight">Final Authorization</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grid Verification Integrity Check</p>
           </div>
           
           <div className="grid grid-cols-3 gap-4">
              {['Identity', 'Medical', 'Legal'].map(v => (
                <div key={v} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto animate-pulse"></div>
                   <p className="text-[9px] font-black text-emerald-700 uppercase">{v}</p>
                </div>
              ))}
           </div>

           <div className="p-6 bg-slate-50 rounded-2xl text-left border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Note</p>
             <p className="text-xs font-bold text-slate-600 uppercase leading-relaxed">
               I hereby certify that the information provided is clinically accurate. False reporting may lead to immediate node deactivation and exclusion from the national coordination layer.
             </p>
           </div>

           <div className="flex flex-col gap-4">
              <Button 
                isLoading={isPending} 
                onClick={finalizeScreening} 
                className="w-full py-5 bg-rose-600 shadow-rose-200"
              >
                Sign & Finalize
              </Button>
              <button onClick={() => setStep('INTRO')} className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-900 transition-colors">Reset Protocol</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningWizard;

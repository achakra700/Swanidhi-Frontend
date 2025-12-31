
export enum UserRole {
  ADMIN = 'ADMIN',
  HOSPITAL = 'HOSPITAL',
  BLOOD_BANK = 'BLOOD_BANK',
  DONOR = 'DONOR',
  PATIENT = 'PATIENT',
}

export enum SOSStatus {
  CREATED = 'CREATED',
  ROUTED = 'ROUTED',
  ACCEPTED = 'ACCEPTED',
  DISPATCHED = 'DISPATCHED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

export enum EligibilityStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ELIGIBLE = 'ELIGIBLE',
  INELIGIBLE = 'INELIGIBLE',
  DEFERRED = 'DEFERRED'
}

export enum InventoryAction {
  STOCK_UPDATE = 'STOCK_UPDATE',
  SOS_ACCEPT = 'SOS_ACCEPT',
  SOS_DISPATCH = 'SOS_DISPATCH',
  SOS_REJECT = 'SOS_REJECT',
  NODE_AUTH = 'NODE_AUTH',
  NODE_REJECT = 'NODE_REJECT',
  SOS_OVERRIDE = 'SOS_OVERRIDE',
  PATIENT_MANAGE = 'PATIENT_MANAGE',
  DONOR_MANAGE = 'DONOR_MANAGE'
}

export enum DeliveryMethod {
  HOSPITAL_PICKUP = 'HOSPITAL_PICKUP',
  BLOOD_BANK_DELIVERY = 'BLOOD_BANK_DELIVERY'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgName?: string;
  regId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface Patient {
  id: string;
  fullName: string;
  hospitalId: string;
  isActive: boolean;
  createdAt: string;
}

export interface SOSRequest {
  id: string;
  hospitalId: string;
  hospitalName: string;
  patientId: string;
  bloodType: BloodType;
  units: number;
  status: SOSStatus;
  createdAt: string;
  updatedAt: string;
  noteUrl?: string;
  urgency?: 'Immediate' | 'High' | 'Standard';
  region?: 'North' | 'South' | 'East' | 'West' | 'Central';
  isDisasterMode?: boolean;
  isEscalated?: boolean;
  deliveryMethod?: DeliveryMethod;
  remark?: string;
}

export interface DonorProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  bloodType: BloodType;
  eligibility: EligibilityStatus;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  verificationProgress: number;
  checkpoints: {
    identity: boolean;
    medicalHistory: boolean;
    documents: boolean;
  };
}

export interface BloodInventory {
  type: BloodType;
  units: number;
  bankId: string;
}

export interface AuditLogEntry {
  id: string;
  action: InventoryAction;
  userName: string;
  userId: string;
  details: string;
  timestamp: string;
}

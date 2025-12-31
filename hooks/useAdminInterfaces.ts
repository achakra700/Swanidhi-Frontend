
export interface AdminStats {
    hospitals: number;
    banks: number;
    donors: number;
    activeSos: number;
}

export interface OrganizationApplication {
    id: string;
    name: string;
    type: 'HOSPITAL' | 'BLOOD_BANK';
    regId: string;
    location: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

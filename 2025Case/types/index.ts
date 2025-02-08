export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  medications?: {  // Made optional since it will be added later
    baseDrug: string;
    integraseInhibitor: string;
    nnrti: string;
    proteaseInhibitor: string;
  };
}

export interface HealthLog {
  uid: string;
  date: string;
  mood: number;
  stress: number;
  medication: boolean;
} 
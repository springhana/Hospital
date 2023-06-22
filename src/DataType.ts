export interface Doctor {
  doctorId: number;
  doctorName: string;
  tel: string;
  fieldOfMedicine: string;
}

export interface Nurse {
  nurseNumber: number;
  nurseName: string;
  tel: string;
  functions: string;
}

export interface Patient {
  patientNum: number;
  patientName: string;
  tel: string;
  image: string;
  doctor: Doctor;
  nurse: Nurse;
}

export interface Diagnosis {
  diagnosisNum: number;
  diagnosisContent: string;
  diagnosisDate: any; // Date
  doctor: Doctor;
  patient: Patient;
}

export interface Chart {
  chartNum: number;
  chartContent: string;
  diagnosis: Diagnosis;
  nurse: Nurse;
}

export interface patientPostType {
  patientNum: number;
  patientName: string;
  tel: string;
  image: string;
}

export interface DiagnosisPostType {
  diagnosisNum: number;
  diagnosisContent: string;
}

export interface ChartPostType {
  chartNum: number;
  chartContent: string;
}

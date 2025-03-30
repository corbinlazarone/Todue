export interface signUpCredentials {
  email: string;
  password: string;
  acceptedTerms: boolean;
  confirmPassword: string;
}

export interface signInCredentials {
  email: string;
  password: string;
}

export interface forgotPasswordCredentials {
    email: string;
}

export interface resetPasswordCredentials {
    password: string;
    confirmPassword: string;
}

export interface Assignment {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
  completed?: boolean;
  completed_at?: string;
}

export interface CourseData {
  id: string;
  course_name: string;
  created_at: string;
  assignments: Assignment[];
}

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export interface Alert {
  type: AlertType;
  message: string;
}
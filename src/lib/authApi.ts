import type {
  LoginResponse,
  MeResponse,
  MyAttendanceResponse,
  AttendanceDTO,
  LeaveTypeDTO,
  LeaveBalanceDTO,
  LeaveRequestDTO,
  SalaryStructureDTO,
  PayslipDTO,
  ExpenseCategoryDTO,
  ExpenseClaimDTO,
} from '@ems/types';
import { api } from './api';

const P = '/api/v1';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>(`${P}/auth/login`, { email, password }),
  refresh: () => api.post<LoginResponse>(`${P}/auth/refresh`),
  logout: () => api.post<{ success: boolean }>(`${P}/auth/logout`),
  me: () => api.get<MeResponse>(`${P}/auth/me`),
};

export const attendanceApi = {
  me: (month?: string) =>
    api.get<MyAttendanceResponse>(`${P}/attendance/me`, month ? { month } : undefined),
  checkIn: () => api.post<AttendanceDTO>(`${P}/attendance/check-in`, { source: 'SelfMobile' }),
  checkOut: () => api.post<AttendanceDTO>(`${P}/attendance/check-out`, {}),
};

export const leavesApi = {
  types: () => api.get<LeaveTypeDTO[]>(`${P}/leaves/types`),
  balance: () => api.get<LeaveBalanceDTO[]>(`${P}/leaves/balance`),
  apply: (body: { typeId: string; startDate: string; endDate: string; reason: string }) =>
    api.post<LeaveRequestDTO>(`${P}/leaves/requests`, body),
  requests: () => api.get<LeaveRequestDTO[]>(`${P}/leaves/requests`, { scope: 'mine' }),
  cancel: (id: string) => api.patch<LeaveRequestDTO>(`${P}/leaves/requests/${id}/cancel`, {}),
};

export const payrollApi = {
  salary: () => api.get<SalaryStructureDTO | null>(`${P}/payroll/salary`),
  payslips: () => api.get<PayslipDTO[]>(`${P}/payroll/payslips`),
};

export const expensesApi = {
  categories: () => api.get<ExpenseCategoryDTO[]>(`${P}/expenses/categories`),
  claims: () => api.get<ExpenseClaimDTO[]>(`${P}/expenses/claims`, { scope: 'mine' }),
  create: (body: Record<string, unknown>) => api.post<ExpenseClaimDTO>(`${P}/expenses/claims`, body),
};

export function fmtMinutes(mins: number): string {
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
}

export function fmtMoney(amount: number, currency = 'PKR'): string {
  return `${currency} ${new Intl.NumberFormat('en-US').format(Math.round(amount))}`;
}

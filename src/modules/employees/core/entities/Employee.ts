export interface EmployeeEntry {
  id: number;
  employee_id: number;
  entry_time: string;
  was_successful: number;
}

export interface Employee {
    id: number;
    document: string;
    first_name: string;
    last_name: string;
    department: string;
    access: boolean;
    entries?: EmployeeEntry[];
    uw_created?: string | null;
    uw_updated?: string | null;
    uw_deleted?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    deleted_at?: string | null;
  }
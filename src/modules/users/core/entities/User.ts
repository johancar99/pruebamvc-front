// src/modules/users/core/entities/User.ts
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    active: number;
    uw_created?: string | null;
    uw_updated?: string | null;
    uw_deleted?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  }
  
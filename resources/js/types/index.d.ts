export interface User {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'user';
    last_login_at?: string | null;
    last_login_ip?: string | null;
    created_at?: string;
    tasks_count?: number;
    habits_count?: number;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

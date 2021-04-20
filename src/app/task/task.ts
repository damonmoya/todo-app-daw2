export interface Task {
    id?: string;
    title: string;
    priority: number;
    state: number;
    created_at: Date;
}
export interface Task {
    id?: number;
    title: string;
    priority: number;
    state: number;
    created_at: Date;
}
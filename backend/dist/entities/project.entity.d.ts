import { Task } from './task.entity';
export declare class Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    tasks: Task[];
}

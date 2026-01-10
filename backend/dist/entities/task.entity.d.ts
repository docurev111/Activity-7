import { Project } from './project.entity';
import { User } from './user.entity';
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: string;
    projectId: number;
    userId: number;
    project: Project;
    user: User;
}

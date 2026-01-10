import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    create(createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    findByProject(projectId: number): Promise<Task[]>;
    update(id: number, updateTaskDto: Partial<CreateTaskDto>): Promise<Task>;
    remove(id: number): Promise<void>;
}

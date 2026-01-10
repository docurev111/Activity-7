import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<import("../entities/task.entity").Task>;
    findAll(): Promise<import("../entities/task.entity").Task[]>;
    findByProject(projectId: string): Promise<import("../entities/task.entity").Task[]>;
    findOne(id: string): Promise<import("../entities/task.entity").Task>;
    update(id: string, updateTaskDto: Partial<CreateTaskDto>): Promise<import("../entities/task.entity").Task>;
    remove(id: string): Promise<void>;
}

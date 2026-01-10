import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    update(id: number, updateProjectDto: Partial<CreateProjectDto>): Promise<Project>;
    remove(id: number): Promise<void>;
}

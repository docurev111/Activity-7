import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find({ relations: ['tasks'] });
  }

  async findOne(id: number): Promise<Project> {
    return await this.projectsRepository.findOne({ 
      where: { id }, 
      relations: ['tasks', 'tasks.user'] 
    });
  }

  async update(id: number, updateProjectDto: Partial<CreateProjectDto>): Promise<Project> {
    await this.projectsRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.projectsRepository.delete(id);
  }
}

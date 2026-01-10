import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({ 
      relations: ['project', 'user'] 
    });
  }

  async findOne(id: number): Promise<Task> {
    return await this.tasksRepository.findOne({ 
      where: { id }, 
      relations: ['project', 'user'] 
    });
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return await this.tasksRepository.find({ 
      where: { projectId }, 
      relations: ['user'] 
    });
  }

  async update(id: number, updateTaskDto: Partial<CreateTaskDto>): Promise<Task> {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}

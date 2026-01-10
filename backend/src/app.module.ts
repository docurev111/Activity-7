import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Project, Task],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
})
export class AppModule {}

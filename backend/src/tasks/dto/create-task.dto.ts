import { IsString, IsNotEmpty, IsNumber, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Design homepage mockup' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Create wireframes and high-fidelity mockups' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'todo', enum: ['todo', 'in-progress', 'completed'] })
  @IsString()
  @IsIn(['todo', 'in-progress', 'completed'])
  status: string;

  @ApiProperty({ example: '2026-01-20' })
  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

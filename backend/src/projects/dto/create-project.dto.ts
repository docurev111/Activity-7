import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Complete redesign of company website' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-01-10' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}

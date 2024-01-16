import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.status.enum';
import { TasksRepository } from './repositories/tasks.repository';
// import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    // @InjectRepository(Task)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto?: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  addTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    return this.tasksRepository.updateTask(task, updateTaskDto);
  }

  async updateStatusTask(taskId: string, status: TaskStatus) {
    const task = await this.getTaskById(taskId);
    return this.tasksRepository.updateStatusTask(task, status);
  }

  async deleteTask(id: string): Promise<void> {
    // const task = await this.getTaskById(id);
    // return this.tasksRepository.remove(task);
    const deleteResult = await this.tasksRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}

import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../task.status.enum';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Injectable } from '@nestjs/common';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return this.save(task);
  }

  updateTask(task: Task, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { description, title } = updateTaskDto;
    task.description = description;
    task.title = title;

    return this.save(task);
  }

  updateStatusTask(task: Task, status: TaskStatus): Promise<Task> {
    task.status = status;
    return this.save(task);
  }

  getTasks(filterDto?: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = query.getMany();
    return tasks;
  }
}

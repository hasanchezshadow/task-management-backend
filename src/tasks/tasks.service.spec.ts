import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { User } from 'src/auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task.status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser: User = {
  id: 'someUUID',
  username: 'someUser',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('should be defined"', async () => {
      expect(await tasksService.getTasks).toBeDefined();
    });
    it('calls TaskRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should be defined"', async () => {
      expect(await tasksService.getTaskById).toBeDefined();
    });
    it('calls TaskRepository.findOneBy and returns the result', async () => {
      const mockTask: Task = {
        id: 'someId',
        description: 'some description',
        status: TaskStatus.OPEN,
        title: 'some title',
        user: mockUser,
      };
      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someID', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TaskRepository.findOneBy and handels an error', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTaskById('someID', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

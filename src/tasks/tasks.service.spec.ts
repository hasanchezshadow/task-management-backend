import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { User } from 'src/auth/entities/user.entity';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
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
      //   expect(await tasksService.getTasks(filterDto: GetTasksFilterDto, user: User)).();
      expect(await tasksService.getTasks).toBeDefined();
    });
    it('calls TaskRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual([]);
    });
  });
});

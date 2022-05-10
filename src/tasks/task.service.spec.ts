import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
});

const mockUser: User = {
  username: 'aldo',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let tasksRepository: ReturnType<typeof mockTasksRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('Hello!');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('Hello!');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.getTaskById and returns the result', async () => {
      const mockTask: Task = {
        title: 'Just some title',
        description: 'Just some description',
        id: 'JustSomeId',
        status: TaskStatus.OPEN,
        user: mockUser,
      };

      tasksRepository.getTaskById.mockResolvedValue(mockTask);
      const task = await tasksService.getTaskById('myId', null);
      expect(task).toEqual(mockTask);
    });
    it('calls TaskRepository.getTaskById and handles an error', async () => {
      tasksRepository.getTaskById.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', null)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

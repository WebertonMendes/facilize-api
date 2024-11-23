import * as path from "path";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Task } from "./entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UsersService } from "../users/users.service";
import { deleteFile } from "../../utils/upload.utils";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async create(createTaskData: CreateTaskDto, tokenString: string) {
    const token = tokenString.replace("Bearer ", "");
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    await this.usersService.findOne(userId);

    const newTaskData = {
      description: createTaskData.description,
      user_id: userId,
    };

    try {
      const newTask = this.taskRepository.create(newTaskData);
      const savedTask = await this.taskRepository.save(newTask);

      return {
        id: savedTask.id,
        description: savedTask.description,
        user_id: savedTask.user_id,
        created_at: savedTask.created_at,
        updated_at: savedTask.updated_at,
      };
    } catch (error) {
      throw new HttpException(
        `Error saving task. Error: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAll(
    options: IPaginationOptions,
    finished?: string,
    tokenString?: string
  ): Promise<Pagination<Task>> {
    const token = tokenString.replace("Bearer ", "");
    const user = this.jwtService.decode(token);
    const userId = user.sub;
    const isFinished =
      finished === "true" ? true : finished === "false" ? false : null;

    const queryBuilder = this.taskRepository.createQueryBuilder("t");

    queryBuilder.select([
      "t.id",
      "t.description",
      "t.user_id",
      "t.attachment",
      "t.category_id",
      "t.is_finished",
      "t.created_at",
      "t.updated_at",
    ]);

    if (isFinished !== null) queryBuilder.where({ is_finished: isFinished });

    queryBuilder.andWhere({ user_id: userId });
    queryBuilder.orderBy("t.is_finished", "ASC");
    queryBuilder.addOrderBy("t.created_at", "DESC");

    options.limit = Number(options.limit) > 50 ? 50 : options.limit;

    const tasks = await paginate<Task>(queryBuilder, options);
    const countTasks = await this.countByStatus(userId);

    return {...tasks, ...countTasks};
  }

  async findOne(id: string, tokenString: string) {
    const token = tokenString.replace("Bearer ", "");
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.NOT_FOUND);

    return task;
  }

  async countByStatus(userId: string) {
    const finished = await this.taskRepository.count({ where: { is_finished: true, user_id: userId } });
    const unfinished = await this.taskRepository.count({ where: { is_finished: false, user_id: userId } });
    return {
      summary: {
        finished,
        unfinished,
      }
    };
  }

  async update(id: string, updateTaskData: UpdateTaskDto, tokenString: string) {
    const token = tokenString.replace("Bearer ", "");
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.NOT_FOUND);

    try {
      await this.taskRepository.update(id, updateTaskData);
    } catch (error) {
      throw new HttpException(
        `Error updating task. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async remove(id: string, tokenString: string) {
    const token = tokenString.replace("Bearer ", "");
    const user = this.jwtService.decode(token);
    const userId = user.sub;

    const task = await this.taskRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) throw new HttpException(`Task not found!`, HttpStatus.NOT_FOUND);

    try {
      await this.taskRepository.delete(id);

      if (task.attachment) {
        const tempDirectory =
          process.env.NODE_ENV === "development" ? "../../../tmp" : "/tmp";
        const dirStorage = path.resolve(".", tempDirectory);
        const filename = `${dirStorage}/${task.id}.pdf`;
        await deleteFile(filename);
      }
    } catch (error) {
      throw new HttpException(
        `Error removing task. Error: '${error.message}'.`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

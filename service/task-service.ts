import {TaskDTO} from "../dto/TaskDTO";
import {TaskIdDTO} from "../dto/TaskIdDTO";

export interface TaskService {

    getAllTask: (status?: string, pagination?: number) => Promise<TaskIdDTO[]>
    getTask: (id: number) => Promise<TaskIdDTO>
    createTask: (task: TaskDTO) => Promise<TaskIdDTO>
    removeTask: (id: number) => Promise<void>
    updateTask: (id: number, task: TaskDTO) => Promise<TaskIdDTO>
    changeTaskStatus: (id: number, status: string) => Promise<TaskIdDTO>

}
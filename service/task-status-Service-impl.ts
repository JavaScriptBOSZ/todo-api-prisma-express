import {PrismaClient, Status, Task} from "@prisma/client";
import {TaskService} from "./task-service";
import {StatusService} from "./status-service";
import {TaskIdDTO} from "../dto/TaskIdDTO";
import {TaskDTO} from "../dto/TaskDTO";

export class TaskStatusServiceImpl implements TaskService, StatusService {
    prisma: PrismaClient;
    DAO2DTO: (dao: Task, daoStatus: Status) => TaskIdDTO = (dao: Task, daoStatus: Status) => {
        return {
            id: dao.id,
            name: dao.name,
            description: dao.description,
            status: daoStatus.name,
        }
    };

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient
    }


    async changeTaskStatus(id: number, status: string): Promise<TaskIdDTO> {
        let prismaTaskClient = await this.prisma.task.update({
            data: {
                status: {
                    connectOrCreate: {
                        where: {
                            name: status
                        },
                        create: {
                            name: status
                        }
                    },
                },
            },
            where: {
                id: id
            },
            include: {
                status: true
            }
        });
        return this.DAO2DTO(prismaTaskClient, prismaTaskClient.status);
    }

    async createStatus(name: string): Promise<string> {
        let prismaStatusClient = await this.prisma.status.create({
            data: {
                name: name
            }
        });
        return prismaStatusClient.name;
    }

    async createTask(task: TaskDTO): Promise<TaskIdDTO> {
        let prismaTaskClient = await this.prisma.task.create({
            data: {
                name: task.name,
                description: task.description,
                status: {
                    connect: {
                        name: "TODO"
                    }
                }
            },
            include: {
                status: true
            }
        });

        return this.DAO2DTO(prismaTaskClient, prismaTaskClient.status);
    }

    async getAllStatus(): Promise<string[]> {
        let prismaStatusClient = await this.prisma.status.findMany()
        return prismaStatusClient.map(it => {
            return it.name
        });
    }

    async getAllTask(status?: string, pagination?: number): Promise<TaskIdDTO[]> {
        let prismaPromise

        if (status != null && pagination == null) {
            prismaPromise = await this.prisma.task.findMany({
                include: {
                    status: true,
                },
                where: {
                    status: {
                        name: status
                    }
                },
            });
        } else if (status == null && pagination != null) {
            prismaPromise = await this.prisma.task.findMany({
                include: {
                    status: true,
                },
                skip: (pagination * 10),
                take: 10,
            });
        } else if (status != null && pagination != null) {
            prismaPromise = await this.prisma.task.findMany({
                include: {
                    status: true,
                },
                where: {
                    status: {
                        name: status
                    }
                },
                skip: (pagination * 10),
                take: 10,
            });
        } else {
            prismaPromise = await this.prisma.task.findMany({
                include: {
                    status: true,
                },
            });
        }

        return prismaPromise.map(it => {
            return this.DAO2DTO(it, it.status)
        });

    }

    async getStatus(name: string): Promise<number> {
        let prismaStatusClient = await this.prisma.status.findFirstOrThrow({
            where: {
                name: name,
            },
        });
        return prismaStatusClient.id;
    }

    async getTask(id: number): Promise<TaskIdDTO> {
        let prismaStatusClient = await this.prisma.task.findFirstOrThrow({
            where: {
                id: id,
            },
            include: {
                status: true,
            },
        });
        return this.DAO2DTO(prismaStatusClient, prismaStatusClient.status);
    }

    async removeStatus(name: string): Promise<void> {
       await this.prisma.status.delete({
            where: {
                name: name
            }
        })
    }

    async removeTask(id: number): Promise<void> {
        await this.prisma.task.delete({
            where: {
                id: id
            }
        })
    }

    async updateStatus(name: string, newName: string): Promise<string> {
        let prismaStatusClient = await this.prisma.status.update({
            where: {
                name: name
            },
            data: {
                name: newName
            }
        });


        return prismaStatusClient.name;
    }

    async updateTask(id: number, task: TaskDTO): Promise<TaskIdDTO> {
        let prismaStatusClient = await this.prisma.task.update({
            where: {
                id: id
            },
            data: {
                name: task.name,
                description: task.description
            },
            include: {
                status: true
            }
        });

        return this.DAO2DTO(prismaStatusClient,prismaStatusClient.status);
    }

}
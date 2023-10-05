import express = require('express');
import {TaskService} from "./task-service";
import {StatusService} from "./status-service";
import {TaskDTO} from "../dto/TaskDTO";
import {TaskIdDTO} from "../dto/TaskIdDTO";


export const RoutsService = (app: express.Application, taskService: TaskService, statusService: StatusService) => {

    let toNumber = (num: any) => {
        try {
            return typeof num == "number" ? num : typeof num == "string" ? parseInt(num) : undefined;
        } catch (e) {
            return undefined
        }
    }

    app.get('/task', async (req, res) => {

        let status = req.query.status;
        let pagination = req.query.pagination;

        res.send(await taskService.getAllTask(
            typeof status == "string" ? status : undefined,
            toNumber(pagination))
        )
        return
    })

    app.post('/task', async (req, res) => {
        let bodyObj: TaskDTO = req.body
        try {
            let resObj: TaskIdDTO = await taskService.createTask(bodyObj)
            res.send(resObj);
            return
        }catch (e) {
            res.status(409).send('Conflict');
            return
        }

    })

    app.delete("/task/:id", async (req, res) => {
        let id = toNumber(req.params.id);
        if (id) {
            await taskService.removeTask(id)
            res.send({})
            return
        }
        res.status(404).send('Not found');
        return
    })

    app.get("/task/:id", async (req, res) => {
        let id = toNumber(req.params.id);
        if (id) {
            try {
                let taskIdDTO = await taskService.getTask(id);
                res.send(taskIdDTO)
                return
            } catch (e) {
            }
        }
        res.status(404).send('Not found');
        return
    })

    app.put("/task/:id", async (req, res) => {
        let id = toNumber(req.params.id);
        let bodyObj: TaskDTO = req.body
        if (id) {
            try {
                let taskIdDTO = await taskService.updateTask(id,bodyObj);
                res.send(taskIdDTO)
                return
            } catch (e) {
            }
        }
        res.status(404).send('Not found');
        return
    })

    app.put("/task/:id/:status", async (req, res) => {
        let id = toNumber(req.params.id);
        let status = req.params.status;

        if (!id) {
            res.status(404).send('Not found');
            return
        }

        try {
            let taskIdDTO = await taskService.changeTaskStatus(id, status);
            res.send(taskIdDTO)
            return
        } catch (e) {
            res.status(404).send('Not found');
            return
        }

    })

    app.get("/status", async (req, res) => {
        res.send(await statusService.getAllStatus())
        return
    })

    app.get("/status/:name", async (req, res) => {
        let name = req.params.name;
        try {
         await statusService.getStatus(name);
            res.send(""+await statusService.getStatus(name))
            return
        } catch (e) {
            res.status(404).send('Not found');
            return
        }
    })

    app.post("/status/:name", async (req, res) => {
        let name = req.params.name;
        try {
            res.send(statusService.createStatus(name))
            return
        } catch (e) {
            res.status(409).send('Conflict');
            return
        }
    })

    app.delete("/status/:name", async (req, res) => {
        let name = req.params.name;
        try {
            await statusService.removeStatus(name)
            res.send()
            return
        } catch (e) {
            res.status(409).send('Conflict');
            return
        }
    })

    app.put("/status/:name/:newName", async (req, res) => {
        let name = req.params.name;
        let newName = req.params.newName;

        try {
            res.send(statusService.updateStatus(name, newName))
            return
        } catch (e) {
            res.status(404).send('Not found');
            return
        }
    })
}
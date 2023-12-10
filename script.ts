import {PrismaClient} from '@prisma/client'
import {TaskStatusServiceImpl} from "./service/task-status-Service-impl";
import {RoutsService} from "./service/routs-service";

const prisma = new PrismaClient()

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3300;

app.use(express.json());
app.use(cors());

async function main() {

    try {
        await prisma.status.create({
            data: {
                name: "TODO"
            }
        })
        await prisma.status.create({
            data: {
                name: "DOING"
            }
        })
        await prisma.status.create({
            data: {
                name: "DONE"
            }
        })
    }catch (e) {

    }

    const Repo = new TaskStatusServiceImpl(prisma)

    RoutsService(app,Repo,Repo)

    app.listen(PORT)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
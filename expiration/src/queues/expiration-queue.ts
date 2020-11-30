import Queue from "bull"
import {ExpirationCompletePublisher} from "../events/publishers/expiration-complete-publisher"
import {natsWrapper} from "../nats-wrapper"

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>("order:expiration", { //1-й арг: название канала, 2-й: говорим queue что хотим подключиться к инстансу Redis сервера, который запущен в нутри pod`а, который создан в деплойменте
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => { //job то же самое, что и msg в node-nats-streaming server
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })

})

export {expirationQueue}
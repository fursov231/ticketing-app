import Queue from "bull"
import {ExpirationCompletePublisher} from "../events/publishers/expiration-complete-publisher"
import {natsWrapper} from "../nats-wrapper"

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>("order:expiration", { //1-st argument - channel name, 2-nd - tell to queue that we want connect to redis server that is running inside the pod
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => { //job = msg in node-nats-streaming server
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })

})

export {expirationQueue}
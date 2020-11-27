import {Message, Stan} from "node-nats-streaming"
import {Subjects} from "./subjects"

interface Event {
    subject: Subjects,
    data: any
}

export abstract class Listener<T extends Event> {
    abstract subject: T["subject"] //абстрактные классы должны быть определены подклассом
    abstract queueGroupName: string
    abstract onMessage(data: T["data"], msg: Message): void
    private client: Stan
    protected ackWait = 5 * 1000 //protected значит что подкласс может определять его если захочет

    constructor(client: Stan) { //конструктор требует предварительно инициализировать клиент, который уже подключен к нашему сетевому серверу
        this.client = client
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable() // отображает все пришедшие в прошлом ивенты
            .setManualAckMode(true) //опция отключает дефолтное поведение потери ивента при необработки (например хендлером), если не подтверждается успешная обработка ивента, то ивент уходит к другому listener`у подписанного на queue group до момента успешного выполнения (должно быть прописано msg.ack() )
            .setAckWait(this.ackWait) //5 секунд
            .setDurableName("accounting-service") //помогает не обрабатывать ошибочно ивенты, если например accounting service недоступен, и помечать ивенты как доставленные (processed)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName, // queueGroupName в связке c setDurableName не сбрасывает ивенты, если ненадолго отключился сервис
            this.subscriptionOptions()
        )
        subscription.on("message", (msg: Message) => {
            console.log(
                `Message received ${this.subject} /${this.queueGroupName}`
            )

            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData()

        return typeof data === "string"
            ? JSON.parse(data)
            : JSON.parse(data.toString("utf8")) //если получаем Buffer, то приводим к строке
    }
}

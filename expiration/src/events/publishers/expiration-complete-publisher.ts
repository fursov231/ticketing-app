import {ExpirationCompleteEvent, Publisher, Subjects} from "@vkassa/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

}
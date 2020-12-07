import axios from "axios" //каждый раз когда хотим получить данные, используем эту build функцию

export default ({req}) => {
    if (typeof window === "undefined") { // объект window - окружение браузера, если undefined - node.js
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers //для передачи куки
        })
    } else {
        return axios.create({
            baseURL: "/"

        })
    }
}

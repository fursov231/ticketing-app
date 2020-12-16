import axios from "axios"

//Function for receive data
export default ({req}) => {
    if (typeof window === "undefined") { // Object window - browser environment, if undefined - node.js environment
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req.headers //For cookie transfer
        })
    } else {
        return axios.create({
            baseURL: "/"

        })
    }
}

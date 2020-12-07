import {useState} from "react"
import useRequest from "../../hooks/use-request"
import Router from "next/router"

const newTicket = () => {

    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const {doRequest, errors} = useRequest({
        url: "/api/tickets",
        method: "post",
        body: {title, price},
        onSuccess: (ticket) => Router.push("/")
    })

    const onBlur = () => {
        const value = parseFloat(price) //
        if (isNaN(value) ) {
            return
        }

        setPrice(value.toFixed(2))
    }

    const onSubmit = (event) => {
        event.preventDefault()

        doRequest()
    }

    return <div>
        <h1>Формирование билета</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Название:</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"/>
            </div>
            <div className="form-group">
                <label>Цена:</label>
                <input
                    value={price}
                    onBlur={onBlur} //деселектит инпут
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"/>
            </div>
            {errors}
            <button className="btn-primary">Отправить</button>
        </form>
    </div>
}

export default newTicket
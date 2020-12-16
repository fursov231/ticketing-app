import {useState} from "react"
import Router from "next/router"
import useRequest from "../../hooks/use-request"

export default () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {doRequest, errors} = useRequest({
        url: "/api/users/signin",
        method: "post",
        body: {
            email,
            password
        },
        onSuccess: () => Router.push("/")
    })

    const onSubmit = async (err) => {
        err.preventDefault()

        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Электронная почта</label>
                <input value={email}
                       onChange={err => setEmail(err.target.value)}
                       className="form-control"/>
            </div>
            <div className="form-group">
                <label>Пароль</label>
                <input value={password}
                       onChange={err => setPassword(err.target.value)}
                       type="password"
                       className="form-control"/>
            </div>
            {errors}
            <button className="btn btn-primary">Войти</button>
        </form>
    )
}
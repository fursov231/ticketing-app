import Link from "next/link"

const LandingPage = ({tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td><Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}><a>Просмотр</a></Link></td>
            </tr>
        )
    })

    return (
        <div>
            <h1>Билеты</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Ссылка</th>
                </tr>
                </thead>
                <tbody>
                {ticketList}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client) => { //Receive data for rendering
    const {data} = await client.get("/api/tickets")
    return {tickets: data}

}

export default LandingPage
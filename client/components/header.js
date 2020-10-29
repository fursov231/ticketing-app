import Link from "next/link"

export default ({currentUser}) => {
    const links = [
        !currentUser && {label: "Sign Up", href: "/auth/signup"},
        !currentUser && {label: "Sign In", href: "/auth/signin"},
        currentUser && {label: "Sign out", href: "/auth/signout"}
    ]
        .filter(linkConfig => linkConfig) //отсеиваем false записи
        .map(({label, href}) => {
            return <li key={href} className="nav-item">
                <Link href={href}>
                    <a className="nav-link"> {label} </a>
                </Link>
            </li>
        })

    return <nav className="navbar navbar-light bg-dark">
        <Link href="/">
            <a className="navbar-brand">Kassa</a>
        </Link>
        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
}
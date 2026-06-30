import {useState} from 'react'
import {Link , useLocation} from 'react-router-dom'


const links = [
    {to: '/', label:'Home'},
    {to: '/anime', label:'Anime'},
    {to: '/characters', label:'Characters'},
    {to: '/favorites', label:'Favorites'},
    {to: '/my-library', label:'My Library'},
    {to: '/dashboard', label:'Dashboard'},
]
export default function NavBar() {
    const [open,setOpen] = useState(false)
    const location = useLocation()

      return (
        <nav className="navbar">
         <div className="navbar-inner container">
            <Link to="/" className="navbar-brand">
            <span className="brand-icon">&#9733;</span> AniVerse
           </Link>
           <button className="navbar-toggle" onClick={()=>setOpen(!open)}>
            <span></span><span></span><span></span>
           </button>
           <ul className={`navbar-links ${open ? open :""}`}>
            {links.map(link=>(
              <li key={link.to}>
                <Link
                 to={link.to}
                    className={location.pathname === link.to? "active" : ""}
                     onClick={()=>setOpen(false)}
                     >
                    {link.label}
                </Link>
              </li>  
              ))}
           </ul>
        </div>
    </nav>
  )
}



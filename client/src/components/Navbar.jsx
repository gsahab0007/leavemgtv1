import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("accessToken")
        navigate('/login');
    }

    useEffect(() => {
        // Check if user is already logged in (using local storage)
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);
    let cssNavLink = "w-24 md:w-40 text-xs md:text-lg px-3 py-2 text-center bg-cyan-400 hover:bg-cyan-500 active:scale-95 rounded-md";

    return (
        <>
            <section>
                <nav className='flex justify-between px-10 h-16  items-center bg-blue-500 text-gray-100'>
                    <div>logo</div>
                    <div>

                        <ul className='flex gap-10 text-lg'>
                            <NavLink to='/' className={cssNavLink}><li>Home</li></NavLink>
                            {!isLoggedIn && <NavLink to='/login' className={cssNavLink}><li>Login</li></NavLink>}
                            {isLoggedIn && <button onClick={handleLogout} className={cssNavLink}>Logout</button>}
                            <NavLink to='/allemployee' className={cssNavLink}><li>Employees</li></NavLink>


                        </ul>
                    </div>
                </nav>
            </section>

        </>
    )
}

export default Navbar
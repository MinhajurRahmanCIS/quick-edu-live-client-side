import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthProvider';
import toast from 'react-hot-toast';
const ProfileMenu = () => {
    const { user, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

    const handelToggle = (event) => {
        if (event.target.checked) {
            setTheme("dark");
        }
        else {
            setTheme("light");
        }
    }
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const defaultTheme = localStorage.getItem("theme");
        document.querySelector("html").setAttribute("data-theme", defaultTheme);
    }, [theme]);

    const handelLogout = () => {
        logOut()
            .then(() => {
                toast.success("Logout Successfully!")
            })
            .catch(err => console.log(err));
    };
    return (
        <>
            <p className="font-semibold hidden lg:block md:block"> {user?.uid && user?.displayName}</p>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 ring ring-neutral ring-offset-base-100 ring-offset-2 rounded-full">
                        <img src={user?.uid && user?.photoURL ? user.photoURL : "https://i.ibb.co/TbC7PBT/male-Student.png"} alt="User Profile" />
                    </div>
                </div>
                <ul tabIndex={1} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 gap-1">
                    <li className="block md:hidden lg:hidden">
                        <Link className="justify-between">
                            <p className="font-semibold"> {user?.uid && user?.displayName}</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/myhome/profile" className="justify-between">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/myhome/whatsnew" className="justify-between">
                            Whats New
                            <span className="badge">Version 0.9</span>
                        </Link>
                    </li>
                    <li><Link to="/myhome/report">Report a Problem</Link></li>
                    <li><Link to="/myhome/feedback">Feedback</Link></li>
                    <li>
                        <label className="swap swap-rotate">
                            {/* this hidden checkbox controls the state */}
                            <input
                                type="checkbox"
                                onChange={handelToggle}
                                checked={theme === "light" ? false : true}
                            />

                            {/* sun icon */}
                            <svg
                                className="swap-on h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                            </svg>

                            {/* moon icon */}
                            <svg
                                className="swap-off h-5 w-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                            </svg>
                            {theme === "light" ? "Light" : "Dark"}

                        </label>
                    </li>
                    {
                        user?.uid && <li><Link onClick={handelLogout} className="bg-error text-white border-2 border-neutral hover:bg-slate-300 hover:text-black">Logout</Link></li>
                    }
                </ul>
            </div>
        </>
    );
};

export default ProfileMenu;
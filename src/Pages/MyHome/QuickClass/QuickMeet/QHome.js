import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useLoadUser from '../../../../hooks/useLoadUser';
import Loading from '../../../Shared/Loading/Loading';
import { AuthContext } from '../../../../contexts/AuthProvider';
import toast from 'react-hot-toast';
import GoBackButton from '../../../../components/GoBackButton';

function QHome() {
  const { user } = useContext(AuthContext);
  const { userInfo, userIsLoading } = useLoadUser(user);
  const { id } = useParams();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const defaultTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", defaultTheme);
  }, [theme]);

  const createRoom = async (id) => {
    const response = await fetch('https://meet-p57l.onrender.com/api/createRoom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: id }),
    });
    const data = await response.json();
    // console.log(data)
    toast.success("Joining Class")
    navigate(`/room/${id}`)
  };

  if (userIsLoading) {
    return <Loading></Loading>
  }

  return (
    <div className="hero bg-base-100 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <GoBackButton />
          <h1 className="text-4xl font-bold my-5">Welcome, {userInfo?.data?.name}</h1>
          <button onClick={() => createRoom(id)} className="btn btn-info btn-md text-2xl font-bold">Join Class</button>
        </div>
      </div>
    </div>
  );
}

export default QHome;
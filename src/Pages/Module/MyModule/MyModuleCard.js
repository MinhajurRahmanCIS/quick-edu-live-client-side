import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MyModuleCard = ({ courseModule, refetch }) => {
    const { _id, name, chapters, email } = courseModule;
    const navigate = useNavigate();

    const handelStart = async (id) => {
        const res = await fetch(`https://quick-edu-live-server-side.onrender.com/specificModule/${id}/${email}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            }
        })
        const data = res.json();

        refetch();
        navigate(`/myhome/startmodule/${_id}`)
    }

    return (
        <div className="card card-compact bg-base-100 shadow-xl border">
            <div className="card-body">
                <h1 className="text-2xl font-bold">{name}</h1>
                <span><strong>Total Chapters :</strong> {chapters?.length}</span>
                <h4 className="">Table of Contents</h4>
                <p>
                    {chapters.length > 1 &&
                        chapters?.slice(0, (chapters.length - 1))?.map((c, i) =>
                            <ul className="list-disc px-5" key={i}>
                                <li className="font-semibold text-xs mt-2">{c.title}</li>
                            </ul>
                        )
                    }
                </p>
                <div className="card-actions justify-end">
                    {
                        courseModule?.courseStartedAt ?
                            <>
                                {
                                    courseModule?.courseEndAt ?
                                        <>
                                            <Link to={`/myhome/startmodule/${_id}`} className="btn btn-neutral btn-outline">View</Link>

                                            <Link to={`/myhome/certificate/`} className="btn btn-warning">Certificate</Link>
                                        </>

                                        :
                                        <Link to={`/myhome/startmodule/${_id}`} className="btn btn-neutral btn-outline">Continue</Link>

                                }
                            </>
                            :
                            <Link onClick={() => handelStart(_id)} className="btn btn-neutral">Start</Link>
                    }
                </div>
            </div>
        </div>
    );
};

export default MyModuleCard;
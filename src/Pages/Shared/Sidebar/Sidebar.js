import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CgHomeAlt } from 'react-icons/cg';
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineLiveHelp, MdOutlineViewModule } from "react-icons/md";
import { GrScan } from "react-icons/gr";
import { LuFileScan, LuPresentation } from "react-icons/lu";
import { FcDocument } from "react-icons/fc";
import { IoDiamond } from "react-icons/io5";
import { AuthContext } from '../../../contexts/AuthProvider';
import useTeacher from '../../../hooks/useTeacher';
import usePremium from '../../../hooks/UsePremium';
import { RiPresentationLine } from 'react-icons/ri';
import { BsFileEarmarkSlides } from 'react-icons/bs';
import { VscFileSubmodule } from 'react-icons/vsc';
import { GoFileSubmodule } from 'react-icons/go';
const Sidebar = ({ classes, enrollClasses }) => {
    const { user } = useContext(AuthContext);
    const [isTeacher] = useTeacher(user?.email);
    const [isPremium] = usePremium(user?.email);
    return (
        <div className="drawer-side border-x-2">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu sm:w-80 min-h-full bg-base-200 md:bg-transparent text-base-content gap-0.5">
                {/* Sidebar content here */}
                <li className="text-xl font-bold"><Link to="/myhome"><CgHomeAlt></CgHomeAlt> Home</Link></li>
                <ul className="menu">
                    <li>
                        <details open>
                            <summary className="text-xl font-bold"><FaGraduationCap></FaGraduationCap>
                                {
                                    isTeacher ? "Teaching" : "Enrolled"
                                }
                            </summary>
                            <ul className="font-semibold">
                                {isTeacher ?
                                    classes &&
                                    classes?.map(c =>
                                        <li
                                            key={c._id}
                                            c={c}
                                            className="mt-0.5"><Link to={`/myhome/classinfo/${c._id}`}>{c.name}</Link></li>)
                                    :
                                    enrollClasses &&
                                    enrollClasses?.map(c =>
                                        <li
                                            key={c.classInfo[0]._id}
                                            c={c}
                                            className="mt-0.5"><Link to={`/myhome/classinfo/${c.classInfo[0]._id}`}>{c.classInfo[0].name}</Link></li>)
                                }
                            </ul>
                        </details>
                    </li>
                </ul>

                <ul className="menu">
                    <li>
                        <details close>
                            <summary className="text-xl font-bold"><RiPresentationLine />Ai Presentation</summary>
                            <ul className="font-semibold">
                                <li className="text-xl font-bold"><Link to="/myhome/presentation"> <LuPresentation />Generate Presentation</Link></li>
                                <li className="text-xl font-bold mt-0.5"><Link to="/myhome/mypresentation"> <BsFileEarmarkSlides />My Presentation</Link></li>
                            </ul>
                        </details>
                    </li>
                </ul>

                <ul className="menu">
                    <li>
                        <details close>
                            <summary className="text-xl font-bold"><VscFileSubmodule  />Ai Course</summary>
                            <ul className="font-semibold">
                                <li className="text-xl font-bold"><Link to="/myhome/module"> <GoFileSubmodule  />Generate Course Module</Link></li>
                                <li className="text-xl font-bold mt-0.5"><Link to="/myhome/mymodule"> <MdOutlineViewModule  />My Course</Link></li>
                            </ul>
                        </details>
                    </li>
                </ul>

                {
                    isTeacher && isPremium ?
                        <ul className="menu">
                            <li>
                                <details close>
                                    <summary className="text-xl font-bold"><GrScan></GrScan>Paper Checker</summary>
                                    <ul className="font-semibold">
                                        <li className="text-xl font-bold"><Link to="/myhome/paperchecker"> <LuFileScan></LuFileScan>Check Paper</Link></li>
                                        <li className="text-xl font-bold mt-0.5"><Link to="/myhome/allpaper"> <FcDocument></FcDocument>All Paper</Link></li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                        :
                        isTeacher && <li className="text-xl"><Link to="/myhome/checkout" className="btn btn-neutral font-bold text-[#d4af37]"><IoDiamond></IoDiamond>Ai Paper Checker</Link></li>
                }

                <li className="text-xl font-bold"><Link to="/myhome/help">  <MdOutlineLiveHelp></MdOutlineLiveHelp>Help</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
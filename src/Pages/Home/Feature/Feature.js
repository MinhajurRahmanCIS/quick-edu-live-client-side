import React from 'react';
import { MdOutlineAssignment, MdOutlineDocumentScanner, MdOutlineQuiz } from 'react-icons/md';
import { SiGooglebard, SiGoogleclassroom } from 'react-icons/si';
import { RiPresentationFill } from "react-icons/ri";
import { GiArtificialHive, GiVideoConference } from "react-icons/gi";
import { RiLiveLine } from "react-icons/ri";
import { PiChats } from "react-icons/pi";

const Feature = () => {
    return (
        <div className="bg-base-200 p-10 mt-10">
            <h1 className="text-5xl font-semibold text-center mb-5">Feature</h1> 
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 my-5">
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex gap-2"><SiGoogleclassroom /></h2>
                    <p className="text-xl font-semibold">Classroom</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <MdOutlineQuiz /></h2>
                    <p className="text-xl font-semibold">Ai Quiz Generator</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <MdOutlineAssignment /> </h2>
                    <p className="text-xl font-semibold">Ai Assignment Generator</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <RiPresentationFill  /> </h2>
                    <p className="text-xl font-semibold">Ai Presentation Generator</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <MdOutlineDocumentScanner   /> </h2>
                    <p className="text-xl font-semibold">Ai Paper Checker</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><RiLiveLine className="text-lg" /> <GiVideoConference  /> </h2>
                    <p className="text-xl font-semibold ms-1">Live Class</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <GiArtificialHive   /> </h2>
                    <p className="text-xl font-semibold ms-1">AI Course Creation with Teacher Narration</p>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl border py-20 hover:bg-slate-200">
                <div className="card-body flex flex-col items-center justify-center text-center">
                    <h2 className="text-8xl flex"><SiGooglebard className="text-xs text-blue-400" /> <PiChats />  </h2>
                    <p className="text-xl font-semibold ms-1">Ai Professor ChatBot</p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Feature;
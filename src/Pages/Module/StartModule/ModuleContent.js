import React from 'react';
import { RiSpeakLine } from "react-icons/ri";
import { HiOutlineSpeakerXMark } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";


const ModuleContent = ({ content, speak, chapterNumber, speakTurnOff, setResult }) => {
    return (
        <div className="card lg:card-side bg-base-100 shadow-xl border">
            {
                content.content &&
                <div className="card-body">
                    <h2 className="text-2xl font-bold">{content.title}</h2>
                    <p className="text-justify">{content.content}</p>
                    <p className="text-2xl font-bold mt-2">Examples :</p>
                    <p className="list-disc">
                        {
                            content?.example?.map((ex, i) =>
                                <li
                                    key={i}
                                    className="text-justify">
                                    {ex}
                                </li>
                            )
                        }
                    </p>

                    <div className="card-actions justify-end mt-5">
                        <div className="tooltip" data-tip="Listen">
                            <button onClick={() => speak(chapterNumber)} className="btn btn-neutral"><RiSpeakLine className="text-3xl font-bold" /></button>
                        </div>

                        <div className="tooltip" data-tip="Stopped Listen">
                            <button onClick={speakTurnOff} className="btn btn-error btn-outline"><HiOutlineSpeakerXMark className="text-3xl font-bold hover:text-white" /></button>
                        </div>

                        {
                            content?.chapterEndAt &&
                            <div className="tooltip" data-tip="Test Result">
                                <button onClick={() => setResult(true)} className="btn btn-info btn-outline"><IoDocumentTextOutline className="text-3xl font-bold hover:text-white" /></button>
                            </div>
                        }
                    </div>
                </div>
            }

            {
                !content.content &&
                <div className="card-body  text-center">
                    <h2 className="text-5xl font-bold">Final Test</h2>
                    <p className="text-xl">Best of Luck</p>

                    <div className="card-actions justify-end mt-5">
                        {
                            content?.chapterEndAt &&
                            <div className="tooltip" data-tip="Test Result">
                                <button onClick={() => setResult(true)} className="btn btn-info btn-outline"><IoDocumentTextOutline className="text-3xl font-bold hover:text-white" /></button>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default ModuleContent;
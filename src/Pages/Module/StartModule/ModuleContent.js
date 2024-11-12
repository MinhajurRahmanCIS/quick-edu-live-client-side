import React from 'react';

const ModuleContent = ({ content, speak, chapterNumber, speakTurnOff }) => {

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl border">
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
                    <button onClick={() => speak(chapterNumber)} className="btn btn-primary">Listen Again</button>

                    <button onClick={speakTurnOff} className="btn btn-primary">Stop</button>
                </div>
            </div>

        </div>
    );
};

export default ModuleContent;
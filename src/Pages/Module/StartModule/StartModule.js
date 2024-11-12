import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthProvider';
import useLoadModule from '../../../hooks/useLoadModule';
import Loading from '../../Shared/Loading/Loading';
import ChaptersProgress from './ChaptersProgress';
import ModuleContent from './ModuleContent';

const StartModule = () => {
    const [subtitle, setSubtitle] = useState("");
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [chapterNumber, setChapterNumber] = useState(0);
    const { courseModule, courseModuleLoading, refetch } = useLoadModule(id, user.email);

    const speak = (number) => {
        if ('speechSynthesis' in window) {
            setTimeout(() => {
                const script = courseModule?.chapters[number]?.teacherScript;
                if (!script) return; // Ensure the script exists

                const utterance = new SpeechSynthesisUtterance(script);

                // Display full script initially
                setSubtitle(script);

                // Update displayed text word by word
                utterance.onboundary = (event) => {
                    const wordStart = event.charIndex;
                    const wordEnd = wordStart + event.charLength;
                    setSubtitle(script.slice(0, wordEnd));
                };

                window.speechSynthesis.speak(utterance);
            }, 5000); // 5000 milliseconds = 5 seconds
        } else {
            alert("Sorry, your browser doesn't support text-to-speech!");
        }
    };

    const speakTurnOff = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        } else {

        }
    };

    useEffect(() => {
        // const timer = setTimeout(() => {
        //     speak(chapterNumber);
        // }, 1000); // Delay of 1 second

        // Event handler to stop speech when the window loses focus
        const handleWindowBlur = () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };

        // Add event listener for window blur
        window.addEventListener('blur', handleWindowBlur);

        // Clean up timer and event listener on component unmount
        // return () => {
        //     clearTimeout(timer);
        //     window.removeEventListener('blur', handleWindowBlur);
        // };
    }, []); // Empty dependency array ensures this runs only once



    if (courseModuleLoading) {
        return <Loading />;
    }

    const handelNextChapter = () => {
        if (chapterNumber + 1 < courseModule?.chapters?.length) {
            setChapterNumber(chapterNumber + 1);
            speak(chapterNumber + 1);
        }
    };

    const handelPrevChapter = () => {
        if (chapterNumber > 0) {
            setChapterNumber(chapterNumber - 1);
            speak(chapterNumber - 1);
        }
    };


    return (
        <div className="container mx-auto py-5">
            <h1 className="text-center text-3xl font-bold mb-8">Chapters Progress</h1>
            <div className="flex justify-center px-4">
                <ChaptersProgress
                    chapters={courseModule?.chapters}
                    chapterNumber={chapterNumber}
                />
            </div>

            <div className="my-10 px-5">
                <ModuleContent
                    content={courseModule?.chapters[chapterNumber]}
                    speak={speak}
                    speakTurnOff={speakTurnOff}
                    chapterNumber={chapterNumber}
                />
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={handelPrevChapter}
                    className="btn btn-neutral"
                    disabled={chapterNumber === 0}
                >
                    Previous
                </button>

                <button
                    onClick={handelNextChapter}
                    className="btn btn-neutral"
                    disabled={chapterNumber === courseModule?.chapters?.length - 1}
                >
                    Next
                </button>
            </div>

            {
                subtitle &&
                <div className="my-5 px-2">
                <p className="text-xl font-bold mb-2">Ai Teacher Speaking : </p>
                    <div id="subtitle-container" className="bg-stone-300 text-xl font-semibold  text-justify leading-loose px-2" >
                        {subtitle}
                    </div>
                </div>
            }


        </div>
    );
};

export default StartModule;

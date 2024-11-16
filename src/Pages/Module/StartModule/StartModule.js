import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthProvider';
import useLoadModule from '../../../hooks/useLoadModule';
import Loading from '../../Shared/Loading/Loading';
import ChaptersProgress from './ChaptersProgress';
import ModuleContent from './ModuleContent';
import toast from 'react-hot-toast';
import StartMcq from './StartMcq';
import McqResult from './McqResult';

const StartModule = () => {
    const [subtitle, setSubtitle] = useState("");
    const [startMCQ, setStartMCQ] = useState(true);
    const [result, setResult] = useState(false);
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [chapterNumber, setChapterNumber] = useState(0);
    const { courseModule, courseModuleLoading, refetch } = useLoadModule(id, user.email);

    const speak = (number) => {
        setSubtitle("");
        if ('speechSynthesis' in window) {
            toast.loading("Loading...", { duration: 5000 })
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
            toast("Stopped", { icon: '🚫', });
            setSubtitle("");
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
            setSubtitle("");
        }
    };

    const handelPrevChapter = () => {
        if (chapterNumber > 0) {
            setChapterNumber(chapterNumber - 1);
            speak(chapterNumber - 1);
            setSubtitle("");
            setStartMCQ(true);
        }
    };

    const handelNext = () => {
        toast.success("Answer It!", { duration: 2000 });
        setStartMCQ(false);
        setSubtitle("");
    };

    return (
        <div className="container mx-auto py-8">
            {
                startMCQ ?

                    <>
                        {
                            !result &&
                            <>
                                <h1 className="text-center text-3xl font-bold mb-8">Chapters Progress</h1>
                                <div className="flex justify-center px-4">
                                    <ChaptersProgress
                                        chapters={courseModule?.chapters}
                                        chapterNumber={chapterNumber}
                                    />
                                </div>

                                {
                                    subtitle &&
                                    <div className="my-5 px-5">
                                        <p className="text-xl font-bold mb-2">Teacher Narration : </p>
                                        <div id="subtitle-container" className="bg-stone-300 text-xl font-semibold  text-justify leading-loose px-2" >
                                            {subtitle}
                                        </div>
                                    </div>
                                }

                                <div className="my-10 px-5">
                                    <ModuleContent
                                        content={courseModule?.chapters[chapterNumber]}
                                        speak={speak}
                                        speakTurnOff={speakTurnOff}
                                        chapterNumber={chapterNumber}
                                        setResult={setResult}
                                    />
                                </div>

                                <div className="flex justify-between items-center px-5">
                                    <button
                                        onClick={handelPrevChapter}
                                        className="btn btn-neutral"
                                        disabled={chapterNumber === 0}
                                    >
                                        Previous
                                    </button>

                                    {
                                        !courseModule?.chapters[chapterNumber].chapterEndAt ?
                                            <button
                                                onClick={handelNext}
                                                className="btn btn-neutral"
                                            >
                                                Next
                                            </button>
                                            :
                                            <>
                                                {
                                                    courseModule?.chapters?.length === chapterNumber + 1
                                                        ?
                                                        <Link  className="btn btn-neutral" to="/myhome/certificate">Certificate </Link>
                                                        :

                                                        <button
                                                            onClick={handelNextChapter}
                                                            className="btn btn-neutral"
                                                            disabled={chapterNumber === courseModule?.chapters?.length - 1}
                                                        >
                                                            Next
                                                        </button>
                                                }
                                            </>

                                    }

                                </div>
                            </>
                        }

                    </>
                    :
                    <>
                        <h1 className="text-3xl font-bold text-center">Test {chapterNumber + 1} </h1>
                        <div className="divider divider-neutral"></div>
                        <StartMcq
                            mcq={courseModule?.chapters[chapterNumber].mcqs}
                            id={id}
                            email={user?.email}
                            index={chapterNumber}
                            setStartMCQ={setStartMCQ}
                            refetch={refetch}
                            setResult={setResult}
                            chapterLength={courseModule?.chapters?.length}
                        />
                    </>
            }

            {
                result &&

                <McqResult
                    setResult={setResult}
                    mcq={courseModule?.chapters[chapterNumber]}
                    courseModuleLoading={courseModuleLoading}
                />
            }

        </div>
    );
};

export default StartModule;

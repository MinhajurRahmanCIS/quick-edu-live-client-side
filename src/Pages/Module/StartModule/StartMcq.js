import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StartMcq = ({ mcq, id, index, email, setStartMCQ, refetch, chapterLength }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const submit = async (data) => {
        const results = mcq.map((ques, i) => {
            const userAnswer = data[`question-${i}`].slice(0, 1);
            const isCorrect = userAnswer.slice(0, 1) === ques.answer.slice(0, 1);
            return { userAnswer, isCorrect };
        });

        const res = await fetch(`http://localhost:5000/moduleProgress/${id}/${email}/${index}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(results)
        });

        const status = await res.json();
        console.log(status)
        if (status.status === 200) {
            toast.success("Submitted");

            if (chapterLength === index + 1) {
                navigate('/myhome/certificate');
                const res = await fetch(`http://localhost:5000/moduleEnd/${id}/${email}`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(results)
                });
        
                const status = await res.json();
            }

            setStartMCQ(true);
            refetch();
        }
    };


    useEffect(() => {

    }, []);

    return (
        <div className="mt-10 p-5">
            <form onSubmit={handleSubmit(submit)}>
                {mcq?.map((ques, i) => (
                    <div key={i}>
                        <h1 className="text-xl font-bold my-5">
                            Q{i + 1}. {ques.question}
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                            {ques?.options?.map((option, j) => (
                                <label key={j} className="flex items-center gap-2">
                                    <input
                                        {...register(`question-${i}`)}
                                        type="radio"
                                        value={option}
                                        className="radio"
                                        required
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-neutral mt-10 px-10">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StartMcq;

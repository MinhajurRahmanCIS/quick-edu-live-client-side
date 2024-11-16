import React from 'react';
import Loading from '../../Shared/Loading/Loading';

const McqResult = ({ setResult, mcq }) => {

    if (!setResult || !mcq) {
        return <Loading />
    }
    // Calculate scores and statistics
    const calculateStats = () => {
        if (!mcq?.submission || !mcq?.mcqs) return {
            totalScore: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            percentage: 0
        };

        const correctAnswers = mcq?.mcqs?.reduce((count, _, index) => {
            return count + (mcq?.submission[index]?.userAnswer === mcq?.mcqs[index]?.answer ? 1 : 0);
        }, 0);

        const totalQuestions = mcq?.mcqs?.length;
        const incorrectAnswers = totalQuestions - correctAnswers;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        return {
            totalScore: correctAnswers,
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            percentage
        };
    };

    const stats = calculateStats();

    return (
        <div className="px-2">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="btn btn-neutral"
                    onClick={() => setResult(false)}
                > Go Back</button>

            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-2 rounded shadow">
                        <div className="text-lg font-bold">{stats?.percentage}%</div>
                        <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow">
                        <div className="text-lg font-bold text-green-600">{stats?.correctAnswers}</div>
                        <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow">
                        <div className="text-lg font-bold text-red-600">{stats?.incorrectAnswers}</div>
                        <div className="text-sm text-gray-600">Incorrect</div>
                    </div>
                    <div className="bg-white p-2 rounded shadow">
                        <div className="text-lg font-bold">{stats?.totalScore}/{stats?.totalQuestions}</div>
                        <div className="text-sm text-gray-600">Total Marks</div>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-5">
                <form>
                    {mcq?.mcqs?.map((ques, i) => {
                        const userAnswer = mcq?.submission[i]?.userAnswer;
                        const isCorrect = userAnswer === ques?.answer;

                        return (
                            <div key={i} className={`mb-8 p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                                <h1 className="text-xl font-bold my-3 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span>Q{i + 1}. {ques?.question}</span>
                                        <span className="ml-2 text-sm text-gray-600">
                                            (1 mark)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? '✓' : '✗'}
                                        </span>
                                        <span className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? '+1' : '0'}
                                        </span>
                                    </div>
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                                    {ques?.options?.map((option, j) => {
                                        const optionLetter = String.fromCharCode(97 + j);
                                        const isUserSelection = userAnswer === optionLetter;
                                        const isCorrectAnswer = ques.answer === optionLetter;

                                        return (
                                            <label
                                                key={j}
                                                className={`flex items-center gap-2 p-2 rounded ${isCorrectAnswer ? 'bg-green-100' :
                                                    isUserSelection && !isCorrect ? 'bg-red-100' :
                                                        ''
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={optionLetter}
                                                    checked={isUserSelection}
                                                    readOnly
                                                    className="radio"
                                                />
                                                <span className={isCorrectAnswer ? 'font-semibold' : ''}>
                                                    {option}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                <div className="mt-2 text-sm">
                                    {!isCorrect && (
                                        <p className="text-red-600">
                                            Correct answer: {ques?.options[ques?.answer?.charCodeAt(0) - 97]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </form>
            </div>
        </div>
    );
};

export default McqResult;
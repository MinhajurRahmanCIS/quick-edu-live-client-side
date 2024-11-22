import React, { useContext, useRef } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useParams } from 'react-router-dom';
import useLoadModule from '../../../hooks/useLoadModule';
import Loading from '../../Shared/Loading/Loading';
import useLoadUser from '../../../hooks/useLoadUser';
import { useReactToPrint } from 'react-to-print';

const Certificate = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const { courseModule, courseModuleLoading } = useLoadModule(id, user.email);
    const { userInfo, userIsLoading } = useLoadUser(user);

    const printRef = useRef();

    const handelPrint = useReactToPrint({
        content: () => printRef.current
    });

    if (courseModuleLoading || userIsLoading) {
        return <Loading />
    }

    const date = new Date(courseModule.courseEndAt);
    const offsetDate = new Date(date.getTime() + 6 * 60 * 60 * 1000); // Adjust to GMT+6
    const day = offsetDate.getUTCDate();
    const month = offsetDate.toLocaleString('en-US', { month: 'long', timeZone: 'Asia/Dhaka' });
    const year = offsetDate.getUTCFullYear();

    const endedDate = `${day} ${month} ${year}`;

    return (
        <div className="relative min-h-screen bg-gray-100 p-4 font-mono">
            <div
                className="flex items-center justify-center min-h-screen"
                ref={printRef}
            >
                <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Certificate of Completion</h1>
                    <p className="text-lg text-gray-600 mb-6">This is to certify that</p>
                    <h2 className="text-3xl font-semibold text-blue-600 mb-2">
                        {userInfo?.data?.name || "Recipient Name"}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">has successfully completed the course</p>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                        {courseModule?.name || "Course Title"}
                    </h3>
                    <div className="flex justify-between items-center mt-8">
                        <div>
                            <p className="text-sm text-gray-500">Issued on:</p>
                            <p className="font-medium text-gray-700">{endedDate}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Authorized by:</p>
                            <p className="font-medium text-gray-700">Quick Edu Live</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Print button */}
            <button
                onClick={handelPrint}
                className="btn btn-neutral fixed bottom-4 right-4 px-6 py-3 "
            >
                Print Certificate
            </button>
        </div>
    );
};

export default Certificate;

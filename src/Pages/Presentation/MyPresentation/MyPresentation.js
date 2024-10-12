import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import pptxgen from 'pptxgenjs';
import { FaFileDownload } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <button onClick={onClose} className="btn btn-circle btn-error float-right text-2xl">&times;</button>
                {children}
            </div>
        </div>
    );
};

const MyPresentation = () => {
    const { user } = useContext(AuthContext);
    const [viewingPresentation, setViewingPresentation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: presentations, isLoading, error } = useQuery({
        queryKey: ['presentations', user.email],
        queryFn: async () => {
            const response = await fetch(`https://quick-edu-live-server-side.vercel.app/presentation/${user.email}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });

    const handleDownload = async (presentation) => {
        const pptx = new pptxgen();

        presentation.slides.forEach(slide => {
            const pptSlide = pptx.addSlide();
            pptSlide.addText(slide.title, { x: 1, y: 1, fontSize: 20, bold: true });
            pptSlide.addText(slide.content, { x: 1, y: 2.5, fontSize: 12 });
        });

        pptx.writeFile({ fileName: `${presentation.topic}.pptx` });
    };

    const handleView = (presentation) => {
        setViewingPresentation(presentation);
        setIsModalOpen(true);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold my-10 text-center mb-10">My Presentations</h2>
            <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-5">
                {presentations && presentations.length > 0 ? (
                    <>
                        {presentations.map((presentation) => (
                            <div key={presentation._id} className="bg-white shadow rounded-lg p-4 border ">
                                <h3 className="text-xl font-semibold">{presentation.topic}</h3>
                                <p className="text-gray-600">{presentation.description}</p>
                                <div className="flex justify-between items-center gap-5 mt-5">
                                    <div className="tooltip" data-tip="Download">
                                        <button
                                            onClick={() => handleDownload(presentation)}
                                            className="btn btn-outline btn-primary"
                                        >
                                            <FaFileDownload className="text-3xl" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleView(presentation)}
                                        className="btn btn-success text-white"
                                    >
                                        View Presentation
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No presentations found.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {viewingPresentation && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{viewingPresentation.topic}</h2>
                        <p className="mb-4">{viewingPresentation.description}</p>
                        <div className="space-y-4">
                            {viewingPresentation.slides.map((slide, index) => (
                                <div key={index} className="border p-4 rounded">
                                    Page {index + 1}
                                    <h4 className="font-bold">{slide.title}</h4>
                                    <p>{slide.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyPresentation;
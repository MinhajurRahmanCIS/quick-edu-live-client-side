import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import jsPDF from 'jspdf';
import { AuthContext } from '../../../contexts/AuthProvider';
import Loading from '../../Shared/Loading/Loading';
import { FaFileDownload } from 'react-icons/fa';

const MyModule = () => {
    const { user } = useContext(AuthContext);

    const { data: modules, isLoading, isError } = useQuery({
        queryKey: ['modules', user.email],
        queryFn: () =>
            fetch(`https://quick-edu-live-server-side.vercel.app/module/${user.email}`)
                .then(res => res.json()),
    });

    const downloadModule = async (moduleId) => {
        try {
            const response = await fetch(`https://quick-edu-live-server-side.vercel.app/specificModule/${moduleId}`);
            const module = await response.json();
            const pdf = new jsPDF();
            let yOffset = 20;
            const pageHeight = pdf.internal.pageSize.height;

            // Add title
            pdf.setFontSize(24);
            pdf.text(module.topic || 'Untitled Module', 20, yOffset);
            yOffset += 20;

            // Add description
            if (module.description) {
                pdf.setFontSize(12);
                const descriptionLines = pdf.splitTextToSize(module.description, 170);
                pdf.text(descriptionLines, 20, yOffset);
                yOffset += descriptionLines.length * 7 + 10;
            }

            // Add tone and pages
            pdf.setFontSize(12);
            pdf.text(`Tone: ${module.tone || 'N/A'} | Chapters: ${module.pages || 'N/A'}`, 20, yOffset);
            yOffset += 15;

            // Set font size
            pdf.setFontSize(18);

            // Get page width and calculate the position for centered text
            const pageWidth = pdf.internal.pageSize.getWidth();
            const text = "Table of Contents";
            const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const xOffset = (pageWidth - textWidth) / 2;

            // Add the centered text
            pdf.text(text, xOffset, yOffset);

            // Update yOffset for next content
            yOffset += 15;

            pdf.setFontSize(12);
            module.chapters.slice(1).forEach((chapter, index) => {
                const chapterTitle = `${index + 1}. ${chapter.title}`;
                pdf.text(chapterTitle, 20, yOffset);
                yOffset += 10;
                if (yOffset > pageHeight - 20) {
                    pdf.addPage();
                    yOffset = 20;
                }
            });

            // Add chapters
            if (Array.isArray(module.chapters)) {
                module.chapters.slice(1).forEach((chapter, index) => {
                    pdf.addPage();
                    yOffset = 20;

                    pdf.setFontSize(18);
                    pdf.text(`${index + 1}. ${chapter.title || 'Untitled Chapter'}`, 20, yOffset);
                    yOffset += 15;

                    if (chapter.content) {
                        pdf.setFontSize(12);
                        const contentLines = pdf.splitTextToSize(chapter.content, 170);
                        pdf.text(contentLines, 20, yOffset);
                        yOffset += contentLines.length * 7 + 10;
                    }

                    if (chapter.list && chapter.list.length > 0) {
                        pdf.setFontSize(12);
                        pdf.text("List:", 20, yOffset);
                        yOffset += 10;
                        chapter.list.forEach((item, i) => {
                            pdf.text(`• ${item}`, 25, yOffset);
                            yOffset += 7;
                        });
                        yOffset += 10;
                    }

                    if (chapter.example) {
                        pdf.setFontSize(12);
                        pdf.text("Example:", 20, yOffset);
                        yOffset += 10;
                        const exampleLines = pdf.splitTextToSize(chapter.example, 170);
                        pdf.text(exampleLines, 25, yOffset);
                        yOffset += exampleLines.length * 7 + 10;
                    }

                    if (chapter.answer) {
                        pdf.setFontSize(12);
                        pdf.text("Answer:", 20, yOffset);
                        yOffset += 10;
                        const answerLines = pdf.splitTextToSize(chapter.answer, 170);
                        pdf.text(answerLines, 25, yOffset);
                    }
                });
            } else {
                console.error('Invalid chapters data:', module.chapters);
                pdf.text('No chapters available', 20, yOffset);
            }

            // Save the PDF
            pdf.save(`module_${module.topic}.pdf`);

            toast.success('PDF downloaded successfully');
        } catch (error) {
            console.error('Error downloading module:', error);
            toast.error(`Error downloading module: ${error.message}`);
        }
    };

    if (isLoading) return <Loading />;
    if (isError) return <div>Error fetching modules</div>;

    return (
        <div className="container mx-auto px-4">
            <Helmet>
                <title>My Modules</title>
            </Helmet>
            <h2 className="text-4xl font-bold my-10 text-center mb-10">My Modules</h2>
            {modules.length === 0 ? (
                <p className="text-2xl text-center p-10">No modules created yet.</p>
            ) : (
                <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-5">
                    {modules.map(module => (
                        <div key={module._id} className="border p-4 rounded-lg shadow-lg text-wrap relative h-full pb-16">
                            <h3 className="text-3xl font-semibold mb-5">{module.topic}</h3>
                            <p><strong>Tone: </strong>{module.tone} </p>
                            <p><strong>Total Chapters: </strong> {module.pages} </p>
                            <p><strong>Description: </strong> {module.description}</p>
                            <div className="absolute bottom-4 right-4">
                                <div className="tooltip" data-tip="Download">
                                    <button
                                        onClick={() => downloadModule(module._id)}
                                        className="btn btn-outline btn-primary"
                                    >
                                        <FaFileDownload className="text-3xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyModule;
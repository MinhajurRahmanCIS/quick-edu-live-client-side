import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Presentation = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const presentationData = {
            ...data,
            email: user.email
        };

        try {
            const response = await fetch(`https://quick-edu-live-server-side.onrender.com/presentation/${user.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(presentationData),
            });

            if (response.ok) {
                setLoading(false);
                toast.success('Presentation created successfully!');
                navigate('/myhome/mypresentation')
            } else {
                toast.error('Failed to create presentation');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="hero min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg border px-20 py-10 mb-4">
                <h1 className="text-3xl font-bold mb-2">Ai Presentation Generate</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="topic">
                        Topic
                    </label>
                    <input
                        {...register("topic", { required: true })}
                        className="input input-bordered w-full"
                        id="topic"
                        type="text"
                        placeholder="Enter topic"
                    />
                    {errors.topic && <span className="text-red-500 text-xs italic">This field is required</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="tone">
                        Writing Tone
                    </label>
                    <select
                        {...register("tone", { required: true })}
                        className="select select-bordered w-full"
                        id="tone"
                    >
                        <option value="">Select tone</option>
                        <option value="formal">Formal</option>
                        <option value="creative">Creative</option>
                        <option value="casual">Casual</option>
                        <option value="professional">Professional</option>
                    </select>
                    {errors.tone && <span className="text-red-500 text-xs italic">This field is required</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="pages">
                        Number of Pages
                    </label>
                    <input
                        {...register("pages", { required: true, min: 4 })}
                        className="input input-bordered w-full"
                        id="pages"
                        type="number"
                        min="4"
                        placeholder="Enter number of pages"
                    />
                    {errors.pages && <span className="text-red-500 text-xs italic">Minimum 4 pages required</span>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                        Brief Description
                    </label>
                    <textarea
                        {...register("description", { required: true })}
                        className="textarea textarea-bordered w-full"
                        id="description"
                        placeholder="Enter brief description"
                    ></textarea>
                    {errors.description && <span className="text-red-500 text-xs italic">This field is required</span>}
                </div>
                <div className="flex items-center justify-center">
                    {
                        !loading ?
                            <button className="btn btn-neutral" type="submit">Generate Presentation</button>
                            :
                            <div className="flex justify-center items-center">
                                <span className="loading loading-bars loading-md"></span>
                            </div>
                    }
                </div>
            </form>
        </div>
    );
};

export default Presentation;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SiGooglebard } from 'react-icons/si';

const AssignmentModal = ({ modal, setModal, refetch }) => {
    const [resultLoading, setResultLoading] = useState(false);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const currentUTC = new Date();
    currentUTC.setHours(currentUTC.getHours() + 6);
    const currentDate = currentUTC.toISOString().slice(0, 10); // For date input

    // State for date and time
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handelGenerateAssignmentQuestion = (data, e) => {
        setResultLoading(true);
        // console.log(data)
        data.classId = modal._id;
        fetch("https://quick-edu-live-server-side.onrender.com/classwork", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
            },
            body: JSON.stringify(data)
        })
            .then(async res => {
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response from server");
                }
                return res.json();
            })
            .then(data => {
                if (data?.success && data?.data?.insertedId) {
                    toast.success("Assignment Generated!");
                    setResultLoading(false);
                    e.target.reset();
                    setModal(null);
                    refetch();
                } else {
                    throw new Error(data?.message || "Failed to generate assignment");
                }
            })
            .catch(error => {
                console.error(error);
                toast.error(error.message || "Please Try again! Something went wrong...");
                // e.target.reset(); // Don't reset form on error so user can retry
                setResultLoading(false);
                // setModal(null); // Keep modal open so user can retry
            });
    };
    return (
        <div>
            {
                resultLoading ?
                    <div>
                        {/* The button to open modal */}
                        <input type="checkbox" id="assignment-modal" className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box ">
                                <label htmlFor="assignment-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl font-bold">X</label>
                                <div className="flex flex-col justify-center items-center sm:text-sm md:text-xl p-7">
                                    <span>Generating Your Assignment</span>
                                    <span>Please Wait</span>
                                    <br />
                                    <span className="loading loading-ball loading-xs "></span>
                                    <span className="loading loading-ball loading-sm text-info"></span>
                                    <span className="loading loading-ball loading-md "></span>
                                    <span className="loading loading-ball loading-lg text-info"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        {/* The button to open modal */}
                        <input type="checkbox" id="assignment-modal" className="modal-toggle" />
                        <div className="modal" role="dialog">
                            <div className="modal-box ">
                                <label htmlFor="assignment-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl font-bold border border-black">X</label>
                                <form onSubmit={handleSubmit(handelGenerateAssignmentQuestion)} className="card-body">
                                    <div className="flex items-center gap-1 text-2xl">
                                        <h1 className="font-semibold">Generate Assignment with Gemini </h1>
                                        <SiGooglebard className="text-sky-600"></SiGooglebard>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Quiz Subject</span>
                                        </label>
                                        <input {...register("subject")} type="text" placeholder="Example: Math101" className="input input-bordered" defaultValue={modal.subject} />
                                        <div className="label">
                                            {errors.subject && <p className="text-red-600">{errors.subject.message}</p>}
                                        </div>
                                    </div>
                                    {/* <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Example</span>
                                        </label>
                                        <textarea {...register("example",
                                            {
                                                required: { value: true, message: "Example is Required" }
                                            })} placeholder="Give an example of assignment" className="textarea textarea-bordered textarea-lg w-full" ></textarea>
                                    </div> */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Assignment No</span>
                                        </label>
                                        <input {...register("assignmentNo",
                                            {
                                                required: { value: true, message: "Assignment No is Required" }
                                            })} type="number" placeholder="Example: 1/2" className="input input-bordered" min={1} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Assignment Date</span>
                                        </label>
                                        <div className="flex gap-1">
                                            <input {...register("date",
                                                {
                                                    required: { value: true, message: "Assignment No is Required" }
                                                })}
                                                type="date"
                                                className="input input-bordered w-full"
                                                value={selectedDate}
                                                min={currentDate}
                                                onChange={handleDateChange}
                                            />
                                            <input
                                                {...register("time",
                                                    {
                                                        required: { value: true, message: "Time is Required" }
                                                    })}
                                                type="time"
                                                className="input input-bordered w-full"
                                            />
                                        </div>

                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">How Many Question</span>
                                        </label>
                                        <input {...register("totalQuestions",
                                            {
                                                required: { value: true, message: "Class Name is Required" }
                                            })} type="number" placeholder="Example: 1/2" className="input input-bordered" min={1} />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Assignment Level</span>
                                        </label>
                                        <div className='flex items-center'>
                                            <input {...register("level",
                                                {
                                                    required: { value: true, message: "Class Name is Required" }
                                                })} type="radio" name="level" value={"Easy"} className="radio radio-info" />
                                            <span className='mx-3'>Easy</span>
                                            <input {...register("level",
                                                {
                                                    required: { value: true, message: "Class Name is Required" }
                                                })} type="radio" name="level" value={"Medium"} className="radio radio-warning" />
                                            <span className='mx-3'>Medium</span>
                                            <input {...register("level",
                                                {
                                                    required: { value: true, message: "Class Name is Required" }
                                                })} type="radio" name="level" value={"Hard"} className="radio radio-error" />
                                            <span className='mx-3'>Hard</span>
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Assignment Topic</span>
                                        </label>
                                        <textarea {...register("topic",
                                            {
                                                required: { value: true, message: "Class Name is Required" }
                                            })} placeholder="Assignment Topic" className="textarea textarea-bordered textarea-lg w-full" ></textarea>
                                    </div>

                                    <input className="btn btn-neutral mt-3 text-2xl" type="submit" value="Generate Assignment" />
                                </form>
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
};

export default AssignmentModal;
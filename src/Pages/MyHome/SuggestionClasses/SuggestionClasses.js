import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import toast from 'react-hot-toast';
import useEnrollClasses from '../../../hooks/useEnrollClasses';
import { MdOutlineBookmarkAdd } from 'react-icons/md';
import Swal from 'sweetalert2';

const SuggestionClasses = ({ suggest, suggestionsRefetch }) => {
    const { user } = useContext(AuthContext);
    const { name, subject, section, photoURL, classCode } = suggest;
    const { refetch } = useEnrollClasses(user);
    const handelEnrollCourse = (classCode) => {
        const data = {
            studentEmail: user?.email,
            classCode: classCode
        }
        Swal.fire({
            title: "Are you sure to Enroll?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#5F9EA0",
            cancelButtonColor: "#FF5733",
            confirmButtonText: "Enroll!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("https://quick-edu-live-server-side.onrender.com/enrollments", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json()
                        .then(data => {
                            if (data?.data?.insertedId) {
                                Swal.fire({
                                    title: "Class Enrolled Successfully",
                                    icon: "success"
                                });
                                suggestionsRefetch();
                                refetch();
                            }
                            if (data?.alreadyEnrolledMessage || data?.noClassMessage) {
                                Swal.fire({
                                    title: `${data?.alreadyEnrolledMessage || data?.noClassMessage}`,
                                    icon: "error"
                                });
                            }
                        })
                    )

            }
        });

    };

    return (
        <div className="card bg-base-100 shadow-xl my-5">
            <figure>
                <img loading="lazy"
                    src={photoURL}
                    alt={name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p></p>
                <div className="card-actions justify-end">
                    <button onClick={() => handelEnrollCourse(classCode)} className="btn btn-outline"><MdOutlineBookmarkAdd className="text-3xl" ></MdOutlineBookmarkAdd></button>
                </div>
            </div>
        </div>
    );
};

export default SuggestionClasses;
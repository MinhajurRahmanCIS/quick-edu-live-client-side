import React, { useContext, useState } from 'react';
import Classes from '../Classes/Classes';
import ClassModal from '../ClassModal/ClassModal';
import { AuthContext } from '../../../contexts/AuthProvider';
import useClasses from '../../../hooks/useClasses';
import useTeacher from '../../../hooks/useTeacher';
import Loading from '../../Shared/Loading/Loading';
import useLoadUser from '../../../hooks/useLoadUser';
import Enroll from '../ClassEnroll/Enroll/Enroll';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SuggestionClasses from '../SuggestionClasses/SuggestionClasses';

const MyHome = () => {
    const { user } = useContext(AuthContext);
    const { userInfo, userIsLoading } = useLoadUser(user);
    const [isTeacher, isTeacherLoading] = useTeacher(user?.email);
    const { classes, classLoading, refetch } = useClasses(user);
    const [modal, setModal] = useState(null);

    const { data: suggestions = [], suggestionsIsLoading, refetch: suggestionsRefetch } = useQuery({
        queryKey: ["Suggestion"],
        queryFn: async () => {
            const res = await fetch(`https://quick-edu-live-server-side.onrender.com/suggestedClasses/${user?.email}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            });
            const data = await res.json();
            return data?.data;
        }
    });

    if (userIsLoading || isTeacherLoading || suggestionsIsLoading) {
        return <Loading></Loading>;
    };
    return (
        <div>
            <Helmet>
                <title>
                    {isTeacher ?
                        "Teacher's Home"
                        :
                        "Students's Home"}
                </title>
            </Helmet>
            {
                isTeacher ?
                    <>
                        <Classes
                            classes={classes.data}
                            classLoading={classLoading}
                            setModal={setModal}
                            refetch={refetch}
                        >
                        </Classes>
                        {
                            modal &&
                            <ClassModal
                                refetch={refetch}
                                modal={modal}
                                setModal={setModal}
                            >
                            </ClassModal>
                        }
                    </>
                    :
                    <>
                        {
                            userInfo.data?.role &&
                            <Enroll>

                            </Enroll>
                        }

                    </>
            }

            <div className="flex justify-center items-center">
                {
                    !userInfo.data?.role && <Link className="btn btn-neutral" to="profile">Please Select Role First</Link>
                }

            </div>

            {
            suggestions.length > 0 &&
                !isTeacher &&
                <div className="p-20">
                    <h1 className="text-4xl font-semibold">Class Suggestion</h1>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-5">
                        {
                            suggestions?.map(suggest =>
                                <SuggestionClasses
                                    key={suggest._id}
                                    suggest={suggest}
                                    suggestionsRefetch={suggestionsRefetch}
                                >
                                </SuggestionClasses>
                            )
                        }
                    </div>
                </div>
            }

        </div>
    );
};

export default MyHome;
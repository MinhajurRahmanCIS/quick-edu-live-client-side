import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading/Loading';
import MyModuleCard from './MyModuleCard';

const MyModule = () => {
    const { user } = useContext(AuthContext);

    const { data: courseModules, isLoading: courseModulesLoading, error, refetch } = useQuery({
        queryKey: ['courseModules', user.email],
        queryFn: async () => {
            const response = await fetch(`https://quick-edu-live-server-side.onrender.com/module/${user.email}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });

    if (courseModulesLoading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 my-10">
            <h2 className="text-4xl font-bold mb-10 text-center">My Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {
                    courseModules?.length > 0
                        ?
                        courseModules?.map(courseModule =>
                            <MyModuleCard
                                key={courseModule._id}
                                courseModule={courseModule}
                                email={user.email}
                                refetch={refetch}
                            />)
                        :
                        <p className="text-2xl">No Course found.</p>
                }
            </div>
        </div>
    );
};

export default MyModule;
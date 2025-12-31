import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import Loading from '../../Shared/Loading/Loading';
import Paper from './Paper';
import { AuthContext } from '../../../contexts/AuthProvider';
import useLoadUser from '../../../hooks/useLoadUser';

const AllPaper = () => {
    const { user }                                      = useContext(AuthContext);

    const { data: allPaper = [], isLoading, refetch }   = useQuery({
        queryKey: ["Individual Paper"],
        queryFn: async () => {
            const res = await fetch(`https://quick-edu-live-server-side.onrender.com/check/${user?.email}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            });
            const data = await res.json();
            return data || [];
        }
    });

    if (isLoading || userIsLoading) {
        return <Loading></Loading>
    };
    // console.log(allPaper);
    return (
        <div className="card-body grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-1 gap-3 gap-y-10">
            {
                
                allPaper &&
                allPaper.data?.map((ap, i) => 
                    <Paper 
                    key={ap._id}
                    i={i}
                    ap={ap}
                    refetch={refetch}
                    >
                    </Paper>)
            }
        </div>
    );
};

export default AllPaper;
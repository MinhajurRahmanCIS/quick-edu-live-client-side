import { useQuery } from '@tanstack/react-query';

const useLoadSubmission = id => {
    const { data: viewSubmissions = [], isLoading: viewSubmissionsLoading } = useQuery({
        queryKey: ["viewSubmissions", id],
        queryFn: async () => {
            const res = await fetch(`https://quick-edu-live-server-side.onrender.com/viewSubmission/${id}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            });
            const data = await res.json();
            return data;
        }
    });
    return { viewSubmissions, viewSubmissionsLoading};
};

export default useLoadSubmission;
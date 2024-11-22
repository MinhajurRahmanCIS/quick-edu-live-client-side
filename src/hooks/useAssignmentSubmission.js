import { useQuery } from '@tanstack/react-query';

const useAssignmentSubmission = id => {
    const { data: viewAssignmentSubmissions = [], isLoading: viewAssignmentSubmissionsLoading } = useQuery({
        queryKey: ["viewSubmissions", id],
        queryFn: async () => {
            const res = await fetch(`https://quick-edu-live-server-side.onrender.com/viewAssignmentSubmission/${id}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            });
            const data = await res.json();
            return data;
        }
    });
    return { viewAssignmentSubmissions, viewAssignmentSubmissionsLoading };
};

export default useAssignmentSubmission;
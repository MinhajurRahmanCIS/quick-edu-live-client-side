import { useQuery } from '@tanstack/react-query';

const useLoadUser = user => {
    const { data: userInfo = [], isLoading, refetch } = useQuery({
        queryKey: ["User"],
        queryFn: async () => {
            const res = await fetch(`https://quick-edu-live-server-side.vercel.app/users/${user?.email}`, {
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            });
            const data = await res.json();
            return data;
        }
    });
    return { userInfo, userIsLoading: isLoading, refetch };
};

export default useLoadUser;
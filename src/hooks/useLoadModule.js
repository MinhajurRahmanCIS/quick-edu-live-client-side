import { useQuery } from '@tanstack/react-query';

const useLoadModule = (id, email) => {
    const { data: courseModule, isLoading: courseModuleLoading, refetch } = useQuery({
        queryKey: ['courseModule', id],
        queryFn: async () => {
            const response = await fetch(`http://localhost:5000/specificModule/${id}/${email}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }
    });
    return { courseModule, courseModuleLoading, refetch };
};

export default useLoadModule;
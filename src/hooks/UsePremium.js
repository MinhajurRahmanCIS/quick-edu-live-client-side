import { useEffect, useState } from "react"

const usePremium = email => {
    const [isPremium, setIsPremium] = useState(false);
    const [isPremiumLoading, setIsPremiumLoading] = useState(true);
    useEffect(() => {
        if (email) {
            fetch(`https://quick-edu-live-server-side.vercel.app/users/premium/${email}`,{
                headers: {
                    authorization: `bearer ${localStorage.getItem("quickEdu-token")}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    // console.log("Premium", data.data);
                    setIsPremium(data.data.isPremium);
                    setIsPremiumLoading(false);
                })
        }
    }, [email])
    return [isPremium, isPremiumLoading];
}

export default usePremium;
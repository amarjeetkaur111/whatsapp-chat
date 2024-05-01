import { useEffect, useState } from "react"
import { baseUrl, getRequest } from "../utility/services";


export const useFetchRecipient = (chat, user) => {
    const [recipientUser, setRecipientUser ] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== user._id);

    useEffect(()=>{
        const getReciever = async() => {
            if(!recipientId) return null;
            const user = await getRequest(`${baseUrl}/users/getUser/${recipientId}`);
            if(user?.error) setError(user.error);
            setRecipientUser(user);
        };
        getReciever();
    },[recipientId]);

    return {recipientUser,error};
}
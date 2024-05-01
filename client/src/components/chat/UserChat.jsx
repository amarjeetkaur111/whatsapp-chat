import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatar from '../../assets/avatar.svg';
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({chat, user}) => {
    const {recipientUser,error} = useFetchRecipient(chat, user);
    const {onlineUsers} = useContext(ChatContext);

    return (
        <Stack direction="horizontal" gap='3' className="user-card align-items-center p-2 justify-content-between" role='button'>
            <div className="d-flex flex-row">
                <div className="me-2">
                    <img src={avatar} height='35px'/>
                </div>
                <div className="text-content">  
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">Text Message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">12/12/2022</div>       
                <div className="this-user-notifications">2</div>       
                <div className={onlineUsers?.find((u) => u.id === recipientUser?._id) ? "user-online" : ''}></div>       
            </div>

        </Stack>
    )
    // return (<p>{recipientUser?.name}</p>)
}

export default UserChat;
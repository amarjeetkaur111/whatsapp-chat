import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";


const PotentialChat = () => {
    const {user} = useContext(AuthContext);
    const {potentialChat, createChat, onlineUsers} = useContext(ChatContext);

    return (
        <div className="all-users">
            {potentialChat && 
                potentialChat.map((u, index) => {
                    return(
                    <div className="single-user" key={index} onClick={()=> createChat(user._id,u._id)}>
                        {u.name}
                        <span className={onlineUsers?.some((ur) => ur.id === u._id) ? "user-online" : ''}></span>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default PotentialChat;
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from 'moment';
import InputEmoji from 'react-input-emoji';

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat , messages, isMessageLoading, messageError,createMsg } = useContext(ChatContext);
    const { recipientUser,error } = useFetchRecipient(currentChat, user);
    const [textMsg, setTextMsg ] = useState('');
    const scroll = useRef();

    console.log('Msg',textMsg);
    //scroll to new messages
    useEffect(() => {
        scroll.current?.scrollIntoView({behavior:'smooth'});
    },[messages]);

    if(!recipientUser)
        return (
            <p style={{textAlign:"center", width:'100%'}}>
                No Conversation selected yet ... 
            </p>
    );

    if(isMessageLoading)
        return (
            <p style={{textAlign:"center", width:'100%'}}>
                Loading Messages ..  
            </p>
    )

    const handleSubmit = (chatId, userId, textMsg) => {
        createMsg(chatId, userId, textMsg);
        setTextMsg('');
    }

    return (
       <Stack className="chat-box" gap='4'>
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack className="messages" gap='3'>
                {messages && messages.map((msg,index) => {
                    return (<Stack key={index} 
                            className={`${msg?.senderId === user?._id ?"message self align-self-end flex-grow-0":"message align-self-start flex-grow-0"}` }
                            ref = {scroll}
                            >
                        <span>{msg.text}</span> 
                        <span className="message-footer">{moment(msg.createdAt).calendar()}</span>
                    </Stack>)
                })}   
            </Stack>
            <Stack direction="horizontal" gap='3' className="chat-input flex-grow-0">
                <InputEmoji 
                value={textMsg} 
                onChange={setTextMsg} 
                fontFamily='nunito' 
                borderColor="rgba(72,112,223,0)"
                onEnter={() => handleSubmit(currentChat._id, user._id, textMsg)}
                ></InputEmoji>
                <button className="send-btn" onClick={() => handleSubmit(currentChat._id, user._id, textMsg)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                </button>
            </Stack>
       </Stack>
    );
}

export default ChatBox;
import { createContext, useState, useEffect, useCallback  } from 'react';
import { baseUrl, getRequest, postRequest } from '../utility/services';
import { io } from 'socket.io-client';

export const ChatContext = createContext({});

export const ChatContextProvider = ({children,user}) => {
    const [userChat, setUserChats] = useState(null);
    const [isUserChatLoading, setIsUserChatLoading ] = useState(false);
    const [userChatErrors, setUserChatErrors ] = useState(null);
    const [potentialChat, setPotentialChat ] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessageLoading, setIsMessageLoading ] = useState(false);
    const [messageError, setMessageError ] = useState(null);
    const [newMessage, setNewMessage ] = useState(null);
    const [socket, setSocket ] = useState(null);
    const [onlineUsers, setOnlineUsers ] = useState(null);

    console.log('OnlineUsers',onlineUsers);

    useEffect(() => {
        const newSocket= io('http://localhost:3000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    },[user]);
 
    useEffect(() => {
        if(socket === null) return;
        socket.emit('addNewUser',{userId:user?._id,userName:user?.username});
        socket.on('getOnlineUsers',(res) => {
            setOnlineUsers(res);
        });
        return () => {
            socket.off('getOnlineUsers');
        }
    },[socket]);

    //send message 
    useEffect(() => {
        if(socket === null) return;
        let receiverId = currentChat?.members?.find((id) => id !== user?._id);
        socket.emit('sendMessage',{...newMessage,receiverId})
    },[newMessage]);

    //recive message
    useEffect(() => {
        if(socket === null ) return;
        
        socket.on('getMessage',(res) => {
            if(currentChat?._id !== res.chatId) return;
            setMessages((prev) => [...prev, res]);
    })
    },[socket, currentChat]);


    useEffect(() => {
        const getUserChats = async() => {
            setIsUserChatLoading(true);
            setUserChatErrors(null);
            if(user?._id)
            {
                const response =  await getRequest(`${baseUrl}/chat/${user?._id}`);
                setIsUserChatLoading(false);
                if(response.error) setUserChatErrors(response.error);
                setUserChats(response);
            }
        };
        getUserChats();
    },[user]);

    useEffect(() => {
        const getNonConnectedUsers = async() => {
            const response = await getRequest(`${baseUrl}/users`);
            if(response.error) return console.log('Error Fetching Users',response);

            const pChats = response.filter((u) => {
                let isChatCreated = false;
                if(user?._id === u._id) return false; 
                if(userChat)
                {
                    isChatCreated = userChat?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    })
                }
                return !isChatCreated;
            });

            setPotentialChat(pChats);   
        };
        getNonConnectedUsers();
    },[userChat])    

    const createChat = useCallback(async(firstId, secondId) => {
        const response =  await postRequest(`${baseUrl}/chat/`,JSON.stringify({firstId,secondId}));
        if(response.error) return console.log('Error creating Chat');
        setUserChats((prev) => [...prev,response]);
    },[]);


    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    },[]);

    useEffect(() => {
        const getMessages = async() => {
            setIsMessageLoading(true);
            setMessageError(null);
            const response =  await getRequest(`${baseUrl}/messages/find/${currentChat?._id}`);
            setIsMessageLoading(false);
            if(response.error) setMessageError(response.error);
            setMessages(response);
        };
        getMessages();
    },[currentChat]);

    const createMsg = useCallback(async(chatId, senderId, text) => {
        if(!text) return console.log('You need to type something to send msg');
        const response =  await postRequest(`${baseUrl}/messages/`,JSON.stringify({chatId:chatId,senderId: senderId,text: text}));
        if(response.error) return console.log('Error sending message');
        setNewMessage(response);
        setMessages((prev) => [...prev,response]);
    },[]);

    let chatData = {userChat, isUserChatLoading, userChatErrors, potentialChat, createChat, currentChat,  updateCurrentChat, messages, isMessageLoading, messageError,createMsg, onlineUsers};

    return <ChatContext.Provider value={chatData}>{children}</ChatContext.Provider>
}

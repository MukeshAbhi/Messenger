import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { formatMessageTime } from "../utils";
import { userAtom } from "../store/userAtom";
import { messageAtom } from "../store/messageAtom";
import type { Message } from "../types";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessage,
    isMessagesLoading,
    subscribeToNewMessages,
    unsubscribeToMessages,
  } = messageAtom();

  const messageList = useAtomValue(messages);
  const selected = useAtomValue(selectedUser);
  const getMessages = useSetAtom(getMessage);
  const loading = useAtomValue(isMessagesLoading);
  const authUser = useAtomValue(userAtom);
  const subscribeToMessages = useSetAtom(subscribeToNewMessages)

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selected?._id) {
      getMessages(selected._id);
      subscribeToMessages();

      return () => unsubscribeToMessages();
    
    }
  }, [selected?._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a user to start chatting
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {!Array.isArray(messageList) || messageList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-zinc-500">Start the conversation</p>
          </div>
        ) : (
          messageList
            .filter((message): message is Message => !!message && !!message._id)
            .map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser!._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser!._id
                      ? authUser?.profileUrl || "/avatar.png"
                      : selected.profileUrl || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(new Date(message.createdAt))}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        )))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

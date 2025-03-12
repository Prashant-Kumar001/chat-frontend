import { IoSend } from "react-icons/io5";

const MessageInput = ({ message, setMessage, handleMessageSend }) => {
    return (
        <div className="flex items-center bg-gray-100 text-black rounded-full p-2 shadow-md w-full">
            <form className="flex-1" onSubmit={handleMessageSend}>
                <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-200 rounded-full outline-none"
                    value={message}
                    onChange={setMessage}
                    placeholder="Type a message..."
                />
            </form>
            {message.trim() && (
                <button
                    type="submit"
                    className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition duration-300"
                    onClick={handleMessageSend}
                >
                    <IoSend size={20} color="white" />
                </button>
            )}
        </div>
    );
};

export default MessageInput;
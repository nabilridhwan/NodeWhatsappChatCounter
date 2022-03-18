// Functions for importing or saving messages
import MessageIO from "./MessageIO";


// Main Message Parser
import MessageParser from "./MessageParser";

// Message Utility classes
// The message query type are constants that are used to filter messages, either by messages or by authors
import MessageUtils, {MessageQueryType} from "./MessageUtils";

// Filename of the file to be parsed
const FILENAME = "./chats/_chat.txt";

// ===================== START OF PROGRAM =======================
// New Instance
const msgParser = new MessageParser(FILENAME);

// Important! Run the parseMessages first because it will parse the messages into an array of messages: Array<Message>
msgParser.parseMessages()
.then(messages => {
    const match = MessageUtils.getMessagesByQuery("hello", MessageQueryType.MESSAGE, messages);

    // Write messages to file
    MessageIO.writeMessagesToFileAsJSON("cooloutput.json", match)
})
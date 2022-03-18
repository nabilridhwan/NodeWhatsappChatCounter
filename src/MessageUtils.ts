import Message from "./Message";

export default class MessageUtils {
    public static getMessagesByQuery(content: string, queryType: MessageQueryType, messages: Array<Message>): Array<Message> {

        if (queryType == MessageQueryType.AUTHOR) {
            return messages.filter(message => message.getAuthor().toLowerCase().includes(content.toLowerCase()));
        } else {
            return messages.filter(message => message.getContent().toLowerCase().includes(content.toLowerCase()));
        }
    }

    public static getAuthors(messages: Array<Message>): Array<string> {
        const authors = messages.map(message => message.getAuthor());
        return Array.from(new Set(authors));
    }

    public static getContents(messages: Array<Message>): Array<string> {
        const contents = messages.map(message => message.getContent());
        return Array.from(new Set(contents));
    }
}

export enum MessageQueryType{
    AUTHOR = "author",
    MESSAGE = "message"
}
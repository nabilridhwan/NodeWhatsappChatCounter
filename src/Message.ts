export default class Message{
    date: Date;
    author: string;
    content: string;

    /** 
    * @param date: Date
    * @param author: string
    * @param content: string
    */
    constructor(date: Date, author: string, content: string){
        this.date = date;
        this.author = author;
        this.content = content;
    }

    /**
     * 
     * @param author - New author for the message
     * 
     */

    setAuthor(author: string): void {
        this.author = author;
    }

    getDate(): Date {
        return this.date;
    }

    getAuthor(): string {
        return this.author;
    }

    getContent(): string {
        return this.content;
    }
}
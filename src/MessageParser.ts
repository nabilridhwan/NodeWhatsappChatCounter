import { MessageQueryType } from "./MessageUtils"
import Message from "./Message";
import MessageIO from "./MessageIO";
import { PathLike } from "fs";


export default class MessageParser {
    pathname: PathLike;
    messages: Array<Message> = [];

    constructor(pathname: PathLike) {
        this.pathname = pathname;
    }

    // Setup the messages by making multi-line messages into one line
    private setupMessages(splittedLines: Array<string>): Array<string> {
        let lines = splittedLines;
        // This returns the last line index that has the date and author at the front
        let lastLineIndex;

        // This is the counter for the number of lines that does not have the date and author at the front 
        let count = 0;

        for (let i = 1; i < lines.length; i++) {

            // This represent the current line
            let line = lines[i];

            // Replace every RTL character and carriage return with a space and trim it
            line = line.replace(/\u200e/g, "").replace("\r", "").trim();

            // Check if the line does not start with [
            if (!line.startsWith("[")) {
                // Increase the count
                count++;

                // The non null last line is current read line minus the count
                lastLineIndex = i - count;
                lines[lastLineIndex] += ` ${line}`;

                lines[i] = "";
            } else {

                // If the line starts with [ (meaning it has the date and author at the front)
                // Set the count to 0 and lastnonnullline to null
                count = 0;
                lastLineIndex = undefined;
            }

        }

        lines = lines.filter(line => line != "");
        return lines;
    }

    async parseMessages(): Promise<Array<Message>> {
        let splittedLines = await MessageIO.readMessagesFromFile(this.pathname);
        let lines = this.setupMessages(splittedLines);
        let finalMessages: Array<Message> = [];

        // Parsing start
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            line = line.replace(/\u200e/g, "").replace("\r", "").trim();
            let m = line.matchAll(/\[(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) ([APM]+)\] ([^:]+): (.+)/g)

            for (const match of m) {
                let [_, day, month, year, hour, mins, sec, ampm, author, message] = match;

                // Parse the ints
                let dayInt = parseInt(day);
                let monthInt = parseInt(month);
                let yearInt = parseInt(year) + 2000;
                let hourInt = parseInt(hour);
                let minsInt = parseInt(mins);
                let secInt = parseInt(sec);

                // If it is afternoon, add 12 hours to the hour (to convert to 24 hour time)
                if (ampm == "pm") {
                    hour += 12;
                }

                // Remove empty messages and author that is "you" (used for groupchats)
                if (author.toLowerCase() != "you" && message != "" && !message.match(/^\w+ omitted/gm)) {
                    const date = new Date(yearInt, monthInt - 1, dayInt, hourInt, minsInt, secInt);
                    const nm = new Message(date, author, message);
                    finalMessages.push(nm);
                }
            }
        }

        this.messages = finalMessages;
        return this.messages;
    }


}
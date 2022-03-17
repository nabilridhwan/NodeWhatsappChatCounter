const fs = require("fs");

class MessageParser {

    constructor(pathname, groupchat = false) {
        this.pathname = pathname;
        this.groupchat = groupchat;
        this.messages = [];
    }

    getAuthors() {
        let authors = [];
        authors = this.messages.map(message => message.author)
        return [...new Set(authors)];
    }

    async parse() {
        const contents = fs.readFileSync(this.pathname, "utf8");
        let lines = contents.split("\n");

        let messages = [];
        let i = 0;

        // This returns the last line that has the date and author at the front
        let lastNonNullLine = null;

        // This is the counter for the number of lines that does not have the date and author at the front 
        let count = 0;

        if (this.groupchat) i = 1;

        for (; i < lines.length; i++) {

            let line = lines[i];

            // Replace every RTL character and carriage return with a space and trim it
            line = line.replace(/\u200e/g, "").replace("\r", "").trim();

            // Check if the line does not start with [
            if (!line.startsWith("[")) {
                // Increase the count
                count++;

                // The non null last line is current read line minus the count
                lastNonNullLine = lines[i - count];

                // Append the date and author to the beginning of the line
                let dateAndAuthor = lastNonNullLine.match(/\[\d+\/\d+\/\d+, \d+:\d+:\d+ [APM]+\] [^:]+/g)[0]
                lines[i] = `${dateAndAuthor}: ${line}`;
            } else {

                // If the line starts with [ (meaning it has the date and author at the front)
                // Set the count to 0 and lastnonnullline to null
                count = 0;
                lastNonNullLine = null;
            }
        }

        // Parsing start
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            line = line.replace(/\u200e/g, "").replace("\r", "").trim();
            let m = line.matchAll(/\[(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+) ([APM]+)\] ([^:]+): (.+)/g)

            for (const match of m) {
                let [_, day, month, year, hour, mins, sec, ampm, author, message] = match;

                // Parse the ints
                day = parseInt(day);
                month = parseInt(month);
                year = parseInt(year) + 2000;
                hour = parseInt(hour);
                mins = parseInt(mins);
                sec = parseInt(sec);

                // If it is afternoon, add 12 hours to the hour (to convert to 24 hour time)
                if (ampm == "pm") {
                    hour += 12;
                }

                // Remove empty messages and author that is "you" (used for groupchats)
                if (author.toLowerCase() != "you" && message != "" && !message.match(/^\w+ omitted/gm)) {
                    messages.push({
                        date: new Date(year, month - 1, day, hour, mins, sec),
                        author: author,
                        message: message
                    })
                }
            }
        }

        this.messages = messages;
    }

    async writeToFile() {
        return fs.writeFileSync(this.pathname.replace("txt", "json"), JSON.stringify(this.messages));
    }

    getMessagesMatch(key, query) {
        if (key == "message" || key == "author") {
            return this.messages.filter(message => {
                return message[key].toLowerCase().includes(query.toLowerCase())
            });
        } else {
            throw new Error("Key must be either message or author");
        }

    }
}

module.exports = MessageParser;
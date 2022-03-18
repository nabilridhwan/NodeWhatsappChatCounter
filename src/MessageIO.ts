import { PathLike } from "fs";
import fs from "fs/promises";
import Message from "./Message";
export default class MessageIO {

    // Reads the content of the file and splits it an array of strings
    public static async readMessagesFromFile(fileName: PathLike, encoding?: BufferEncoding): Promise<Array<string>> {
        encoding = encoding ? encoding : "utf8";

        const contents = await fs.readFile(fileName, { encoding: encoding });
        return contents.split("\n");
    }

    // Writes the messages to a file
    public static async writeMessagesToFileAsJSON(fileName: PathLike, messages: Array<Message>, outputFolderName?: string, encoding?: BufferEncoding): Promise<void> {
        encoding = encoding ? encoding : "utf8";
        fileName = outputFolderName ? `./${outputFolderName}/${fileName.toString().replace(".txt", ".json")}` : `./${fileName.toString().replace(".txt", ".json")}`;
        await fs.writeFile(fileName, JSON.stringify(messages));

    }
}
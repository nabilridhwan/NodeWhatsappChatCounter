const inquirer = require('inquirer');
const MessageParser = require("./MessageParser");

inquirer.registerPrompt('filePath', require('inquirer-file-path'));
inquirer.prompt(
    [{
            type: "filePath",
            message: "Directory of chat txt file",
            basePath: "./",
            name: "path",
        },

        {
            type: "list",
            name: "key",
            message: "Which do you want to search for?",
            choices: ["author", "message"],
        },
        {
            type: "input",
            message: "What do you want to search for?",
            name: "query",
        },
        {
            type: "confirm",
            default: true,
            message: "Do you want to save the raw parsed data as a JSON file?",
            name: "save",
        }
    ]
).then(async answers => {
    await program(answers.path, answers.key, answers.query, answers.save);
    console.log("Program exited successfully");
})

async function program(fileName, key, query, save) {
    const mp = new MessageParser(fileName);
    const messages = await mp.parse();
    const authors = mp.getAuthors(messages)
    let stats = {};
    authors.forEach(author => {
        stats[author] = 0;
    })
    const m = mp.getMessagesMatch(key, query);
    m.forEach(message => {
        stats[message.author]++;
    })
    console.log("The amount of messages that match the query is: " + m.length);
    console.table(stats)
    if (save) {
        await mp.writeToFile();
        console.log("Saved")
    }
}
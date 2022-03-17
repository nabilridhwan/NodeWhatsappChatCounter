const inquirer = require('inquirer');
const MessageParser = require("./MessageParser");

const groupChat = false;

inquirer.registerPrompt('filePath', require('inquirer-file-path'));
inquirer.prompt(
    [
        {
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
        }
    ]
).then(answers => {
    program(answers.path, answers.key, answers.query);
})

async function program(fileName, key, query) {
    const mp = new MessageParser(fileName, groupChat);
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
    console.table(stats)
}
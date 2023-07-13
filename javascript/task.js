const fs = require("fs");
const args = process.argv.slice(2);

function createFile() {
    if (!fs.existsSync("task.txt")) {
        fs.writeFileSync("task.txt", "", 'utf8');
    }
    if (!fs.existsSync("completed.txt")) {
        fs.writeFileSync("completed.txt", "", 'utf8');
    }
}

createFile()

const help = () => {
    console.log("Usage :-")
    console.log("$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list")
    console.log("$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order")
    console.log("$ ./task del INDEX            # Delete the incomplete item with the given index")
    console.log("$ ./task done INDEX           # Mark the incomplete item with the given index as complete")
    console.log("$ ./task help                 # Show usage")
    console.log("$ ./task report               # Statistics")
};

const ls = () => {
    const allTasks = fs.readFileSync("task.txt", 'utf8');
    const completedTasks = fs.readFileSync("completed.txt", 'utf8');

    const lines = allTasks.split('\n');
    let index = 1
    let taskStr = ''

    lines.forEach((value) => {
        if (value.trim() !== '') {
            const items = value.split(' ');
            const task = items.slice(1,).join(" ")
            const priority = items[0]
            if (!completedTasks.includes(task)) {
                taskStr += `${index}. ${task} [${priority}]\n`
                index += 1
            }
        }
    })

    if (taskStr === '') {
        console.log("There are no pending tasks!")
    } else {
        console.log(taskStr)
    }
}

const add = (userPriority, userTask) => {
    if (userPriority === undefined || userTask === undefined) {
        console.log("Error: Missing tasks string. Nothing added!")
        return
    }

    const allTasks = fs.readFileSync("task.txt", 'utf8');

    let position = 0
    const lines = allTasks.split('\n');

    for (const line of lines) {
        if (line.trim() !== '') {
            const items = line.split(' ');
            const priority = Number(items[0])
            if (priority > Number(userPriority)) {
                break
            }
            position += line.length + 1
        }
    }

    const updatedContent = allTasks.slice(0, position) + `${userPriority} ${userTask}\n` + allTasks.slice(position);
    fs.writeFileSync("task.txt", updatedContent, 'utf8');

    console.log(`Added task: "${userTask}" with priority ${userPriority}`)
}


const done = (index) => {
    if (index === undefined) {
        console.log("Error: Missing NUMBER for marking tasks as done.")
        return
    }
    const allTasks = fs.readFileSync("task.txt", 'utf8');
    const completedTasks = fs.readFileSync("completed.txt", 'utf8');

    const lines = allTasks.split('\n');
    let count = 0
    let found = false

    for (const line of lines) {
        if (line.trim() !== '' && !completedTasks.includes(line.split(" ").slice(1,).join(" "))) {
            count += 1
            if (count === parseInt(index)) {
                found = true
                fs.appendFileSync("completed.txt", `${line.split(" ").slice(1,).join(" ")}\n`, 'utf8');
                break
            }
        }
    }


    if (!found) {
        console.log(`Error: no incomplete item with index #${index} exists.`)
    } else {
        console.log(`Marked item as done.`)
    }
}

const del = (index) => {
    if (index === undefined) {
        console.log("Error: Missing NUMBER for deleting tasks.")
        return
    }

    const allTasks = fs.readFileSync("task.txt", 'utf8');
    const completedTasks = fs.readFileSync("completed.txt", 'utf8');

    const lines = allTasks.split('\n');
    let count = 0
    let found = false

    for (const line of lines) {
        if (line.trim() !== '' && !completedTasks.includes(line.split(" ").slice(1,).join(" "))) {
            count += 1
            if (count === parseInt(index)) {
                found = true
                const updatedContent = allTasks.replace(`${line}\n`, '');
                fs.writeFileSync("task.txt", updatedContent, 'utf8');
                break
            }
        }
    }

    if (!found) {
        console.log(`Error: task with index #${index} does not exist. Nothing deleted.`)
    } else {
        console.log(`Deleted task #${index}`)
    }
}

const report = () => {
    const allTasks = fs.readFileSync("task.txt", 'utf8');
    const completedTasks = fs.readFileSync("completed.txt", 'utf8');

    const lines = allTasks.split('\n');
    let taskCount = 0
    let tasksStr = ''

    for (const line of lines) {
        if (line.trim() !== '' && !completedTasks.includes(line.split(" ").slice(1,).join(" "))) {
            taskCount += 1
            tasksStr += `${taskCount}. ${line.split(" ").slice(1,).join(" ")} [${line.split(" ")[0]}]\n`
        }
    }

    console.log(`Pending : ${taskCount}`.trim())
    console.log(tasksStr)

    let completedCount = 0
    let completedStr = ''

    for (const line of completedTasks.split('\n')) {
        if (line.trim() !== '') {
            completedCount += 1
            completedStr += `${completedCount}. ${line}\n`
        }
    }

    console.log(`Completed : ${completedCount}`)
    console.log(completedStr)
}

const main = (args) => {
    switch (args[0]) {
        case 'help':
            help()
            break
        case 'ls':
            ls()
            break
        case 'add':
            add(args[1], args[2])
            break
        case 'done':
            done(args[1])
            break
        case 'del':
            del(args[1])
            break
        case 'report':
            report()
            break
        default:
            help()
            break
    }
}

main(args)
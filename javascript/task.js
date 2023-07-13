const fs = require("fs");
const args = process.argv.slice(2);

fs.writeFileSync("task.txt", '', 'utf8');
fs.writeFileSync("completed.txt", '', 'utf8');

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
    fs.readFile("task.txt", 'utf8', (err, allTasks) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const lines = allTasks.split('\n');
        let index = 1
        lines.forEach((value) => {
            if (value.trim() !== '') {
                const items = value.split(' ');
                const task = items.slice(1,).join(" ")
                const priority = items[0]
                const completed = fs.readFileSync("completed.txt", 'utf8');
                if (!completed.includes(task)) {
                    console.log(`${index}. ${task} [${priority}]`)
                    index += 1
                }
            }
        })
    })
}

const add = (task, priority) => {
    if(task===undefined || priority===undefined){
        console.log('Error: Missing tasks string. Nothing added!')
        return
    }
    const newTask = `${priority} ${task}\n`
    console.log(`Added task: "${task}" with priority ${priority}`)
    fs.readFile("task.txt", 'utf8', (err, allTasks) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            const lines = allTasks.split('\n');
            let position = 0
            for (const line of lines) {
                if (line.trim() !== '') {
                    const items = line.split(' ');
                    const priority = items[0]
                    if (priority > Number(newTask.split(' ')[0])) {
                        break
                    }
                    position += line.length + 1
                }
            }
            const content = fs.readFileSync("task.txt", 'utf8');
            const updatedContent = content.slice(0, position) + newTask + content.slice(position);
            fs.writeFileSync("task.txt", updatedContent, 'utf8');
        }
    )
}

const done = (index) => {
    let found = false
    fs.readFile("task.txt", 'utf8', (err, allTasks) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const completed = fs.readFileSync("completed.txt", 'utf8');
        const lines = allTasks.split('\n');
        let count = 0
        for (const line of lines) {
            if (line.trim() !== '' && !completed.includes(line.split(" ").slice(1,).join(" "))) {
                count += 1
                if (count === parseInt(index)) {
                    found = true
                    fs.appendFileSync("completed.txt", `${line.split(" ").slice(1,).join(" ")}\n`, 'utf8');
                    break
                }
            }
        }
    })
    if (!found) {
        console.log(`Error: no incomplete item with index ${index} exists.`)
    }else{
        console.log(`Marked item as done.`)
    }
}

const del = (index) => {
    let deleted = false
    fs.readFile("task.txt", 'utf8', (err, allTasks) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const completed = fs.readFileSync("completed.txt", 'utf8');
        const lines = allTasks.split('\n');
        let count = 0
        for (const line of lines) {
            if (line.trim() !== '' && !completed.includes(line.split(" ").slice(1,).join(" "))) {
                count += 1
                if (count === parseInt(index)) {
                    deleted = true
                    const content = fs.readFileSync("task.txt", 'utf8');
                    const updatedContent = content.replace(`${line}\n`, '');
                    fs.writeFileSync("task.txt", updatedContent, 'utf8');
                    break
                }
            }
        }
    })
    if (!deleted) {
        console.log(`Error: item with index ${index} does not exist. Nothing deleted.`)
    }else{

    console.log(`Deleted item with index ${index}`)
    }
}

const report = () => {
    fs.readFile("task.txt", 'utf8', (err, allTasks) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            const completed = fs.readFileSync("completed.txt", 'utf8');
            const lines = allTasks.split('\n');
            let count = 0
            let completedCount = 0
            let tasksStr = ''
            console.log('Pending tasks:')
            for (const line of lines) {
                if (line.trim() !== '' && !completed.includes(line.split(" ").slice(1,).join(" "))) {
                    count += 1
                    console.log(`${count}. ${line.split(" ").slice(1,).join(" ")} [${line.split(" ")[0]}]`)
                }
            }
            console.log('Completed tasks:')
            for (const line of completed.split('\n')) {
                if (line.trim() !== '') {
                    completedCount += 1
                    console.log(`${line}`)
                }
            }
        }
    )
}

switch (args[0]) {
    case 'help':
        help()
        break
    case 'add':
        add(args[2], args[1])
        break
    case 'ls':
        ls()
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
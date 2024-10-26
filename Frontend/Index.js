let provider;
let signer;
let contract;

// Contract address and ABI
const contractAddress = "0x52bE4Bd50d64B3F605542E4140bc57483eF117fE"; // Update this with the actual contract address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_desc",
                "type": "string"
            }
        ],
        "name": "addTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "markAsFinished",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "stateMutability": "view",
        "name": "getAllTasks",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "desc",
                        "type": "string"
                    },
                    {
                        "internalType": "enum TaskToDo.TaskStatus",
                        "name": "status",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct TaskToDo.Task[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getTask",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "enum TaskToDo.TaskStatus",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tasks",
        "outputs": [
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "enum TaskToDo.TaskStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Connect to MetaMask
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.getElementById("connectButton").innerHTML = "Connected";
            console.log("MetaMask connected:", await signer.getAddress());
            getTasks(); // Automatically fetch tasks when connected
        } catch (error) {
            console.error("Error connecting MetaMask:", error);
        }
    } else {
        document.getElementById("connectButton").innerHTML = "Please install MetaMask";
    }
}

// Add a new task
async function addTask(event) {
    event.preventDefault();
    const taskDesc = document.getElementById("taskDesc").value;

    try {
        const tx = await contract.addTask(taskDesc);
        await tx.wait(); // Wait for the transaction to be mined
        alert("Task added successfully!");
        getTasks(); // Refresh the tasks list after adding
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

// Mark a task as finished
async function markTaskAsFinished(event) {
    event.preventDefault();
    const taskId = document.getElementById("taskId").value;

    try {
        const tx = await contract.markAsFinished(taskId);
        await tx.wait(); // Wait for the transaction to be mined
        alert(`Task ${taskId} marked as finished!`);
        getTasks(); // Refresh the tasks list after updating
    } catch (error) {
        console.error("Error marking task as finished:", error);
    }
}

// Get all tasks
async function getTasks() {
    try {
        const tasks = await contract.getAllTasks();
        const tasksList = document.querySelector("#tasksList tbody");
        tasksList.innerHTML = '';

        tasks.forEach((task, index) => {
            const taskStatus = task.status === 0 ? "Pending" : "Finished";
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td>${index}</td>
                <td>${task.desc}</td>
                <td>${taskStatus}</td>
            `;
            tasksList.appendChild(taskRow);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Attach event listeners
document.getElementById("addTaskForm").addEventListener("submit", addTask);
document.getElementById("markTaskForm").addEventListener("submit", markTaskAsFinished);

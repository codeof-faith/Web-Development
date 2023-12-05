const task_box = document.getElementById("task-container");

const create_btn = document.getElementById("create-btn");
const clear_btn = document.getElementById("clear-btn");

const create_popup = document.getElementById("create-popup");
const submit_btn = document.getElementById("submit-btn");
const discard_btn = document.getElementById("discard-btn");

const submit_popup = document.getElementById("task-added-popup");
const confirm_submit_btn = document.getElementById("confirm-submit-btn");

const task_input = document.getElementById("task-input");

create_btn.addEventListener('click', createOrEditTask);
clear_btn.addEventListener('click', clearTasks);
submit_btn.addEventListener('click', submitTask);
discard_btn.addEventListener('click', discardTask);
confirm_submit_btn.addEventListener('click', confirmSubmit);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initial rendering when the page loads
window.addEventListener('load', function () {
    renderTasks();
});

let editTask = null;

function createOrEditTask(){
    create_popup.classList.add("open-popup");
    task_list.classList.add("hide");

    if(editTask){
        task_input.value = editTask.taskName;
    }
    else{
        task_input.value = '';
    }
}

function submitTask() {
    const taskName = task_input.value;
    
    if(editTask){
        editTask.taskName = taskName;
    }
    else{
        tasks.push({
            taskName: taskName,
            checked: false // Initialize checked state to false
        });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTasks();
    submit_popup.classList.add("open-popup");
    create_popup.classList.remove("open-popup");
    
    editTask = null;
}

function confirmSubmit() {
    submit_popup.classList.remove("open-popup");
    create_popup.classList.remove("open-popup");
    task_list.classList.remove("hide");
}

function discardTask(){
    create_popup.classList.remove("open-popup");
    task_list.classList.remove("hide");
}

const task_list = document.getElementById("list");
const task_template = document.getElementById("task-template");

function renderTasks() {
    const allt = document.getElementById('all-tasks');
    selectFilter(allt);

    // Clear existing tasks
    task_list.innerHTML = '';

    // Render tasks on the client side
    tasks.forEach(task => {
        const addedTask = addTask(task);

        const checkbox = addedTask.querySelector('.chkBox');

        // Add an event listener to update the 'checked' state when the checkbox is clicked
        checkbox.addEventListener('change', function () {
            task.checked = this.checked;

            // Add or remove the 'completed' class based on the checked state
            if (this.checked) {
                this.parentElement.classList.add('completed');
            } else {
                this.parentElement.classList.remove('completed');
            }
            //The class is not added to the checkbox, instead to its parent task div.

            // Save tasks to local storage after updating the 'checked' state
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
    });
}

function addTask(task) {
    const task_item = task_template.content.cloneNode(true);
    const tsk = task_item.querySelector('.taskDesc');
    tsk.innerHTML = task.taskName;
    
    const checkbox = task_item.querySelector('.chkBox');
    const addedTask = task_item.querySelector('.task');

    if(task.checked){
        checkbox.checked = true;
        addedTask.classList.add('completed'); 
        //because the task_item is a document fragment and do not have its own classlist property
    }

    const editButton = task_item.querySelector('.editTask');
    const deleteButton = task_item.querySelector('.deleteTask');

    editButton.addEventListener('click', function () {
        editTask = task;
        createOrEditTask();
    });

    deleteButton.addEventListener('click', function () {
        // Remove the task from the tasks array
        const taskIndex = tasks.findIndex(t => t.taskName === task.taskName);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    });

    task_list.appendChild(task_item);
    return addedTask; //Returning the added element to be used for other actions.
}

function selectFilter(element) {
    // Remove the 'selected' class from all filters
    document.querySelectorAll('.filter-type').forEach(item => {
      item.classList.remove('selected');
    });

    // Add the 'selected' class to the clicked filter
    element.classList.add('selected');
  }

function renderCompletedTasks(){
    const comp = document.getElementById('completed-tasks');
    selectFilter(comp);

    const allTasks = document.getElementsByClassName("task");

    for(let i = 0; i < allTasks.length; i++){
        if(!(allTasks[i].classList.contains('completed'))){
            allTasks[i].classList.add('hide');
        }
        if(allTasks[i].classList.contains('completed')){
            allTasks[i].classList.remove('hide');
        }
    }
}

function renderPendingTasks(){
    const pend = document.getElementById('pending-tasks');
    selectFilter(pend);

    const allTasks = document.getElementsByClassName("task");

    for(let i = 0; i < allTasks.length; i++){
        if(allTasks[i].classList.contains('completed')){
            allTasks[i].classList.add('hide');
        }
        if(!(allTasks[i].classList.contains('completed'))){
            allTasks[i].classList.remove('hide');
        } 
    }
}

function clearTasks(){
    tasks = [];
    localStorage.removeItem('tasks');
    renderTasks();

    document.querySelectorAll('.filter-type').forEach(item => {
        item.classList.remove('selected');
    });
}

// editButton.addEventListener('click', function () {
//     // // Make the task description editable
//     // const editableTaskDesc = tsk;
//     // editableTaskDesc.contentEditable = true;
//     // // editableTaskDesc.classList.add('editable');
//     // editableTaskDesc.focus();

//     // // Update the task name in the tasks array when the user finishes editing
//     // editableTaskDesc.addEventListener('blur', function () {
//     //     task.taskName = editableTaskDesc.textContent;
//     //     localStorage.setItem('tasks', JSON.stringify(tasks));
//     // });
// });
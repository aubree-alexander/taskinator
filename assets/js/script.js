var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

    var taskFormHandler = function(e) {
        e.preventDefault();
        var taskNameInput = document.querySelector("input[name='task-name']").value;
        var taskTypeInput = document.querySelector("select[name='task-type']").value;

        //check if input values are empty strings
        if (!taskNameInput || !taskTypeInput) {
            alert("You need to fill out the task form!");
            return false;
        }

        formEl.reset();
        
        var isEdit = formEl.hasAttribute("data-task-id");
    
        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        //send it as an argument to createTaskEl
        
        //has data attribute, so get task id and call functino to complete edit process
        if (isEdit) {
            var taskId = formEl.getAttribute("data-task-id");
            completeEditTask(taskNameInput, taskTypeInput, taskId);
        }
        // no data attribute, so create object as normal and pass to createTaskEl function
        else { 
            var taskDataObj = {
                name: taskNameInput,
                type: taskTypeInput
            };

            createTaskEl(taskDataObj);
        }
    };

    var createTaskEl = function(taskDataObj) {
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", taskIdCounter);

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);
        tasksToDoEl.appendChild(listItemEl);

        // increase task counter for next unique id
        taskIdCounter++;
    };

    var createTaskActions = function(taskId) {
        // create container to hold elements
        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";
        
       // create edit button
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(editButtonEl);

        // create delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", taskId);
        actionContainerEl.appendChild(deleteButtonEl);

       // create change status dropdown
        var statusSelectEl = document.createElement("select");
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", taskId);
        statusSelectEl.className = "select-status";
        actionContainerEl.appendChild(statusSelectEl);

        // create status options
        var statusChoices = ["To Do", "In Progress", "Completed"];

        for (var i = 0; i < statusChoices.length; i++) {
            // create option element
            var statusOptionEl = document.createElement("option");
            statusOptionEl.setAttribute("value", statusChoices[i]);
            statusOptionEl.textContent = statusChoices[i];

            // append to select
            statusSelectEl.appendChild(statusOptionEl);
        }

        return actionContainerEl;
    };

    var taskButtonHandler = function(e) {
        var targetEl = e.target;

        if (targetEl.matches(".edit-btn")) {
            var taskId = targetEl.getAttribute("data-task-id");
            editTask(taskId);
        }
        else if (targetEl.matches(".delete-btn")) {
            var taskId = targetEl.getAttribute("data-task-id");
            deleteTask(taskId);
        }
    };

    var taskStatusChangeHandler = function(event) {
        console.log(event.target.value);
      
        // find task list item based on event.target's data-task-id attribute
        var taskId = event.target.getAttribute("data-task-id");
      
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
        // convert value to lower case
        var statusValue = event.target.value.toLowerCase();
      
        if (statusValue === "to do") {
          tasksToDoEl.appendChild(taskSelected);
        } else if (statusValue === "in progress") {
          tasksInProgressEl.appendChild(taskSelected);
        } else if (statusValue === "completed") {
          tasksCompletedEl.appendChild(taskSelected);
        }
      };

    var deleteTask = function(taskId) {
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        taskSelected.remove();
    };

    var editTask = function(taskId) {
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        var taskName = taskSelected.querySelector("h3.task-name").textContent;
        var taskType = taskSelected.querySelector("span.task-type").textContent;

        document.querySelector("input[name='task-name']").value = taskName;
        document.querySelector("select[name='task-type']").value = taskType;
        document.querySelector('#save-task').textContent = "Save Task";
        formEl.setAttribute("data-task-id", taskId);
    }

    var completeEditTask = function(taskName, taskType, taskId) {
        // find task list item with taskId value
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
        // set new values
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;
      
        alert("Task Updated!");
      
        // remove data attribute from form
        formEl.removeAttribute("data-task-id");
        // update formEl button to go back to saying "Add Task" instead of "Edit Task"
        formEl.querySelector("#save-task").textContent = "Add Task";
      };

  

    // Create a new task
    formEl.addEventListener("submit", taskFormHandler);

    // for edit and delete buttons
    pageContentEl.addEventListener("click", taskButtonHandler);

    // for changing the status
    pageContentEl.addEventListener("change", taskStatusChangeHandler);

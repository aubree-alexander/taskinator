var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

//create array to hold tasks for saving
var tasks=[];

    var taskFormHandler = function(e) {
        e.preventDefault();
        var taskNameInput = document.querySelector("input[name='task-name']").value;
        var taskTypeInput = document.querySelector("select[name='task-type']").value;

        //check if input values are empty strings
        if (!taskNameInput || !taskTypeInput) {
            alert("You need to fill out the task form!");
            return false;
        }

        // reset form fields for next task to be entered
        document.querySelector("input[name='task-name']").value = "";
        document.querySelector("select[name='task-type']").selectedIndex = 0;

        var isEdit = formEl.hasAttribute("data-task-id");
    
        if (isEdit) {
            var taskId = formEl.getAttribute("data-task-id");
            completeEditTask(taskNameInput, taskTypeInput, taskId);
        } else {
            var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do",
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

        switch (taskDataObj.status) {
            case "to do":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
              tasksToDoEl.append(listItemEl);
              break;
            case "in progress":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
              tasksInProgressEl.append(listItemEl);
              break;
            case "completed":
              taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
              tasksCompletedEl.append(listItemEl);
              break;
            default:
              console.log("Something went wrong!");
          }

        taskDataObj.id = taskIdCounter;

        tasks.push(taskDataObj);

        // increase task counter for next unique id
        taskIdCounter++;

        saveTasks();
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

    var completeEditTask = function(taskName, taskType, taskId) {
        // find task list item with taskId value
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
        // set new values
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;

        //loop through tasks array and task object with new content
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].name = taskName;
                tasks[i].type = tasktype;
            }
        }
      
        alert("Task Updated!");
      
        // remove data attribute from form
        formEl.removeAttribute("data-task-id");
        // update formEl button to go back to saying "Add Task" instead of "Edit Task"
        formEl.querySelector("#save-task").textContent = "Add Task";

        saveTasks();
    };
    
    var taskButtonHandler = function(e) {
        var targetEl = e.target;

        if (targetEl.matches(".edit-btn")) {
            console.log("edit", targetEl);
            var taskId = targetEl.getAttribute("data-task-id");
            editTask(taskId);
        }
        else if (targetEl.matches(".delete-btn")) {
            console.log("delete", targetEl);
            var taskId = targetEl.getAttribute("data-task-id");
            deleteTask(taskId);
        }
    };

    var taskStatusChangeHandler = function(e) {
        console.log(e.target.value);
      
        // find task list item based on event.target's data-task-id attribute
        var taskId = e.target.getAttribute("data-task-id");
      
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      
        // convert value to lower case
        var statusValue = e.target.value.toLowerCase();
      
        if (statusValue === "to do") {
            tasksToDoEl.appendChild(taskSelected);
          } else if (statusValue === "in progress") {
            tasksInProgressEl.appendChild(taskSelected);
          } else if (statusValue === "completed") {
            tasksCompletedEl.appendChild(taskSelected);
          }

          // update tasks in tasks array
          for (var i = 0; i < tasks.length; i++) {
              if (tasks[i].id === parseInt(taskId)) {
                  tasks[i].status = statusValue;
              }
          }

          saveTasks();
      };

      var editTask = function(taskId) {
        console.log(taskId);

        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        var taskName = taskSelected.querySelector("h3.task-name").textContent;
        console.log(taskName);
        var taskType = taskSelected.querySelector("span.task-type").textContent;
        console.log(taskType);

        document.querySelector("input[name='task-name']").value = taskName;
        document.querySelector("select[name='task-type']").value = taskType;
        formEl.setAttribute("data-task-id", taskId);
        document.querySelector("#save-task").textContent = "Save Task";
    }
    
      var deleteTask = function(taskId) {
        console.log(taskId);
        var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
        taskSelected.remove();

        //create new array to hold updated list of tasks
        var updatedTaskArr = [];

        //loop through current tasks
        for (var i = 0; i < tasks.length; i++) {
            //if tasks[i].id doesn't match the value of taskId, keep that task and push it into the new array
            if (tasks[i].id !== parseInt(taskId)) {
                updatedTaskArr.push(tasks[i]);
            }
        }

        //reassign tasks array to be the same as updatedTaskArr
        tasks = updatedTasksArr;

        saveTasks();
    };

    var saveTasks = function() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    var loadTasks = function() {
        var savedTasks = localStorage.getItem("tasks");
        
        // if there are no tasks, set tasks to an empty array and return out of the function
        if (!savedTasks) {
            return false;
        }
        console.log("Saved tasks found!");
        // else, load up saved tasks

        // parse into array of objects
        savedTasks = JSON.parse(savedTasks);

        // loop through savedTasks array
        for (var i = 0; i < savedTasks.length; i++) {
            // pass each task object into the `createTaskEl()` function
            createTaskEl(savedTasks[i]);
        }
    }

    // Create a new task
    formEl.addEventListener("submit", taskFormHandler);

    // for edit and delete buttons
    pageContentEl.addEventListener("click", taskButtonHandler);

    // for changing the status
    pageContentEl.addEventListener("change", taskStatusChangeHandler);

    loadTasks();
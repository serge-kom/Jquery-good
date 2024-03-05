
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let id = nextId;
  nextId++; 
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

  let  formattedDuedate = dayjs(task.dueDate).format("MM/DD/YYYY");

  let backgroundColor = getColor(task.dueDate);
  let cardHTML = `
    <div class="task-card card mb-3" id="task-${task.id}" style="background-color: ${backgroundColor};">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <button class="btn btn-danger btn-sm delete-btn" data-task-id="${task.id}">Delete</button>
      </div>
    </div>
  `;
  let lane = $("#" + task.status);
  console.log(lane);
  lane.append(cardHTML);
  let card= $(".task-card[data-task-id='" + task.id + "']");
  card.find(".card-header").css("backgroud-color", backgroundColor);
  if (task.status === 'done') {
    card.css("background-color", "white");
    card.find(".card-header").css("background-color", "white");
  }
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  $(".lane").empty();
  taskList.forEach(task => {
    const card = createTaskCard(task);
    $(`#${task.status}-cards`).append(card);
  });

  $(".task-card").draggable({
    revert: "invalid",
    cursor: "grab",
    containment: "document",
    helper: "clone"
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const status = "to-do"; // Initial status
  const id = generateTaskId();

  const newTask = { id, title, description, status };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  const card = createTaskCard(newTask);
  $("#to-do-cards").append(card);
  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleAddTask(event) {
  event.preventDefault();
  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const dueDate = $("#dueDate").val(); // Retrieve due date from the datepicker
  const status = "to-do"; // Initial status
  const id = generateTaskId();

  const newTask = { id, title, description, dueDate, status };

  // Setting red background color for the task card
  const card = createTaskCard(newTask);
  $(card).css("background-color", "red"); // Set background color to red

  $("#to-do-cards").append(card);
  $("#formModal").modal("hide");
}
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.attr("id").split("-")[1];
  let newStatus = $(this).attr("id");
  let taskIndex = taskList.findIndex(task => task.id == taskId);
if (taskId !== -1){
  
    taskList[taskIndex].status = newStatus;

  // localStorage.setItem("tasks", JSON.stringify(taskList));

  ui.draggable.detach().css( {top: 0, left: 0}).appendTo($(this));

  if (newStatus === "done") {
    ui.draggable.css("background-color" , "white");
    ui.draggable.find(".card-header").css("background-color" , "white");
 } else {
  ui.draggable.find(".card-header").css("background-color",
  getColor(taskList[taskIndex].dueDate));

  // reset the card header bacground to default color
  ui.draggable.find(".card-header").css("background-color",
  getColor(taskList[taskIndex].dueDate));
 }
 // update local storage
 localStorage.setItem("tasks", JSON.stringify(taskList));
}
else {
  console.error("task not found")
 }
}


// To do: function to get color base on due date
function getColor(dueDate){
  let now = dayjs();
  let deadline = dayjs(dueDate);
  let daysUntilDeadline = deadline.diff(now, "day");
  if (daysUntilDeadline < o) {
    return"red"; // overdue
}
else if  (daysUntilDeadline<=2) {
  return "yellow"; // nearing date
}
else {
  return white; // default
}
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  console.log("task rendered");

  $("#addTaskForm").submit(handleAddTask);

  $(document).on("click", ".delete-task", handleDeleteTask);
  
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  $("#dueDate").datepicker({
    dateFormat: "mm/dd/yy",
    changeMonth: true,
    changeYear: true,
  });
});


/* Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  console.log("task rendered");

  $("#addTaskForm").submit(handleAddTask);

  $(".delete-btn").on("click", handleDeleteTask);
  
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  $("#dueDate").datepicker({
    dateFormat: "mm/dd/yy",
    changeMonth: true,
    changeYear: true,
  });
});
</script>
</body>
</html>*/
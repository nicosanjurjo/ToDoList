console.log("Script cargado correctamente");
const API_URL = "http://127.0.0.1:8000";

function getAuthToken() {
    return localStorage.getItem("token");
}

function setAuthToken(token) {
    localStorage.setItem("token", token);
}

function removeAuthToken() {
    localStorage.removeItem("token");
}

function checkAuth() {
    console.log("Ejecutando checkAuth. Token actual:", getAuthToken());

    if (!getAuthToken()) {
        console.log("No hay token. Mostrando login, ocultando tareas.");
        $("#auth").show();
        $("#todo-app").hide();
    } else {
        console.log("Token encontrado. Ocultando login, mostrando tareas.");
        loadTasks();
        $("#auth").hide();
        $("#todo-app").show();
    }
}


function loadTasks() {
    console.log("Intentando cargar tareas...");
    $.ajax({
        url: `${API_URL}/tasks/`,
        method: "GET",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        success: function (tasks) {
            console.log("Tareas recibidas:", tasks);
            const taskList = $("#task-list");
            taskList.empty();
            tasks.forEach(task => {
                taskList.append(`
                    <li data-date="Fecha: ${task.scheduled_date}">
                        <strong>${task.title}</strong>
                        ${task.description}
                        <button class="delete-task" data-id="${task.id}">Eliminar</button>
                    </li>
                `);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar tareas:", xhr.responseText);
            alert("Error al cargar tareas");
        }
    });
}

$(document).ready(function () {
    console.log("Probando función getAuthToken:", getAuthToken());
    console.log("Probando función checkAuth:");
    checkAuth();

    $("#login-form").submit(function (e) {
        e.preventDefault();
        const username = $("#login-username").val();
        const password = $("#login-password").val();

        $.post(`${API_URL}/auth/token`, { username, password })
            .done(function (data) {
                setAuthToken(data.access_token);
                checkAuth();
            })
            .fail(function () {
                alert("Error en autenticación");
            });
    });

    $("#register-form").submit(function (e) {
        e.preventDefault();
        const username = $("#register-username").val();
        const password = $("#register-password").val();

        $.ajax({
            url: `${API_URL}/auth/`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, password }),
            success: function () {
                alert("Usuario registrado, ahora inicia sesión");
                $("#register-form")[0].reset();
            },
            error: function () {
                alert("Error en registro");
                $("#register-form")[0].reset();
            }
        });
    });

    $("#logout").click(function () {
        removeAuthToken();
        $("#login-form")[0].reset();
        $("#task-form")[0].reset();
        checkAuth();
    });

    $("#task-form").submit(function (e) {
        e.preventDefault();
        const title = $("#task-title").val();
        const description = $("#task-desc").val();  // Aquí corregí el ID del input
        const scheduled_date = $("#task-date").val();
    
        console.log("Enviando nueva tarea:", { title, description, scheduled_date }); // 👀 Depuración
    
        $.ajax({
            url: `${API_URL}/tasks/`,
            method: "POST",
            contentType: "application/json",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
            data: JSON.stringify({ title, description, scheduled_date }),
            success: function () {
                console.log("Tarea creada con éxito.");
                loadTasks();
                $("#task-form")[0].reset();
            },
            error: function (xhr) {
                console.error("Error al crear tarea:", xhr.responseText);
                alert("Error al crear tarea");
            }
        });
    });
    

    $("#task-list").on("click", ".delete-task", function () {
        const taskId = $(this).data("id");
        $.ajax({
            url: `${API_URL}/tasks/${taskId}`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${getAuthToken()}` },
            success: function () {
                loadTasks();
            },
            error: function () {
                alert("Error al eliminar tarea");
            }
        });
    });
});

/* Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License. */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

$(document).on("mobileinit", function() {
    $.mobile.defaultPageTransition = "none";
    $.mobile.defaultDialogTransition = "none";
});

// —————————————————————————————————————————————————————————————————————————————————————————
// AFEGIR TASCA:
// Crea un nuevo elemento de lista con contenido editable y botones de editar y borrar.
// Agrega la nueva tarea a la lista. Actualiza la lista para que se apliquen los estilos.
// Llama a la función saveTasks para almacenar la nueva tarea.
function addTask() {
    var newTask = $('<li><a href="#page1"><span class="task-text" contenteditable="true">Nueva tarea</span><button class="edit-button task-action-button">Editar</button><button class="delete-button task-action-button">Borrar</button></a></li>');
    $("#taskList").append(newTask);
    $("#taskList").listview("refresh");
    saveTasks();
}

// —————————————————————————————————————————————————————————————————————————————————————————

// EDITAR TASCA:
// Aquest esdeveniment s'activa quan un usuari fa clic al botó d'edició associat a una tasca
// a la llista. La funció troba el text de la tasca més propera i el fa editable, llest per
// a l'edició per part de l'usuari. // Selecciona l'element de text de la tasca més proper
// dins d'un element <li>. Guarda el text original abans de l'edició. Fa que el text sigui
// sigui editable i li dóna el focus per a l'edició per part de l'usuari. Afegeix un
// controlador d'esdeveniments per a l'esdeveniment "blur" (pèrdua de focus) després de
// l'edició. Captura el nou text després de l'edició. Verifica si el text ha canviat durant
// l'edició. Si hi ha canvis, actualitza i desa les tasques. Elimina el controlador
// d'esdeveniments "blur" després de l'edició.
$(document).on("click", ".edit-button", function() {
    var taskText = $(this).closest("li").find(".task-text");
    var originalText = taskText.text();
    taskText.attr("contenteditable", "true").focus();
    taskText.on("blur", function() {
        var newText = taskText.text();
        if (originalText !== newText) { saveTasks(); } taskText.off("blur"); });});

// —————————————————————————————————————————————————————————————————————————————————————————

// ESBORRAR TASCA:
// S'activa quan un usuari fa clic en un botó de supressió associat a una tasca dins d'una
// llista. La funció troba l'element de la llista més proper i el suprimeix, seguit d'un
// desament de les tasques actualitzades.
$(document).on("click", ".delete-button", function() {
    var listItem = $(this).closest("li");
    listItem.remove();
    saveTasks();
});

// —————————————————————————————————————————————————————————————————————————————————————————

// BOTONS:
// Respon al clic d'un botó associat a una tasca dins d'una llista. Prevé l'acció per
// defecte del botó i determina si l'acció és "Editar" o "Borrar". A continuació, obté el
// text de la tasca corresponent i, depenent de l'acció, mostra un missatge de registre a
// la consola o elimina visualment la tasca de la llista, seguit de l'actualització de les
//tasques desades.
$(document).on("click", ".task-action-button", function(e) {
    e.preventDefault();
    var actionType = $(this).hasClass("edit-button") ? "Editar" : "Borrar";
    var taskText = $(this).closest("li").find(".task-text").text();
    if (actionType === "Editar") {
        console.log("Editar tarea:", taskText);
    } else if (actionType === "Borrar") {
        console.log("Borrar tarea:", taskText);
        $(this).closest("li").remove();
        saveTasks();
    }});

// —————————————————————————————————————————————————————————————————————————————————————————

// TASQUES:
// Desar i carregar les tasques de la llista a través de l'API de local storage. La funció
// "saveTasks" recopila els textos de tasques i els emmagatzema com a cadena JSON a la local
// storage. La funció loadTasks carrega les tasques emmagatzemades, les converteix en
// objectes i les afegeix a la llista amb els elements HTML corresponents. Finalment, es
// crida a loadTasks per carregar les tasques existents al carregar la pàgina.
function saveTasks() {
    var tasksToSave = [];
    $("#taskList .task-text").each(function() { tasksToSave.push($(this).text()); });
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
}

function loadTasks() {
    var storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        $("#taskList").empty();
        var tasks = JSON.parse(storedTasks);
        tasks.forEach(function(task) { $("#taskList").append('<li><a href="#page1"><span class="task-text" contenteditable="true">' + task + '</span><button class="edit-button task-action-button">Editar</button><button class="delete-button task-action-button">Borrar</button></a></li>'); });
        $("#taskList").listview("refresh");
}}

loadTasks();
// lado del cliente 

const socket = io();

let user;

let chatBox = document.getElementById("chatBox")

// alert de ingreso de datos

Swal.fire({
    title: "Ingresa Tú Nombre",
    input: "text",
    text: "Ingresa Tú Nombre o Usuario para Identificarte",
    inputValidator: (value) => {
        //validamos si ingresa algun valor
        return !value && "Por favor Ingresa Tú Nombre o Usuario"
    },
    // propiedad que no deja que se cierre la ventana de alert
    allowOutsideClick: false
}).then((result) =>{   // resolvemos la promesa que devuelve la libreria con el resultado del input
    user = result.value;
   

    // enviamos el usuario al servidor 
    socket.emit("newUser", user);
}) 


// Evento para enviar mensajes 

chatBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value });
        // borramos el mensaje cuando se envia 
        chatBox.value = "";
      }
    }
  });


  // recibimos los mensajes del chat acualizados 
  socket.on("messageLogs", (data) =>{
    let messagesLogs = document.getElementById("messageLogs");
    let messages = "";
    
    // for each con array de mensajes
    data.forEach((messageLog) => {
        messages = messages + `${messageLog.user} dice: ${messageLog.message} </br>`
    });

    messagesLogs.innerHTML = messages;
  })


  
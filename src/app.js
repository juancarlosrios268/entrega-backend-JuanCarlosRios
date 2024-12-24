import express from "express";
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js"
import { engine } from 'express-handlebars'
import { Server } from "socket.io";
import fs from "fs";
import { connectMongoDB } from "./config/mongoDb.config.js"


connectMongoDB();
const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static("public"));


app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get("/", (req,res) =>{
    res.render("home");
})


const httpServer = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
  });


// configuramos los socket

const io = new Server(httpServer);

let messages = [];
io.on("connection",  (socket) =>{
    console.log(`Nuevo cliente conectado con el id ${socket.id}`);

    // escuchamos el nuevo usuario
    socket.on("newUser", (data) =>{
        socket.broadcast.emit("newUser", data);
    })
    
    // escuchamos el evento mensaje
    socket.on ("message", (data) =>{
      setMessage(data)
      messages.push(data);  
      io.emit("messageLogs", messages);
    })
})

async function setMessage(message) {
  const path = "./src/managers/data/messages.json";
  const file = await fs.promises.readFile(path, "utf-8");
  const chat = JSON.parse(file);
  chat.push(message)
  await fs.promises.writeFile(path, JSON.stringify(chat));
} 
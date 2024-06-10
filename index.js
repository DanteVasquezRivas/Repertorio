import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { writeFileSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

//Get
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/canciones", (req, res) => {
	try {
		const canciones = JSON.parse(readFileSync("canciones.json"));
		res.json(canciones);
	} catch (error) {
		console.log(error);
	}
});

//Post
app.post("/canciones", (req, res) => {
	const id = Math.floor(Math.random() * 9999);
	const { titulo, artista, tono } = req.body;
	const cancion = { id, titulo, artista, tono };
	const canciones = JSON.parse(readFileSync("canciones.json"));
	canciones.push(cancion);

	writeFileSync("canciones.json", JSON.stringify(canciones));

	res.send("Canción agregada");
});

//Put
app.put("/canciones/:id", (req, res) => {
	const { id } = req.params;
	const cancion = req.body;
	const canciones = JSON.parse(readFileSync("canciones.json"));
	const index = canciones.findIndex((c) => c.id == id);

	canciones[index] = cancion;

	writeFileSync("canciones.json", JSON.stringify(canciones));
	res.send("Canción modificacada");
});

//Delete
app.delete("/canciones/:id", (req, res) => {
	const { id } = req.params;
	const canciones = JSON.parse(readFileSync("canciones.json"));
	const index = canciones.findIndex((c) => c.id === parseInt(id));

	canciones.splice(index, 1);
	writeFileSync("canciones.json", JSON.stringify(canciones));

	res.send("Canción eliminada");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log("SERVER ON!", `http://localhost:${PORT}`));


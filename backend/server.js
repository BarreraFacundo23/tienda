const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/opiniones')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

const commentSchema = new mongoose.Schema({
  comment: String,
  rating: Number
});

const Comment = mongoose.model('Comment', commentSchema);

app.post('/comments', async (req, res) => {
  const { comment, rating } = req.body;

  if (!comment || rating == null) {
    return res.status(400).send('Faltan datos en la solicitud');
  }

  try {
    // Guardar en MongoDB
    const newComment = new Comment({ comment, rating });
    await newComment.save();

    // Leer comentarios existentes desde el archivo JSON
    let comments = [];
    if (fs.existsSync('comments.json')) {
      const data = fs.readFileSync('comments.json', 'utf8');
      if (data) {
        comments = JSON.parse(data);
      }
    }

    // Agregar el nuevo comentario al array de comentarios
    comments.push({ comment, rating });

    // Escribir el array completo de comentarios de vuelta al archivo JSON
    fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2), 'utf8');

    res.status(201).send('Comentario guardado');
  } catch (err) {
    console.error('Error al guardar el comentario:', err);
    res.status(500).send('Error al guardar el comentario');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const FILE = './data/notes.json';

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

function readNotes() {
  return JSON.parse(fs.readFileSync(FILE));
}

function writeNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

app.get('/', (req, res) => {
  res.send('Docker Notes API Running');
});

app.get('/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const notes = readNotes();

  const newNote = {
    id: Date.now(),
    text: req.body.text
  };

  notes.push(newNote);

  writeNotes(notes);

  res.json({
    message: 'Note added',
    note: newNote
  });
});

app.delete('/notes/:id', (req, res) => {
  const notes = readNotes();

  const updated = notes.filter(
    note => note.id != req.params.id
  );

  writeNotes(updated);

  res.json({
    message: 'Note deleted'
  });
});

app.listen(3000, () => {
  console.log('Notes API running on port 3000');
});

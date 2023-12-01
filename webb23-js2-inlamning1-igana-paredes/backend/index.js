const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const highScoresPath = path.join(__dirname, 'highscores.json');
const cors = require('cors');
const bodyParser = require("body-parser");


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const rawData = fs.readFileSync(highScoresPath, "utf-8");
const highScores = JSON.parse(rawData);

app.get("/highscores", (req, res) => {
    const highscores = JSON.parse(fs.readFileSync(highScoresPath, "utf8"));
    res.json(highscores);
  });
  
  app.post("/highscores", (req, res) => {
    const { name, score } = req.body || {};
  
    if (!name || !score) {
      return res.status(400).json({ error: "Name and score are required" });
    }
  
    const highscores = JSON.parse(fs.readFileSync(highScoresPath, "utf8"));
    highscores.push({ name, score });

    highscores.sort((a, b) => b.score - a.score);
  
    const topHighscores = highscores.slice(0, 5);
  
    fs.writeFileSync(highScoresPath, JSON.stringify(topHighscores, null, 2));
  
    res.json(topHighscores);
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
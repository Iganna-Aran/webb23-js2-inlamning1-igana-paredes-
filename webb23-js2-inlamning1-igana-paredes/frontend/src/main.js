document.addEventListener("DOMContentLoaded", function () {
  let playerName = "";
  let playerScore = 0;



  async function fetchAndDisplayHighscores() {
    try {
      const response = await fetch("http://localhost:3000/highscores");
      const highscores = await response.json();

      const highscoreList = document.getElementById("highscore-list");

      highscoreList.innerHTML = "";

      highscores.forEach((score) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${score.name}: ${score.score}`;
        highscoreList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching highscore:", error);
    }
  }


  function startGame() {
    const playerNameInput = document.getElementById("playerName");
    playerName = playerNameInput.value.trim();
  }

  const startGameButton = document.getElementById("startGame");
  startGameButton.addEventListener("click", function () {
    startGame();
    showGameOptions();
  });
  function showGameOptions() {
    const gameOptionsContainer = document.getElementById("gameOptions");
    gameOptionsContainer.innerHTML = "";

    const options = ["rock", "paper", "scissors"];

    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", function () {
        playerChoice = option;
        playRound();
      });
      gameOptionsContainer.appendChild(button);
    });
  }
  async function playRound() {
    const options = ["rock", "paper", "scissors"];
    const computerChoice = options[Math.floor(Math.random() * options.length)];
    
    const playerChoiceMessage = document.getElementById("playerChoiceMessage");
    playerChoiceMessage.textContent = `Player ${playerName} chose ${playerChoice}.`;
    const aiChoiceMessage = document.getElementById("aiChoiceMessage");
    aiChoiceMessage.textContent = `AI chose ${computerChoice}.`;
    
    const winner = determineWinner(playerChoice, computerChoice);
    
    if (winner === "player") {
      playerScore++;
      const roundResultMessage = document.getElementById("roundResultMessage");
      roundResultMessage.textContent = `Congratulations, ${playerName} wins this round!`;
      showPlayerScore();
      fetchAndDisplayHighscores();
    } else if (winner === "ai") {
      const roundResultMessage = document.getElementById("roundResultMessage");
      roundResultMessage.textContent = `AI wins this round!`;
      await updateHighscores();
      fetchAndDisplayHighscores();
      playerScore = 0;
    } else {
      const roundResultMessage = document.getElementById("roundResultMessage");
      roundResultMessage.textContent = `It's a tie!`;
    }
    

  }
  function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
      return "tie";
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      return "player";
    } else {
      return "ai";
    }
  }


  async function updateHighscores() {

    const existingHighscores = await getHighscores();

    console.log("Player Name:", playerName);
    console.log("Player Score:", playerScore);

    const newHighscore = { name: playerName, score: playerScore };
    existingHighscores.push(newHighscore);

    existingHighscores.sort((a, b) => b.score - a.score);

    console.log("Existing Highscores:", existingHighscores);

    await fetch("http://localhost:3000/highscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHighscore)
    });
  }
  async function getHighscores() {
    const response = await fetch("http://localhost:3000/highscores");
    const highscores = await response.json();
    return highscores;
  }


  async function showPlayerScore() {
    const playerScoreContainer = document.getElementById("playerScore");
    playerScoreContainer.textContent = `Player Score: ${playerScore}`;
  }

  fetchAndDisplayHighscores();
  });
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let game = createGame();

app.get("/", (req, res) => {
  res.json({ status: "MonkeyKing API Running" });
});

app.get("/state", (req, res) => {
  res.json(game);
});

app.post("/move", (req, res) => {
  processTurn(game.players[0]);

  if (!game.winner) {
    processTurn(game.players[1]); // AI
  }

  res.json(game);
});

function createGame() {
  return {
    stage: 0,
    winner: null,
    players: [
      createPlayer("You"),
      createPlayer("AI")
    ],
    story: []
  };
}

function createPlayer(name) {
  return {
    name,
    hp: 10,
    omicrones: 0,
    pos: 0,
    enemies: 0
  };
}

function processTurn(player) {
  if (game.winner) return;

  player.pos += 1;

  const r = Math.random();

  if (r < 0.3) combat(player);
  else if (r < 0.5) player.omicrones += rand(2,6);
  else if (r < 0.6) player.hp -= 1;

  if (player.hp <= 0) {
    player.hp = 5;
    player.pos = 0;
    player.omicrones = Math.max(0, player.omicrones - 3);
  }

  if (player.pos >= 20 && game.stage === 3) {
    game.winner = player.name;
  }

  checkStage(player);
}

function combat(player) {
  let enemyHp = 3;

  while (enemyHp > 0 && player.hp > 0) {
    if (roll() > roll()) enemyHp--;
    else player.hp--;
  }

  if (enemyHp <= 0) {
    player.omicrones += 3;
    player.enemies++;
  }
}

function checkStage(player) {
  if (game.stage === 0 && player.enemies >= 1) {
    game.stage = 1;
    game.story.push("Entered Monkey Cave");
  }
  if (game.stage === 1 && player.omicrones >= 10) {
    game.stage = 2;
    game.story.push("Entered Monkey Temple");
  }
  if (game.stage === 2 && player.enemies >= 5) {
    game.stage = 3;
    game.story.push("Entered Monkey Palace");
  }
}

function roll() {
  return Math.floor(Math.random()*6)+1;
}

function rand(a,b){
  return Math.floor(Math.random()*(b-a+1))+a;
}

app.listen(process.env.PORT || 10000);

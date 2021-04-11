const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const user = require("./routes/user");
const InitiateMongoServer = require("./config/db");

const {v4 : uuidV4} = require("uuid");
const {getModel} = require("./model");
const {getModel_new} = require("./model_new");

dotenv.config();
InitiateMongoServer();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/api/user", user);

app.get("/", (req, res) => { res.render("index"); });

app.get("/old_u/:user", (req, res) => {
  getModel(req.params.user, function(resp) {
    res.render("user", {
      model : resp[0],
      texture : resp[1],
      user : req.params.user,
    });
  });
});

app.get("/u/:user", async (req, res) => {
  var uuid = await getId(req.params.user);
  res.render("user_new", {
    page : req.get("host") + req.originalUrl,
    fullPage : req.protocol + "://" + req.get("host") + req.originalUrl,
    user : req.params.user,
    uuid : uuid,
    formattedUuid : uuid.replace(/(........)(....)(....)(....)(............)/gi,
                                 "$1-$2-$3-$4-$5"),
  });
});

app.get("/m/:model",
        (req, res) => { res.render("model", {model : req.params.model}); });

app.get("/testing-three", (req, res) => { res.render("test"); });

io.sockets.on("connection", function(socket) {
  socket.on("getModel", function(data) {
    getModel_new(
        data.user,
        function(resp) { socket.emit("setModel", {model : resp.toString()}); });
  });
});

const port =
    process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;

server.listen(port, () => {
  console.log(`The application started on port ${server.address().port}`);
});

app.get("/login", (req, res) => { res.render("login"); });

app.get("/signup", (req, res) => { res.render("signup"); });

function getId(playername) {
  return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
      .then((data) => data.json())
      .then((player) => player.id);
}

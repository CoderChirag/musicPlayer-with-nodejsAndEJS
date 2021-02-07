const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Frontend", "views"))

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "Frontend", "public")));

app.get("/", (req, res) => {
    res.render("home", {page: "main"});
});

var result = [];

app.post("/search", (req, res) => {
    let query = req.body.query.trim();
    console.log(query);
    function searchData(query){
        axios.get(`https://apg-saavn-api.herokuapp.com/result/?q=${query}`)
        .then(response => {
            console.log(response);
            result = [];
            response.data.forEach((obj, ind) => {
                let o = {}
                let temp = {
                    id: o.trackingId,
                    song: o.trackName,
                    singers: o.artistName,
                    image: o.imgUrl,
                    media_url: o.trackUrl
                } = obj;
                result[ind] = o;
            });
            res.render("home", {page: "search", result: result})
        })
        .catch(err => {
            console.log(err);
        })
    }
    searchData(query);
});

app.get("/songURL/:songId", cors(), (req, res) => {
    var songId = req.params.songId;
    let o = {}
    for(let obj of result){
        console.log(obj);
        console.log("\n\n\n\n\n")
        if(obj.trackingId == songId){
            o = {imgUrl: obj.imgUrl, trackName: obj.trackName, artistName: obj.artistName, trackUrl: obj.trackUrl}
            break;
        }
    }
    res.json(o);
})

app.listen(process.env.port || 4000, () => console.log("server started at port 4000"));
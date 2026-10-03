const express =
    require("express");

const app = express();


app.get("\", (req, res) => {

    res.send("AUREX Web Server is Running!");
});

app.listen(3000, () => {
    console.log("Server running at http:\\localhost:3000");
}); 
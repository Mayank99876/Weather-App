const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files correctly
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const appId = "cd08b5f8da16d8f4d7b0e40bfdd86f7d";
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appId}&units=${units}`;

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            // Correctly extract values
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            // Send the response
            const htmlResponse = `
                <html>
                <head>
                    <link rel="stylesheet" href="response.css">
                </head>
                <body>
                    <div class="container">
                        <div class="weather-container">
                            <h1>Weather Forecast</h1>
                            <div>
                                <p>The weather is currently ${weatherDescription}</p>
                                <img src="${imageURL}" alt="Weather Icon">
                                <h1>${temp} °C, ${query}</h1>
                                <p>${new Date()}</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `;
            res.send(htmlResponse);
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});

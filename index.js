const TelegramBot = require( 'node-telegram-bot-api');
const axios = require("axios");
require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;
const openWeatherAPIToken = process.env.WEATHER_API_TOKEN;
const subscriptions = {};


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  console.log(msg);
  console.log(match);

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the weather bot! Type /subscribe to get daily weather updates.');
  });
  bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    // const userInput = msg.text;
    subscriptions[chatId] = true;

    bot.sendMessage(chatId, `You are now subscribed for daily weather updates`);
    bot.sendMessage(chatId,'Enter your city name for daily weather updates')

    bot.on("message",async(msg)=>{
        const userInput = msg.text;
        setTimeout(() => {
            sendWeatherUpdate(chatId,userInput);
          }, 2000); // 5000 milliseconds (5 seconds)

    })
   
  });
  function sendWeatherUpdate(chatId,userInput) {
    // Replace this with actual weather data from your weather API.
    console.log(userInput);
    axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${openWeatherAPIToken}`
      )
      .then((response) => {
        // const weather = response.data.weather[0].description;
        const data = response.data;
      console.log(data);
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15; //converting to degree celsius
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;
      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
        // bot.sendMessage(chatId, `Today's weather: ${weather}`);
        bot.sendMessage(chatId, message);
      })
      .catch((error) => {
        console.error('Failed to fetch weather data:', error.message);
        bot.sendMessage(chatId, "City doesn't exist. Please Enter the City Name Correctly.");
      });
  }
 
const express = require("express")
const TelegramBot = require('node-telegram-bot-api');
// const axios = require("axios")
// const bodyParser = require('body-parser');
const { data } = require("cheerio/lib/api/attributes");
const fs = require("fs")
require("dotenv").config()
const app = express()
app.use(express.json())


const token = process.env.token
const bot = new TelegramBot(token, {polling: true});



calculate = (number_text)=>{
    var user =number_text
        var ListOfElement = [];
        var number = '';
        var opration = '';
        var True = true;
        var ListOfElementop=['**','/','*','-','+']
        var i = 0;
        while (i<user.length){
            if (user[i] == '*' && user[i+1] == '*'){
                opration += user[i];
            }else if ((user[i] == '-' || user[i] == '+' || user[i] == '*' || user[i] == '/') && True){
                opration += user[i]
                ListOfElement.push(parseInt(number));
                ListOfElement.push(opration);
                number ='';
                opration ='';
                True = false;
            }else{
                number += user[i];
                True = true;
            }
            i++
        }
        
        ListOfElement.push(parseInt(number))
        var OprationConditions = false;
        var NewNumber
        while (true){
            if (ListOfElement.length==1){
                break
            }
            
            var j=0
            while (j < ListOfElementop.length){
                i=0
                while(i<ListOfElement.length){
                    if (ListOfElement[i]==ListOfElementop[j]){
                        break
                    }
                    i++ 
                    
                }
                if(i<ListOfElement.length){
                break
                }
                j++;
            }
            var oprator = (ListOfElement[i])
            if (oprator == '**'){
                NewNumber = (ListOfElement[i-1]) ** (ListOfElement[i+1])
                OprationConditions = true;
            }else if(oprator == '/'){
                NewNumber = (ListOfElement[i-1]) / (ListOfElement[i+1])
                OprationConditions = true;
            }else if (oprator == '*' ){
                NewNumber = (ListOfElement[i-1]) * (ListOfElement[i+1])
                OprationConditions = true;
            }else if (oprator == '-' ){
                NewNumber = (ListOfElement[i-1]) - (ListOfElement[i+1])
                OprationConditions = true;
            }else if(oprator == '+' ){
                NewNumber = (ListOfElement[i-1]) + (ListOfElement[i+1])
                OprationConditions = true;
            }
            if (OprationConditions){
                    ListOfElement.splice(i-1,3,Number(NewNumber))
                    OprationConditions = false;
                }
            }

        
        return ListOfElement[0]
}

number_text_checker = (num) =>{
    let checker_string = "1234567890*-+/"
    let condition = true
    for (let i of num){
        if (!(checker_string.includes(i))){
            condition = false
            break
        }
    }
    return condition
}


const init = (bot) =>{
    bot.on('message', (msg) => {
        let message = msg.text.toString()
        let condition = number_text_checker(message)
        if (condition){

            answer = calculate(message)
            if (answer==="NaN"){
                bot.sendMessage(msg.from.id,"Please send a valid Questions")
            }else{
            bot.sendMessage(msg.from.id, "Your answer is " + answer);
            }
        }else{

            // bot.onText(/\/start/, (msg) => {
            //     bot.sendMessage(msg.chat.id, "Welcome");
            //     });  

            var Hi = "hi";
            if (message.toLowerCase().indexOf(Hi) === 0) {
            bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
                }

            var location = "location";
            if (message.indexOf(location) === 0) {
                bot.sendLocation(msg.chat.id,44.97108, -104.27719);
                bot.sendMessage(msg.chat.id, "Here is the point");
        
            }

            var bye = "bye";
            if (message.toLowerCase().includes(bye)) {
            bot.sendMessage(msg.chat.id, "Have a nice day " + msg.from.first_name);
            }
        
            var robot = "I'm robot";
            if (msg.text.indexOf(robot) === 0) {
                bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
            }
            

        }


        });

}
 
app.get("/number/search",async(req,res)=>{
    var name = req.query.name
    var data = fs.readFileSync("./data/file.json","utf-8")
    data = JSON.parse(data)

    search_list = []
    for(let i of data){
        console.log(i.name,name);
        if (i.name.includes(name)){
            search_list.push(i)
        }
    }
    res.send(search_list)
})

app.post("/addNumber",async(req,res)=>{
    var data =fs.readFileSync("./data/file.json","utf-8")
    var post_data = req.body
    if(String(data).includes(String(post_data.mobile))){
        res.send("Already exist")
    }else{
        data = JSON.parse(data)
        data.push(post_data)
        data = JSON.stringify(data,null,4);
        await fs.writeFile('./data/file.json', data, 'utf8', (err) => {
            if (err) {
                console.log(`Error writing file: ${err}`);
                res.send(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`);
                res.sendStatus(200)
            }
        })
    }
    
})

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
    await init(bot)
})

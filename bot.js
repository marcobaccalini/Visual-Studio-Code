const token = '1185795444:AAGFCnOfnDweXokT-0UEbQKoSReGBiAX3xY';
const telegrambot = require("node-telegram-bot-api");
var fs = require('fs');

const bot = new telegrambot(token,
    {
        polling: true
    });

let dati = fs.readFileSync("ricette.json");
let ricette = JSON.parse(dati);


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Buongiorno, questo bot è stato creato apposta per consultare le ricette, aggiungerne di nuove; \n Digitare /help per un elenco dei comandi.");
});

bot.onText(/\/elenco/, (msg) => {
    for (var i = 0; i < ricette.length; i++) {
        bot.sendMessage(msg.chat.id, ricette[i].nome);
    }
});

bot.onText(/\/ricerca/, (msg) => {
    let ricerca = "";
    bot.sendMessage(msg.chat.id, "Digitare nome ricetta");
    bot.on("message", (msg) => {
        ricerca = msg.text.toString().toLowerCase();
        for (var i = 0; i < ricette.length; i++) {
            if (ricette[i].nome == ricerca) {
                let ricercafin = ricette[i];
                bot.sendMessage(msg.chat.id, JSON.stringify(ricercafin));
                //console.log(ricette[i]); 

            }
        }
    });
});

bot.onText(/\/modifica/, (msg) => {
    bot.sendMessage(msg.chat.id, "Digitare in questo ordine: nome ricetta da modificare, numero parametro da modificare, nuovo contenuto");
    bot.on("message", (msg) => {
        let mod = msg.text.toString().split(",");

        if (mod[1] == "1") {
            for (var i = 0; i < ricette.length; i++) {
                if (ricette[i].nome == mod[0]) {
                    ricette[i].nome = mod[2];
                    let jsontostring = JSON.stringify(ricette);
                    fs.writeFileSync("ricette.json", jsontostring);
                    bot.sendMessage(msg.chat.id, "Parametro aggiornato");
                }
            }
        } else if (mod[1] == "2") {
            for (var i = 0; i < ricette.length; i++) {
                if (ricette[i].nome == mod[0]) {
                    ricette[i].categoria = mod[2];
                    let jsontostring = JSON.stringify(ricette);
                    fs.writeFileSync("ricette.json", jsontostring);
                    bot.sendMessage(msg.chat.id, "Parametro aggiornato");
                }
            }

        } else if (mod[1] == "3") {
            for (var i = 0; i < ricette.length; i++) {
                if (ricette[i].nome == mod[0]) {
                    ricette[i].ingredienti = mod[2];
                    let jsontostring = JSON.stringify(ricette);
                    fs.writeFileSync("ricette.json", jsontostring);
                    bot.sendMessage(msg.chat.id, "Parametro aggiornato");
                }
            }

        } else if (mod[1] == "4") {
            for (var i = 0; i < ricette.length; i++) {
                if (ricette[i].nome == mod[0]) {
                    ricette[i].procedimento = mod[2];
                    let jsontostring = JSON.stringify(ricette);
                    fs.writeFileSync("ricette.json", jsontostring);
                    bot.sendMessage(msg.chat.id, "Parametro aggiornato");
                }
            }

        }



    });
});

bot.onText(/\/cancella/, (msg) => {
    let da_cancellare = "";
    bot.sendMessage(msg.chat.id, "Digita nome ricetta che si vuole cancellare");
    bot.on("message", (msg) => {
        da_cancellare = msg.text.toString();
        let cerca = ricette.findIndex((ric) => (ric.nome == da_cancellare));

        if (cerca >= 0) {
            ricette.splice(cerca, 1)
            let jsontostring = JSON.stringify(ricette);
            fs.writeFileSync("ricette.json", jsontostring)
            bot.sendMessage(msg.chat.id, "Ricetta cancellata");
        }

    });

});



bot.onText(/\/aggiungi/, (msg) => {
    let ava = 0;
    let nome = "";
    let categoria1 = "primi";
    let categoria2 = "secondi";
    let categoria3 = "dolci";
    let ingredienti = [];
    let procedimento = "";

    bot.sendMessage(msg.chat.id, "Digitare nome ricetta");

    bot.on("message", (msg) => {
        if (ava == 0) {
            nome = msg.text.toString();
            ava++;
            bot.sendMessage(msg.chat.id, "Selezionare una categoria");
        } else if (ava == 1) {

            if (msg.text.indexOf(categoria1) === 0) {
                bot.sendMessage(msg.chat.id, "Hai selezionato la categoria primi");
                catfin = categoria1;
                ava++;
            }
            if (msg.text.indexOf(categoria2) === 0) {
                bot.sendMessage(msg.chat.id, "Hai selezionato la categoria secondi");
                catfin = categoria2;
                ava++;
            }
            if (msg.text.indexOf(categoria3) === 0) {
                bot.sendMessage(msg.chat.id, "Hai selezionato la categoria dolci");
                catfin = categoria3;
                ava++;
            }
            bot.sendMessage(msg.chat.id, "Inserisci gli ingredienti");

        } else if (ava == 2) {
            let stop = "stop";

            if (msg.text.indexOf(stop) === 0) {
                ava++;
                bot.sendMessage(msg.chat.id, "Allora proseguiamo col procedimento");
            }
            else {
                ingredienti.push(msg.text.toString());
            }
        } else if (ava == 3) {
            procedimento = msg.text.toString();
            ric = {
                'id': ricette.length + 1,
                'nome': nome,
                'categoria': catfin,
                'ingredienti': ingredienti,
                'procedimento': procedimento
            }
            ricette.push(ric);
            let jsontostring = JSON.stringify(ricette);
            fs.writeFileSync("ricette.json", jsontostring);
            bot.sendMessage(msg.chat.id, "Ricetta aggiunta :)");
        }

    });

});




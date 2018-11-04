const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const ytdl = require("ytdl-core");
const banco = require("./banco.json");
const ranked = require("./ranked.json");
const fs = require("fs");
const smite = require('smitescript');

const moment = require('moment');
const axios = require('axios');
const md5 = require('md5');
 
//comandos para smite

//deve preencher com suas credencias 
const devId ='';
const authId = '';

let createdsecsao;
var mestre = 'profano';
var qual = 'ou';

//comandos para o x1
let p1 =0;
let p2 =0;
let valorX1 =0;


const jogo = "fortnite";


function Play(connection, message){
    var server = servers[message.guild.id];""
    server.dispatcher = connection.playStream(ytdl(server.queue[0],{filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function(){
        if(server.queue[0]){
            Play(connection, message);
        }

        else{
            connection.disconnect();
        }

    })
}
global.servers = {};

client.on("ready", ()=>{
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setGame(`Digite -help || Eu estou em ${client.guilds.size} servidores rodando em Node.js`);

});

client.on("guildCreate", guild =>{
    console.log(`O bot entrou nos servidores: ${guild.name} (id: ${guild.id}). População ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.size} Servidores`);

});

client.on("guildDelete", guild =>{
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${cliente.guilds.size} servers`);

});

client.on("message", async message =>{
   if(message.author.bot) return;
   if(message.channel.type ==="dm")return;


  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();

  if(comando === "ping"){
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A latencia da API é ${Math.round(client.ping)}ms`);

}
  if (comando === "play") {
      const voiceChannel = message.member.voiceChannel;
      if(!voiceChannel) return message.channel.send("Você nem está em um canal de voz, para de querer trolar!");
      const permissions = voiceChannel.permissionsFor(message.client.user);

      if(!permissions.has('CONNECT')){
        return message.channel.send("não tenho permissão para entrar em seu canal!");

      }

      if (!permissions.has("SPEAK")) {
          return message.channel.send("Eu não tenho permissão de falar aqui...");
          
      }

      try {
          var connection = await voiceChannel.join();
      } catch (error) {
          console.log("Não foi possivel conectar ao canal");
          return message.channel.send("Não consegui entrar no canal de voz");
          
      }

      const dispatcher = connection.playStream(ytdl(args[0]))
      .on('end', () =>{
            console.log('song ended');
            voiceChannel.leave();
      })
      .on('error', error =>{
            console.log("deu ruim");

      });
      dispatcher.setVolumeLogarithmic(5/5);

  }

  if (comando ==="join") {

    if (message.member.voiceChannel) {
        
        if (!message.guild.voiceConnection) {

            if (!servers[message.guild.id]) {

                servers[message.guild.id] = {queue: []}
                
            }
            var server = servers[message.guild.id]
            message.member.voiceChannel.join()
                .then(connection =>{
                    var server = servers[message.guild.id];
                    message.reply("Entreiii");
                    server.queue.push(args);
                    Play(connection, message);


                })
            
        }
    }
     else{
        message.reply("Você não esta em um canal de voz ou eu não tenho permissão para entrar ai, não trola!!!");

     }
}

    if (comando ==="leave") {
     message.member.voiceChannel.leave();
     
     
     
    }
    if (message.content.toLowerCase().includes(jogo)) {
        

        message.channel.send("Mals, estou ocupado aqui, não posso jogar!");

       
    }
   
    if (comando ==="flod") {
        
        
       const alou =  message.content.split(" ");

       

       let qq = alou[1]; //quantidade

       let string = "";
       

       let tamanho = alou.length;

       for (let i = 2; i < alou.length; i++) {
            string += " "+ alou[i];
           
       }

      let cont  = 1;

      while (cont <= qq) {
      await message.channel.send(string);
          cont ++;
          
      }
      
    }

    if (message.content.toLowerCase().includes(mestre)) {
        

        message.author.sendMessage("Pare de falar do meu mestre!");

        client.users.get('366240476174614529').send(`Estão falando de você Mestre!!! \n \t**servidor: ${message.guild.name} \n
        pessoa: ${message.author}**`);
    }

   
    
    if (comando ==="open") {
        let targetUser = message.guild.member;
        if(!targetUser){
            message.channel.send("Não consegui encontrar esse usuario.");
            return;
        }
        if(!banco[message.author.id]){
            banco[message.author.id] = {
                bank: 1000
            };

        }
        
        
        fs.writeFile("./banco.json",JSON.stringify(banco), (err)=>{
            if(err){
                console.log(err);

            }

        });

        message.reply("Sua conta foi aberta com sucesso, pegue 1000R$ pela preferência \n Que Começe As Apostas!!!");
     
    }

    

    if (comando =="apostar") {

        if(!banco[message.author.id]){
            message.channel.send("Você não abriu conta no BANK ainda para jogar!!! Digite -open");
        }
        let saldo = banco[message.author.id].bank;
        let rando = Math.floor(Math.random() *2) ;
        let str = message.content.split(" "); 
        
        let apostando =str[1];

       

        if(apostando===undefined || apostando <=0 || isNaN(apostando) || apostando > saldo){
           return  message.channel.send("você deve informar um numero válido maior que 0 para apostar");
        }

        if (rando === 1) {
            saldo = parseInt(saldo) + parseInt(apostando);
            message.reply(`Você apostou ${apostando} e ganhou, seu saldo agora é ${saldo}R$`);
        } 
        if (rando === 0) {
            saldo = parseInt(saldo) - parseInt(apostando);
            message.reply(`Você apostou ${apostando} e perdeu, seu saldo agora é ${saldo}R$`);
        }
        
        banco[message.author.id].bank = saldo;

        fs.writeFile("./banco.json",JSON.stringify(banco), (err)=>{
            if(err){
                console.log(err);

            }

        });
        

    }
    if(comando =="elo"){
        if(!ranked[message.author.id]){
            ranked[message.author.id] = {
             Conquest: 'Unranked', Joust : 'Unranked', Duel: 'Unranked'

            };

        }

        fs.writeFile("./ranked.json",JSON.stringify(ranked), (err)=>{
            if(err){
                console.log(err);

            }

        });
        
        let elo  = new Discord.RichEmbed().
        setTitle(message.author.username+ " Smite Ranked")
        .addField("Conquest: ", `${ranked[message.author.id].Conquest}`)
        .addField("Joust: ", `${ranked[message.author.id].Joust}`)
        .addField('Duel:', `${ranked[message.author.id].Duel}`)
        .setColor('#0022AB')
        .setThumbnail("https://pbs.twimg.com/media/DUgMzCpWAAYgIXf.png")
        .setFooter("Digite -setconq -setjoust -setduel para alterar seu elo");

        
    

        message.channel.send(elo);

    }

    if(comando == "setconq"){
        let id  = message.author.id;
        let s = message.content.split(" ");

        if (!ranked[id]) {
            message.channel.send('Você precisa utilizar o comando -elo');
            return;
        }

        if (s.length == 1) {
            message.channel.send('Você deve informar o elo após o comando, exemplo: "-setconq bronze "');
            return;
            
        }
       
        let el = '';

        for (let index = 1; index < s.length; index++) {
            el += " " + s[index];
            
        }

        ranked[id].Conquest = el;
        
        fs.writeFile("./ranked.json",JSON.stringify(ranked), (err)=>{
            if(err){
                console.log(err);

            }

        });

    }
    


    if(comando == "setjoust"){
        
        let id  = message.author.id;
        let s = message.content.split(" ");

        if (!ranked[id]) {
            message.channel.send('Você precisa utilizar o comando -elo');
            return;
        }

        if (s.length == 1) {
            message.channel.send('Você deve informar o elo após o comando, exemplo: "-setjoust bronze "');
            return;
            
        }
       
        let el = '';

        for (let index = 1; index < s.length; index++) {
            el += " " + s[index];
            
        }

        ranked[id].Joust = el;
        
        fs.writeFile("./ranked.json",JSON.stringify(ranked), (err)=>{
            if(err){
                console.log(err);

            }

        });


    }

    if(comando == "setduel"){
        
        let id  = message.author.id;
        let s = message.content.split(" ");

        if (!ranked[id]) {
            message.channel.send('Você precisa utilizar o comando -elo');
            return;
        }
      
        if (s.length == 1) {
            message.channel.send('Você deve informar o elo após o comando, exemplo: "-setduel bronze "');
            return;
            
        }
       
        let el = '';
        

        for (let index = 1; index < s.length; index++) {
            el += " " + s[index];

            
        }

        ranked[id].Duel = el;
        
        fs.writeFile("./ranked.json",JSON.stringify(ranked), (err)=>{
            if(err){
                console.log(err);

            }

        });


    }
        
    
    if (comando =="saldo") {
        
            if(!banco[message.author.id]){
            message.channel.send("Você não abriu conta no BANK ainda para jogar!!! Digite -open")
        }

        let sal = banco[message.author.id].bank;

        let SaldoEmbed  = new Discord.RichEmbed().
            setTitle(message.author.username+ " BANK")
            .addField("Saldo: ", `${sal}R$`);
        
    
       message.channel.send(SaldoEmbed);
    }

    if(comando == "ver_saldo"){
       let targetId = message.mentions.users.first().id;
       let  targetName = message.mentions.users.first().username;

       if(!banco[targetId]){
        message.channel.send("Este Jovenzinho(a)  ainda não abriu conta com o comando -open");
        return;
       }
       let saldo = banco[targetId].bank;
        let SaldoEmbed  = new Discord.RichEmbed().
            setTitle(`${targetName}`+ " BANK")
            .addField("Saldo: ", `${saldo}R$`);

            message.channel.send(SaldoEmbed);

    }
 

    if(comando  == "msg"){
       let m = await message.channel.send(":mailbox_with_no_mail:          :envelope:");
       m.edit(":mailbox_with_no_mail:         :envelope:");
       m.edit(":mailbox_with_no_mail:        :envelope:");
       m.edit(":mailbox_with_no_mail:       :envelope:");
       m.edit(":mailbox_with_no_mail:      :envelope:");
       m.edit(":mailbox_with_no_mail:     :envelope:");
       m.edit(":mailbox_with_no_mail:    :envelope:");
       m.edit(":mailbox_with_no_mail:   :envelope:");
       m.edit(":mailbox_with_no_mail:  :envelope:");
       m.edit(":mailbox_with_no_mail: :envelope:");
       m.edit(":mailbox_with_no_mail::envelope:");
       m.edit(":mailbox_with_mail:");
       m.edit(":mailbox_closed:");
       
    }
    

    if(comando == "depositar"){

       let praQuem =  message.mentions.users.first().id;
       let string = message.content.split(" ");
       let saldo  = banco[praQuem].bank;
       
      var valor =  string[1];

       if (message.author.id ==="366240476174614529") {
           if(isNaN(valor)){
               message.channel.send("Mestre você deve informar um NUMERO válido");
               return;
           }
            saldo = parseInt(saldo) + parseInt(valor);
             banco[praQuem].bank = saldo;

             fs.writeFile("./banco.json",JSON.stringify(banco), (err)=>{
                if(err){
                    console.log(err);
    
                }
    
            });
             
       }
       else{
           message.reply("Apenas o mestre <@366240476174614529> pode usar este comando");
           return;
       }
       
        message.channel.send(`<@${praQuem}>, sua conta foi creditada com sucesso, seu saldo atual é igual a: ${saldo}`);

    }

    if(comando =="x1"){

        let contraQuem = message.mentions.users.first().id;
        let string  = message.content.split(" ");
        valorX1 = string[1];

        if (!banco[contraQuem]) {
            message.channel.send(`<@${contraQuem}> não possui conta no bank, ele deve usar o comando -open para abrir!!!`);
            
        }

        if (banco[message.author.id].bank < valorX1) {
            message.channel.send("Você nem tem esse valor no Bank!");
            valorX1 =0;
            return;
            
        }
        if(banco[contraQuem].bank <valorX1){
            message.channel.send("O Adversário não possui esse valor no Bank")
            valorX1 = 0;
            return;
        }
       

        p1 = message.author.id;
        p2 = contraQuem;

        message.channel.send(`<@${p2}>, O Membro <@${p1}> te chamou para o X1 valendo ${valorX1}R$, Digite -aceitar`);

    }

    if (comando == "aceitar") {

        if(message.author.id == p1){
         message.channel.send("Você não pode aceitar o próprio x1");
         return;
        }

        if (message.author.id != p2) {
            message.channel.send("Ninguem o desafiou!!!");
            return;
            
        }

        if (message.author.id == p2) {

            let randow = Math.floor(Math.random() *2);
           
            if (randow ==0 ) {
                //significa que o player 1 ganhou.
                banco[p1].bank = parseInt(banco[p1].bank) + parseInt(valorX1);
                banco[p2].bank = parseInt(banco[p2].bank) - parseInt(valorX1);
                //ganhador
                message.channel.send(`O <@${p1}> Ganhou o x1`);
                //novos saldos
                message.channel.send(`Saldo do <@${p1}> -> ${banco[p1].bank}`);
                message.channel.send(`Saldo do <@${p2}> -> ${banco[p2].bank}`);
            }

            if (randow ==1) {
                //significa que o player 2 ganhou.
                banco[p2].bank = parseInt(banco[p2].bank) + parseInt(valorX1);
                banco[p1].bank = parseInt(banco[p1].bank) - parseInt(valorX1);

                message.channel.send(`O <@${p2}> Ganhou o x1`);
                //novos saldos
                message.channel.send(`Saldo do <@${p1}> -> ${banco[p1].bank}`);
                message.channel.send(`Saldo do <@${p2}> -> ${banco[p2].bank}`);
                
            }

            fs.writeFile("./banco.json",JSON.stringify(banco), (err)=>{
                if(err){
                    console.log(err);
    
                }
    
            });
            
        }
       
    }
    if (message.content.toLowerCase().includes(qual)){
        if (message.content.startsWith('-')) {
            return;
            
        }

        const umOuOutro = message.content.split("ou");
        let ale =Math.floor(Math.random() *umOuOutro.length);
        
        return message.channel.send(umOuOutro[ale]);
        
    }

    //brincando com a api smite

    if(comando == 'player'){

        let msg = message.content.split(' ');
        let playerTarget = msg[1];
        let caractEspecial = encodeURI(playerTarget);
        


let utcTime = moment()
  .utc()
  .format('YYYYMMDDHHmmss');

const hash = md5(devId + "createsession" + authId + utcTime);

const hash1 = md5(devId + "getplayer" + authId + utcTime);

const hash2 = md5(devId + 'getgods' + authId + utcTime); 

  const data = await axios.get('http://api.smitegame.com/smiteapi.svc/pingjson');
  console.log(data.data);

  let string = 'http://api.smitegame.com/smiteapi.svc';
  
  try {
        if(createdsecsao == undefined){
       createdsecsao = await axios.get(`${string}/createsessionJson/${devId}/${hash}/${utcTime}`);
      console.log(createdsecsao.data.session_id);
        }else{
             console.log('Você já tem uma secção iniciada');
            
        }
      let getPrayer = await axios.get(`${string}/getplayerjson/${devId}/${hash1}/${createdsecsao.data.session_id}/${utcTime}/${caractEspecial}`);
        

      let getDeus = await axios.get(`${string}/getgodsjson/${devId}/${hash2}/${createdsecsao.data.session_id}/${utcTime}/10`);
        
       
        
        
    
        let playerRanked  = new Discord.RichEmbed().
        setTitle(`Nick: ${getPrayer.data[0].Name}`)
        
        .addField("Level: ", `${getPrayer.data[0].Level}`)
        .addField("Mastery Level: ", `${getPrayer.data[0].MasteryLevel}`)
        .addField('Ranked Conquest:', `Elo: ${verElo(getPrayer.data[0].RankedConquest.Tier)}
         Pontos: ${getPrayer.data[0].RankedConquest.Points}
         Wins: ${getPrayer.data[0].RankedConquest.Wins}
         Losses: ${getPrayer.data[0].RankedConquest.Losses}`)
        .addField('Ranked Joust:', `Elo: ${verElo(getPrayer.data[0].RankedJoust.Tier)}
         Pontos: ${getPrayer.data[0].RankedJoust.Points}
         Wins ${getPrayer.data[0].RankedJoust.Wins}
         Losses: ${getPrayer.data[0].RankedJoust.Losses}`)
        .addField('Ranked Duel: ',`Elo: ${verElo(getPrayer.data[0].RankedDuel.Tier)}
        Pontos: ${getPrayer.data[0].RankedDuel.Points}
        Wins ${getPrayer.data[0].RankedDuel.Wins}
        Losses: ${getPrayer.data[0].RankedDuel.Losses}`)
        .setFooter('Data provided by Hi-Rez. © 2015 Hi-Rez Studios, Inc. All rights reserved.')
        .setColor('#0022AB')
        .setThumbnail('https://pbs.twimg.com/media/DUgMzCpWAAYgIXf.png');

        message.channel.send(playerRanked);

        
        
    console.log(createdsecsao.data);
  } catch (error) {
      console.log(error);
  }
  
}

//function que pega um numero e devolve um rank
   function verElo(umNumero){
       let num = parseInt(umNumero);
    
    switch (num) {
        case 1:
             elor = 'Bronze V';
             break;
        case 2:
             elor = 'Bronze IV';
             break;
        case 3:
             elor = 'Bronze III';
             break;
        case 4:
             elor = 'Bronze II';
             break;
        case 5:
             elor = 'Bronze I';
             break;
        case 6:
             elor = 'Silver V';
             break;
        case 7:
             elor = 'Silver IV';
             break;
        case 8:
             elor = 'Silver III';
             break;
        case 9:
             elor ='Silver II';
             break;
        case 10:
             elor = 'Silver I';
             break;
        case 11:
             elor = 'Gold V';
             break;
        case 12:
             elor = 'Gold IV';
             break;
        case 13:
             elor = 'Gold III';
             break;
        case 14:
             elor = 'Gold II';
             break;
        case 15:
             elor = 'Gold I';
             break;
        case 16:
             elor = 'Platinum V';
             break;
        case 17:
             elor = 'Platinum IV';
             break;
        case 18:
             elor = 'Platinum III';
             break;
        case 19:
             elor = 'Platinum II';
             break;
        case 20:
             elor = 'Platinum I';
             break;
        case 21:
             elor = 'Diamond V';
             break;
        case 22:
             elor = 'Diamond IV';
             break;
        case 23:
             elor = 'Diamond III';
             break;
        case 24:
             elor = 'Diamond II';
             break;
        case 25:
             elor = 'Diamond I';
             break;
        case 26:
             elor = 'Master';
             break;
        case 27:
             elor = 'GrandMaster';
             break;


        default: elor = 'Unranked';
        break;
            
    }
    return elor;
}

if (comando == 'help') {
    
    let helpComandos = new Discord.RichEmbed().setTitle('Lista de Comandos do DiscordBot')
    .setColor('#0022AB')
    .setThumbnail('https://upload.wikimedia.org/wikipedia/pt/3/39/R2-D2_Droid.png')
    .addField('BÁSICOS','-Help: Chama essa lista de comandos.\n-ping: Retorna o ping.\n-flod: Floda determinada mensagem n vezes ex: -flod 10 mensagem.\n-msg: Comando simples que mostra uma mensagem sendo entregue')
    .addField('JOGOS','-open: Abre uma conta no "bank".\n-apostar: Aposta determinado valor ex: -apostar 10.\n-x1: Chama um determinado membro para o x1 ex: -x1 <@366240476174614529> 10\n-aceitar: Aceita o x1.\n-saldo: Retorna o seu saldo no "bank"\n-ver_saldo: Retorna o saldo do "bank" de um membro ex: -ver_saldo <@366240476174614529>\n-depositar: deposita no "bank" de determinado membro, esta setado para só funcionar com o <@366240476174614529> ex: -depositar 10 <@366240476174614529>')
    .addField('SMITE','-elo: retorna seu elo que foi setado manualmente\n-player: retorna status do player usando a API da HI-REZ;\n')
    .addField('MÚSICAS','-join: Faz o bot entrar em um chat voice.\n-leave: Faz o bot sair de um voice chat.\n-play: faz o bot tocar musica do youtube \nex: -play https://www.youtube.com/watch?v=7Lawn-O1Kno');
    message.channel.send(helpComandos);
}


});

client.login(config.token);
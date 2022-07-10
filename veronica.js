/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const cors = require('cors');
const express = require('express');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(express.json());

//API PHP
const API = 'http://localhost:4000/projeto_tom3/skinder3/API/BOT/index.php';
const TOKEN = 562562;

const wppconnect = require('@wppconnect-team/wppconnect');

//porta
const port = process.env.PORT || 4001;

//rota root
app.get('/', (req, res) => {
    const ret = { msg: '🙋🏻‍♀️ Bem vindo a Verônica API V2.' };
    return res.json(ret);
});

wppconnect
    .create({
        session: 'VERONICA_V2', //name of session
        multidevice: false, // for version not multidevice use false.(default: true)
        //headless: false,
        //useChrome: false,
        //browserArgs: ['--start-maximized', '--app=https://web.whatsapp.com', '--force-dark-mode']
    })
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {

    function sendMessage(number, message) {
        client
            .sendText(number, message)
            .then((result) => {
                //console.log('Resultado: ', result); //return object success
                return true;
            })
            .catch((erro) => {
                console.error('Erro: ', erro); //return object error
                return false
            });
        return true;
    }

    function sendList(number, question, legend, buttons) {

        const lst = [];
        const limit = 10; //limita a quantidade de botoes mobile

        var respostas = '';

        for (let i = 0; i < buttons.length; i++) {

            respostas += '\n-> ' + buttons[i] + '.';
        }

        var message = question + '\n\n_Responda com:_ ' + respostas;

        client
            .sendText(number, message)
            .then((result) => {
                //console.log('Resultado: ', result); //return object success
                return true;
            })
            .catch((erro) => {
                console.error('Erro: ', erro); //return object error
                return false
            });

        /*
        for (let i = 0; i < buttons.length; i++) {

            if (i <= limit - 1) {
                lst[i] =
                {
                    title: buttons[i],
                    description: " ",
                }
            }

        }

        const list = [
            {
                title: question.substr(9),
                rows: lst
            }
        ];
        */

        //console.log(list);

        /*client.sendListMenu(number, question, '...', legend, 'Toque aqui para escolher', list)
            .then((result) => {
                //console.log('Result: ', result); //return object success
                return true;
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                return false;
            });
            */

        return true;
    }

    function sendButtons(number, question, legend, buttons) {

        const btt = [];
        const limit = 3; //limita a quantidade de botoes mobile
        var respostas = '';

        for (let i = 0; i < buttons.length; i++) {

            respostas += '\n-> ' + buttons[i] + '.';

            /*
            if (i <= limit - 1) {
                btt[i] =
                {
                    "buttonText": {
                        "displayText": buttons[i]
                    }
                }
            }
            */
        }

        var message = question + '\n\n_Responda com:_ ' + respostas;

        client
            .sendText(number, message)
            .then((result) => {
                //console.log('Resultado: ', result); //return object success
                return true;
            })
            .catch((erro) => {
                console.error('Erro: ', erro); //return object error
                return false
            });

        /*
        client.sendMessageOptions(number, question, btt, legend)
            .then((result) => {
                //console.log('Result: ', result); //return object success
                return true;
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                return false;
            });
        */

        return true;
    }

    function sendReply(number, message, id) {

        client.reply(
            number, message, id
        ).then((result) => {
            //console.log('Result: ', result); //return object success
            return true;
        }).catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
            return false;
        });
        return true;
    }

    function sendImage(number, message, image) {
        client
            .sendImage(
                number,
                image,
                'Imagem',
                message
            )
            .catch((erro) => {
                console.error('Erro: ', erro); //return object error
                return false
            });
        return true;
    }

    function sendLocation(number, legend, lat, lon) {
        client
            .sendLocation(number, lat, lon, legend)
            .then((result) => {
                //console.log('Result: ', result); //return object success
                return true;
            }).catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
                return false;
            });
        return true;
    }

    function verificarToken(token) {
        if (token != TOKEN) {
            return false;
        }
        return true;
    }

    //enviar mensagem de texto pela rota GET /send-message
    app.get('/send-message', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const message = req.query.msg;

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendMessage(number, message)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    //enviar botao de opcoes pela rota GET /send-button
    app.get('/send-button', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const question = req.query.msg;
        const legend = req.query.legend;
        const buttons = JSON.parse(req.query.buttons);

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendButtons(number, question, legend, buttons)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    //enviar lista ordenada de resposta pela rota GET /send-list
    app.get('/send-list', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const question = req.query.msg;
        const legend = req.query.legend;
        const buttons = JSON.parse(req.query.buttons);

        //console.log(buttons);

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendList(number, question, legend, buttons)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    //enviar mensagem de resposta pela rota GET /send-reply
    app.get('/send-reply', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const message = req.query.msg;
        const id = req.query.id;

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendReply(number, message, id)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    //enviar imagem de resposta pela rota GET /send-image
    app.get('/send-image', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const message = req.query.msg;
        const image = req.query.img;

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendImage(number, message, image)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    //enviar localizacao de resposta pela rota GET /send-location
    app.get('/send-location', (req, res) => {

        const token = req.query.token;
        const number = req.query.to;
        const legend = req.query.legend;
        const lat = req.query.lat;
        const lon = req.query.lon;

        //digitando..
        client.startTyping(number);

        if (!verificarToken(token)) {
            const ret = { msg: 'Token inválido.' };
            return res.json(ret);
            process.exit(1);
        };

        if (sendLocation(number, legend, lat, lon)) {
            const ret = { msg: 'Mensagem enviada com sucesso para ' + number };
            return res.json(ret);
        } else {
            const ret = { msg: 'Mensagem não enviada para ' + number };
            return res.json(ret);
        }

    });

    client.onAnyMessage(message => {

        var operador = '';

        //define o tipo de operador
        if (message.self == 'out' && message.text.substr(0, 2) != '*_') {

            //notifica se atendente para pausar a Verônica
            operador = 'Atendente';

            var contact = new Object();
            contact.number = message.to;
            //contact.name = message.sender.name;

            var chat = new Object();
            chat.uid = message.id;
            chat.body = message.body;

            axios.post(API, {
                token: TOKEN,
                event: message.type,
                contact: contact,
                chat: chat,
                operador: operador,
            })
                .then(function (response) {
                    //console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (message.self == 'in') {
            operador = 'Usuário';
        }

        if (message.self == 'out' && message.text.substr(0, 2) == '*_') {
            operador = 'Verônica';
        }

    });

    //respondendo mensagem enviada
    client.onMessage((message) => {

        var operador = 'Verônica'; //pausada ou não
        var contact = new Object();
        contact.number = message.from
        contact.name = message.sender.name

        var chat = new Object();
        chat.uid = message.id
        chat.body = message.body

        axios.post(API, {
            token: TOKEN,
            event: message.type,
            contact: contact,
            chat: chat,
            operador: operador,
        })
            .then(function (response) {
                //console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    });

    //startando o servidor
    app.listen(port, () => {
        console.log('Servidor rodando em porta:' + port);
    })

}
import express from "express";
import aws from "aws-sdk";
import path from "path";

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const app = express()
const pasta = path.join(process.cwd());

aws.config.update({
    region: 'sa-east-1',
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
});

const sqs = new aws.SQS();

app.use(express.static(pasta));

app.post('/solicitar_imagens', (req, res) => {

    const qtdImagens = parseInt(req.body.qtdImagens);

    for (let i = 0; i < qtdImagens; i++) {
        sqs.sendMessage({
            MessageBody: "Gerar Imagem!",
            QueueUrl: ""
        }, (error, data) => {
            if (error) {
                console.error("Erro: " + error);
            } else {
                console.error("Mensagem enviada com sucesso, id: " + data.MessageId);
            }
        })
    }

    console.log(req.body);
    res.json({ body: req.body, ok: true });
})

app.listen(3000, () => {
    console.log('App rodando na porta 3000!');
});
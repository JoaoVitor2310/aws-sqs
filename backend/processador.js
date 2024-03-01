import fs from "fs";
import aws from 'aws-sdk';
import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import fetch from 'node-fetch';

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

aws.config.update({
    region: 'sa-east-1',
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
});

const sqs = new aws.SQS();

const gerarImagem = async (nomeArquivo) => {
    try {
        const response = await fetch('https://cataas.com/cat');
        const buffer = await response.arrayBuffer();
        await fs.promises.writeFile(`imgs/${nomeArquivo}.png`, Buffer.from(buffer));
        console.log('Imagem gerada com sucesso:', nomeArquivo);
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
    }
};

// gerarImagem("teste");
console.log('Foto gerada!');

const processar = () => {
    sqs.receiveMessage({
        MaxNumberOfMessages: 10, // Máximo de mensagens a cada requisição(10 é o máximo)
        QueueUrl: "https://sqs.sa-east-1.amazonaws.com/853030057037/geradorImagens", // Endereço da fila
        WaitTimeSeconds: 10 // Tempo buscando mensagens no servidor, quanto maior, mais mensagens.
    }, (error, data) => {
        if (error) {
            console.error(error);
        } else if (data.Messages) {
            console.log('Mensagens recebidas: ' + data.Messages.length); // Imprime a quantidade de mensagens
            data.Messages.forEach(element => {
                gerarImagem(element.MessageId); // Para cada mensagem, iremos gerar uma imagem!
                sqs.deleteMessage( // Depois de gerar a imagem, vamos deletar a mensagem
                    {
                        QueueUrl: "https://sqs.sa-east-1.amazonaws.com/853030057037/geradorImagens",
                        ReceiptHandle: element.ReceiptHandle
                    }, (error, data) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Deletou com sucesso!');
                        }
                    })
            })
        }
    })
}

cron.schedule('*/5 * * * * *', () => { // Executa o processar a cada 5 segundos para manter ele no ar
    console.log('Processando!');
    processar();
})
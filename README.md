# API AWS SQS com geração de imagens

### API com sistema de mensageria utilizando Node, AWS SQS e Cron jobs. 

O intuito dessa API é aprender e colocar em prática o sistema de mensageria da Amazon, o AWS SQS. O frontend foi feito de forma simples somente para gerar as requisições, já o backend se comunica com o SQS como produtor e depois como consumidor, para utilizar as mensagens  e depois apagar. Também foi utilizado nesse projeto manipulação de imagens e tarefas cron.

### Como funciona?
O frontend escolhe quantas imagens(de gato rs) serão geradas e envia para o nosso backend.  
Já o nosso pequeno servidor node, tem o objetivo de enviar para a AWS as mensagens. Além disso ele também irá a cada 5 segundos(cron job) mandar requisições para o SQS para checar se tem mensagens na fila, e para cada mensagem ele irá gerar uma imagem, salvá-la em /imgs e deletar a mensagem da fila! Finalizando o processo de gerar essas imagens.


### Para executar:
- Fazer o clone do repositório: ```git clone https://github.com/JoaoVitor2310/aws-sqs.git```
- Entrar no diretório: ```cd aws-sqs/backend```
- Configurar o arquivo .env com as credenciais do SQS
- Rodar ```node processador.js``` em um terminal
- Rodar ```node servidor.js``` em outro terminal
- Abrir o arquivo index.html  
Pronto!

import config from './mqttConfig.js';

let client;

function connectMQTT() {
    client = mqtt.connect(config.connectUrl, {
        clientId: config.client_Id,
        username: config.username,
        password: config.password,
        rejectUnauthorized: false,
    });

    client.on('connect', () => {
        console.log('Connected to HiveMQ!');
    });

    client.on('error', (err) => {
        console.log('Connection error:', err);
    });
}

function subscribeToTopic(topic, callback) {
    // Função para subscrever a um tópico e ouvir as mensagens
    client.subscribe([topic], (err) => {
        if (err) {
            console.log('Error subscribing:', err);
        } else {
            console.log(`Subscribed to topic ${topic}`);
        }
    });

    client.on('message', (topic, message) => {
        callback(message);
    });
}

function unsubscribeFromTopic(topic) {
    // Função para cancelar a inscrição em um tópico
    client.unsubscribe([topic], (err) => {
        if (err) {
            console.log('Error unsubscribing:', err);
        } else {
            console.log(`Unsubscribed from topic ${topic}`);
        }
    });
}

function publishMessage(topic, message) {
    // Função para publicar uma mensagem em um tópico
    client.publish(topic, message, { qos: 1, retain: false }, (error) => {
        if (error) {
            console.error(error);
        }
    });
}

// Exporta as funções para serem usadas em outros arquivos
export { connectMQTT, subscribeToTopic, unsubscribeFromTopic, publishMessage };

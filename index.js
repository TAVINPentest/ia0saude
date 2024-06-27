const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dialogflow = require('@google-cloud/dialogflow');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Configuração do Dialogflow
const projectId = 'ai-sdod'; // Substitua pelo seu project ID do Dialogflow
const sessionId = '123456';
const languageCode = 'pt-BR';
const sessionClient = new dialogflow.SessionsClient();

// Registro de usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
    }
});

// Login de usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});


// Webhook para interação com o Dialogflow
app.post('/webhook', async (req, res) => {
    const query = req.body.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.error('Authorization header missing');
        return res.status(401).send('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: languageCode,
                },
            },
        };

        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        const fulfillmentText = result.fulfillmentText;

        await db.execute('UPDATE Users SET interactions = JSON_ARRAY_APPEND(interactions, "$", JSON_OBJECT("query", ?, "response", ?, "timestamp", CURRENT_TIMESTAMP)) WHERE id = ?', [query, fulfillmentText, userId]);

        exec(`python text_to_speech.py "${fulfillmentText}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                res.status(500).send('Error generating speech.');
                return;
            }

            if (stderr) {
                console.error(`Python script error: ${stderr}`);
                res.status(500).send('Error generating speech.');
                return;
            }

            console.log(`stdout: ${stdout}`);
            res.json({ fulfillmentText: fulfillmentText });
        });
    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).send('Error in Dialogflow request.');
    }
});


app.use('/audio', express.static(path.join(__dirname, 'response.mp3')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

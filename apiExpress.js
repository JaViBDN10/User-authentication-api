require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
const port = 3000;

const SECRET_KEY = process.env.SECRET_KEY || 'supersecreto1234';
const TOKEN_EXPIRATION = '1h';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '1234',
    port: 5432,
});

// ** Middlewares Globales **
app.use(express.json()); // Analiza JSON automáticamente
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ** Rutas **

// Login
app.post('/login', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const resLogin = await consultaLogin(user, pass);
        if (resLogin) {
            const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener usuarios (requiere token)
app.get('/users', verifyToken, async (req, res) => {
    try {
        const resTabla = await consultaTabla();
        res.status(200).json(resTabla);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Añadir usuario
app.post('/add', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const result = await updateTable(user, pass, 0);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error al añadir el usuario' });
    }
});

// Borrar usuario
app.delete('/del', async (req, res) => {
    const { user, pass } = req.body;
    try {
        const result = await updateTable(user, pass, 1);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// Modificar usuario
app.put('/alter', async (req, res) => {
    const { user, pass, newUser, newPass } = req.body;
    try {
        const result = await alterTable(user, pass, newUser, newPass);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error al modificar el usuario' });
    }
});

// ** Funciones de la base de datos **

async function consultaLogin(user, pass) {
    try {
        const query = 'SELECT name, pass FROM persons WHERE name = $1 AND pass = $2';
        const cons = await pool.query(query, [user, pass]);
        console.log(query);
        return cons.rowCount === 1;
    } catch (err) {
        console.error('Error en consultaLogin:', err);
        return false;
    }
}

async function consultaTabla() {
    try {
        const query = 'SELECT * FROM persons';
        const cons = await pool.query(query);
        return cons.rows;
    } catch (err) {
        console.error('Error en consultaTabla:', err);
        return [];
    }
}

async function updateTable(user, pass, action) {
    try {
        let query;
        if (action === 0) { // Añadir usuario
            query = 'INSERT INTO persons(name, pass) VALUES($1, $2)';
            await pool.query(query, [user, pass]);
        } else if (action === 1) { // Borrar usuario
            query = 'DELETE FROM persons WHERE name = $1 AND pass = $2';
            await pool.query(query, [user, pass]);
        }
        return await consultaTabla();
    } catch (err) {
        console.error('Error en updateTable:', err);
        return [];
    }
}

async function alterTable(user, pass, newUser, newPass) {
    try {
        const query = 'UPDATE persons SET name = $1, pass = $2 WHERE name = $3 AND pass = $4';
        await pool.query(query, [newUser, newPass, user, pass]);
        return await consultaTabla();
    } catch (err) {
        console.error('Error en alterTable:', err);
        return [];
    }
}

// ** Middleware para verificar tokens **
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // La información decodificada estará en req.user
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token no válido' });
    }
}

// ** Servidor corriendo **
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
<<<<<<< HEAD
const initDB = require('./db'); // твоя база
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));

// Настройки сессии
app.use(session({
    secret: 'secret_key_12345',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'lax' } // локальная разработка
}));

let db;

async function startServer() {
    db = await initDB();

    function authMiddleware(req, res, next) {
        if (req.session && req.session.userId) next();
        else res.status(401).send('Не авторизован');
    }

    // Страницы
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'client', 'auth.html')));
    app.get('/auth.html', (req, res) => res.sendFile(path.join(__dirname, 'client', 'auth.html')));
    app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'client', 'register.html')));
    app.get('/index.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'client', 'index.html')));

    // API: текущий пользователь
    app.get('/api/me', authMiddleware, async (req, res) => {
        try {
            const [users] = await db.query(`SELECT id_user, login, email FROM users WHERE id_user = ?`, [req.session.userId]);
            res.json(users[0]);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // API: контакты
    app.get('/api/contacts', authMiddleware, async (req, res) => {
        try {
            const [contacts] = await db.query(`SELECT * FROM contacts WHERE user_id = ?`, [req.session.userId]);
            res.json(contacts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post('/api/contacts', authMiddleware, async (req, res) => {
        try {
            const { name, meaning } = req.body;
            const [result] = await db.query(
                `INSERT INTO contacts (name, meaning, user_id) VALUES (?, ?, ?)`,
                [name, meaning, req.session.userId]
            );
            const [newContact] = await db.query(`SELECT * FROM contacts WHERE id_contact = ?`, [result.insertId]);
            res.status(201).json(newContact[0]);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
        try {
            await db.query(`DELETE FROM contacts WHERE id_contact = ? AND user_id = ?`, [req.params.id, req.session.userId]);
            res.json({ message: 'Контакт удалён' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Регистрация
    app.post('/register', async (req, res) => {
        try {
            const { login, email, password } = req.body;
            const [existing] = await db.query(`SELECT * FROM users WHERE login = ? OR email = ?`, [login, email]);
            if (existing.length > 0) return res.json({ success: false, message: 'Логин или Email уже занят' });

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(`INSERT INTO users (login, email, password) VALUES (?, ?, ?)`, [login, email, hashedPassword]);

            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: 'Ошибка сервера' });
        }
    });

    // Логин
    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const [users] = await db.query(`SELECT * FROM users WHERE login = ?`, [username]);
            if (!users.length) return res.json({ success: false, message: 'Логин или пароль неверный' });

            const validPassword = await bcrypt.compare(password, users[0].password);
            if (!validPassword) return res.json({ success: false, message: 'Логин или пароль неверный' });

            req.session.userId = users[0].id_user;
            res.json({ success: true, user_id: users[0].id_user });
        } catch (err) {
            res.json({ success: false, message: 'Ошибка сервера' });
        }
    });

    // Логаут
    app.post('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ success: false, message: 'Ошибка при выходе' });
            res.clearCookie('connect.sid'); // очищаем cookie
            res.json({ success: true });
        });
    });

    // 404
    app.use((req, res) => res.status(404).send('Страница не найдена'));

    app.listen(3000, () => console.log('Server started on port 3000'));
}

startServer();
=======
const {v4} = require('uuid');
const app = express();

let CONTACTS = [
    {id: v4(), name: "Владилен", value:"+7-832-321-31-39", marked: false},
];

app.use(express.json());

// GET
app.get('/api/contacts', (req, res) => { 
    res.status(200).json(CONTACTS);
});

// POST
app.post('/api/contacts', (req, res) => {
    const contact = {...req.body, id:v4(), marked:false};
    CONTACTS.push(contact);
    res.status(201).json(contact);
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);
    res.status(200).json({message: 'Контакт был успешно удален'});
});

// PUT
app.put('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id);
    CONTACTS[idx] = req.body;
    res.json(CONTACTS[idx]);
});


app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.listen(3000, () => console.log('Server has been started on port 3000'));
>>>>>>> 611885622bb2f5d8ee49c78592503876bc1d2669

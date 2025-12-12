const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({ 
        host: 'localhost', 
        user: 'root', 
        password: 'root' 
    });

    // Создаём базу данных
    await connection.query(`CREATE DATABASE IF NOT EXISTS contacts_app`);
    await connection.query(`USE contacts_app`);

    // Таблица пользователей
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `);

    // Таблица контактов
    await connection.query(`
        CREATE TABLE IF NOT EXISTS contacts (
            id_contact INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            meaning VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
        )
    `);

    return connection;
}

module.exports = initDB;

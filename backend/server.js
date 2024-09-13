const dotenv = require("dotenv");
const fs = require("fs");
const { Client } = require("pg");
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");

// Bestimme den richtigen Pfad zur .env-Datei basierend auf der Umgebung
const envFile = () => {
    switch (process.env.NODE_ENV) {
        case "production":
            return "../.env.production";
        case "development":
            return "../.env.development";
        case "local":
            return "../.env.local";
        default:
            return "../.env"; // Fallback zur allgemeinen .env-Datei
    }
};

dotenv.config({ path: path.resolve(process.cwd(), envFile()) });

const PORT = process.env.EXPRESS_PORT || 5001;

app.use(cors());
app.use(express.json());

// TODO: Beispiel-Route, die Temperaturdaten zurückgibt
/* app.get("/temperaturdaten", (req, res) => {
    const data = [
        { temperatur: 22.5, zeitstempel: new Date() },
        { temperatur: 21.8, zeitstempel: new Date() },
    ];
    res.json(data);
}); */

// PostgreSQL-Datenbankverbindung einrichten (zur Admin-Datenbank oder einer existierenden)
const pgClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: "postgres",
});

// Verbindung zum PostgreSQL-Server herstellen
pgClient.connect();

console.log("Verbinde mit Datenbank...");

// Request vorbereiten
app.post("http://localhost:5005/create-database", async (req, res) => {
    console.log("create-database");
    const dbName = process.env.DB_NAME; // Name der Datenbank, die du erstellen möchtest
    try {
        // Fehlerhandlying database already exists
        /* const result = await pgClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (result.rowCount > 0) {
            return res
                .status(400)
                .send(`Datenbank ${dbName} existiert bereits.`);
        } */

        // SQL-Befehl zum Erstellen der Datenbank ausführen
        await pgClient.query(`CREATE DATABASE ${dbName};`);
        res.send(`Datenbank ${dbName} erfolgreich erstellt.`);
    } catch (err) {
        if (err.code === "42P04") {
            // Fehlercode für "Datenbank existiert bereits"
            res.status(400).send(`Datenbank ${dbName} existiert bereits.`);
        } else {
            console.error(err);
            res.status(500).send("Fehler beim Erstellen der Datenbank.");
        }
    }
});

// Request versenden
fetch("http://localhost:5005/create-database", {
    method: "POST",
})
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));

// Starte den Server
app.listen(PORT, () => {
    console.log(
        `Server läuft auf http://localhost:${PORT} mit folgenden Umgebungsvariablen:${process.env.NODE_ENV}`
    );
});

// TODO:
/* const sql = fs.readFileSync("./db/schema.sql").toString();

pool.query(sql)
    .then(() => console.log("Schema erfolgreich ausgeführt"))
    .catch((err) => console.error("Fehler beim Ausführen des Schemas:", err)); */

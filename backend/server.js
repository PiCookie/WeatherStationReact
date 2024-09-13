// Bestimme den richtigen Pfad zur .env-Datei basierend auf der Umgebung
require("dotenv").config({
    path: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
});
const fs = require("fs");
const { Client } = require("pg");
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const checkToken = require("./middleware/middleware");

app.use(cors());
app.use(express.json());
// Middleware zum Parsen von URL-kodierten Daten
app.use(express.urlencoded({ extended: true }));

// Port des Servers
const PORT = process.env.EXPRESS_PORT || 5001;

// PostgreSQL-Datenbankverbindung einrichten
const pgClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Verbindung zum PostgreSQL-Server herstellen
pgClient.connect((err) => {
    if (err) {
        console.error("Verbindung zum PostgreSQL-Server fehlgeschlagen:", err);
        return;
    }
    console.log("Erfolgreich mit dem PostgreSQL-Server verbunden.");
});

// POST-Route zum Empfangen von Wetterdaten
app.post("/api/weather", checkToken, async (req, res) => {
    // Wetterdaten aus dem Request-Body extrahieren
    const { token, temperature, humidity, pressure, battery } = req.body;
    console.log("-----------------------------------------------");
    console.log(
        `Wetterdaten empfangen: Temperatur: ${temperature}°C, Luftfeuchtigkeit: ${humidity}%, Luftdruck: ${pressure}hPa, Batterie des Geräts: ${battery}%. Token lautet: ${token}`
    );
    console.log("-----------------------------------------------");

    // Überprüfe, ob alle Wetterdaten vorhanden sind
    if (
        temperature === undefined ||
        humidity === undefined ||
        pressure === undefined ||
        battery === undefined
    ) {
        return res.status(400).send("Fehlende Wetterdaten");
    }

    // Wetterdaten in die Datenbank einfügen
    /*     try {
        // Wetterdaten in die Tabelle "device_sensor_values" einfügen
        const insertQuery = `
          INSERT INTO device_sensor_values (device_sensor_id, value, created_at) 
          VALUES ($1, $2, CURRENT_TIMESTAMP), ($1, $3, CURRENT_TIMESTAMP);
        `;

        // Es wird davon ausgegangen, dass "device_sensor_id" auf den Gerätetyp verweist (z.B. Temperatur- oder Feuchtigkeitssensor)
        await client.query(insertQuery, [device_id, temperature, humidity]);

        res.status(201).send("Wetterdaten erfolgreich gespeichert");
    } catch (err) {
        console.error("Fehler beim Einfügen von Wetterdaten", err);
        res.status(500).send("Fehler beim Speichern der Wetterdaten");
    } */

    res.status(201).send(`Wetterdaten erfolgreich gespeichert`);
});

// Fehlerbehandlung für nicht gefundene Routen
// Muss am Ende aller Routen stehen
app.use("*", (req, res) => {
    res.status(404).send("404 - Seite nicht gefunden");
});

// Starte den Server
app.listen(PORT, () => {
    console.log(
        `Server läuft auf http://localhost:${PORT} mit folgenden Umgebungsvariablen:${process.env.NODE_ENV}`
    );
});

// TODO LE: Datenbank und Tabellen erstellen

//console.log("Verbinde mit Datenbank...");

// Request vorbereiten
/* app.post("/create-database", async (req, res) => {
    console.log("create-database");
    const dbName = process.env.DB_NAME; // Name der Datenbank, die du erstellen möchtest
    try {
        // Fehlerhandlying database already exists
        const result = await pgClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (result.rowCount > 0) {
            // Verbindung zur erstellten Datenbank herstellen
            pgClient.end(); // Beende die alte Verbindung
            const newClient = new Client({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
            });
            await newClient.connect();

            return res
                .status(400)
                .send(`Datenbank ${dbName} existiert bereits.`);
        }

        // SQL-Befehl zum Erstellen der Datenbank ausführen
        await pgClient.query(`CREATE DATABASE ${dbName};`);
        res.send(`Datenbank ${dbName} erfolgreich erstellt.`);

        // Verbindung zur erstellten Datenbank herstellen
        pgClient.end(); // Beende die alte Verbindung
        const newClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
        await newClient.connect();
        console.log(`Mit der neuen Datenbank ${dbName} verbunden.`);
    } catch (err) {
        if (err.code === "42P04") {
            // Fehlercode für "Datenbank existiert bereits"
            //res.status(400).send(`Datenbank ${dbName} existiert bereits.`);
        } else {
            console.error(err);
            res.status(500).send("Fehler beim Erstellen der Datenbank.");
        }
    }
}); */

/* console.log("Request versenden...");

// Request versenden
fetch("http://localhost:5005/create-database", {
    method: "POST",
})
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));



console.log("Datenbank Tabellen erstellen...");

// TODO:
const sql = fs.readFileSync("./db/schema.sql").toString();

pgClient
    .query(sql)
    .then(() => console.log("Schema erfolgreich ausgeführt"))
    .catch((err) => console.error("Fehler beim Ausführen des Schemas:", err)); */

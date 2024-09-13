// Zweck: Middleware-Funktionen für die Authentifizierung
function checkToken(req, res, next) {
    // Token aus dem Request-Body extrahieren
    const token = req.body.token;

    // Prüfen, ob ein Token vorhanden ist
    if (!token) {
        return res.status(400).json({ message: "Token fehlt" });
    }

    // Überprüfe, ob der Token korrekt ist
    if (token !== process.env.DEVICE_TOKEN) {
        return res.status(401).send("Token ungültig");
    }

    // Falls der Token existiert, die Anfrage weiterleiten
    next();
}

module.exports = checkToken;

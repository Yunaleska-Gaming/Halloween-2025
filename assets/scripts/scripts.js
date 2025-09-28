document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/json/calendar-data.json")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("calendar-container");

            const now = new Date();
            const currentDay = (now.getMonth() === 9) ? now.getDate() : null;
            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

            // 📌 Nombre de cases vides avant le 1er octobre (0 = lundi, 1 = mardi...)
            const emptyStart = 2; // pour mercredi → lundi & mardi vides
            for (let i = 0; i < emptyStart; i++) {
                const empty = document.createElement("div");
                empty.classList.add("calendar-days", "hidden");
                container.appendChild(empty);
            }

            data.forEach(entry => {
                const dayDiv = document.createElement("div");
                dayDiv.className = "calendar-days";
                if (entry.name) dayDiv.title = entry.name;

                // 📌 Numéro du jour
                const numberDiv = document.createElement("div");
                numberDiv.className = "days-number";
                numberDiv.textContent = String(entry.day).padStart(2, "0");

                // Over automatique
                if (entry.finished || (currentDay && entry.day < currentDay)) {
                    numberDiv.classList.add("over");
                }

                // Position numéro
                if (entry.position === "top") {
                    numberDiv.style.top = "3px";
                    numberDiv.style.bottom = "auto";
                } else {
                    numberDiv.style.bottom = "3px";
                    numberDiv.style.top = "auto";
                }

                // 📌 Jeu
                const gameDiv = document.createElement("div");
                gameDiv.className = "calendar-games";
                gameDiv.style.position = "relative";

                const img = document.createElement("img");
                img.src = `assets/images/${entry.game}.png`;
                img.alt = entry.name || entry.game;

                if (entry.twitch) {
                    const link = document.createElement("a");
                    link.href = entry.twitch;
                    link.target = "_blank";
                    link.appendChild(img);
                    gameDiv.appendChild(link);
                } else {
                    gameDiv.appendChild(img);
                }

                // Badge live
                if (currentDay === entry.day && entry.liveStart && entry.liveEnd) {
                    const [startH, startM] = entry.liveStart.split(":").map(Number);
                    const [endH, endM] = entry.liveEnd.split(":").map(Number);
                    const startMinutes = startH * 60 + startM;
                    const endMinutes = endH * 60 + endM;

                    if (currentTimeMinutes >= startMinutes && currentTimeMinutes <= endMinutes) {
                        const liveBadge = document.createElement("span");
                        liveBadge.textContent = "🔴 Live";
                        liveBadge.className = "live-badge";
                        gameDiv.appendChild(liveBadge);
                    }
                }

                // Ajout dans le DOM
                dayDiv.appendChild(numberDiv);
                dayDiv.appendChild(gameDiv);
                container.appendChild(dayDiv);
            });

            // 📌 Compléter la dernière ligne avec cases vides si besoin
            const totalCells = emptyStart + data.length;
            const remainder = totalCells % 7;
            if (remainder !== 0) {
                for (let i = 0; i < (7 - remainder); i++) {
                    const empty = document.createElement("div");
                    empty.classList.add("calendar-days", "hidden");
                    container.appendChild(empty);
                }
            }
        })
        .catch(err => console.error("Erreur de chargement du calendrier :", err));
});

Za pokretanje aplikacije je potrebno u command promptu pozicioniranje u Server-side folder i pokrenuti server komandom "npm run server",
a u Visual Studio Code-u mora da se pokrene Live server i da se otvori Web stranica.
Neo4J baza se pokrece u Docker-u na portu :7474 za HTTP i :7687 za BOLT protokol koji se koristi za NodeJS, 
u \Server-side\config\config.js stoje postavke za promenu username-a i password-a ukoliko je potrebno.
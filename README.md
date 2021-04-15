# THE ORACLE

L'app est composée de trois composants:

- theoracle-core : scraper youtube, calcule des rapports, stockage en base
- theoracle-back : api rest pour le front 
- theoracle-front : ihm

## STARTUP

dans theoracle/script

- ./startMongo.sh : démarrer la bdd mongo
- ./startCore.sh : démarrer theoracle-core 
- ./startApp.sh : démarrer theoracle-back & démarrer theoracle-front
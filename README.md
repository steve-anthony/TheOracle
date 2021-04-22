# THE ORACLE

L'app est composée de quatres composants:

- mongodb : la base de donnée
- theoracle-core : scraper youtube, calcule des rapports, stockage en base
- theoracle-back : api rest pour le front 
- theoracle-front : ihm

EN GROS

theoracle-core -> mongodb -> rapport

mongodb -> rapport -> theoracle-back -> theoracle-front

# La base de données

## 1) Lancer mongo
Il y a deux options, soit utiliser docker, soit installer mongo directement.

Avec docker et docker compose :
- Il faut modifier le fichier docker-compose dans "theoracle/conf/mongo" et enlever le --auth de la commande ligne 21. (on veut lancer mongo sans authentification)
- Pour lancer mongo deux options :
  - dans le repertoire "theoracle/conf/mongo"  taper la commande "docker-compose up"
```
docker-compose up // bloquant mais cool pour voir les logs
docker-compose up -d // pour lancer sans bloquer la cmd
```
 - ou alors dans repertoire "theoracle" taper la commande  
```
./theoracle.sh mongo start
```

Sans docker : démerdez vous à installer le truc sur votre poste


## 2) Créé un DB et un user

- Il vous faut un soft pour mongo (NoSQLBooster for mongodb, mongo) https://www.nosqlbooster.com/downloads
- Créé une db du nom de "oraclecrypto"
- ouvrir un shell dans "oraclecrypto" et faire la commande suivante pour créer un user
```
db.createUser({user:"theOracleAdmin", pwd:"monSuperPassword",roles:["readWrite","dbAdmin"]})
```
- kill mongo (docker-compose down ou ./theoracle.sh mongo stop)


## 3) Reboot mongo en mode auth
- Il faut modifier le fichier docker-compose dans "theoracle/conf/mongo" et ajouter le --auth ligne 21. (on veut lancer mongo avec authentification)
- lancer mongo (docker-compose up ou ./theoracle.sh mongo start)

##  4) Créer un fichier de config dans le projet
- dans le repertoire "theoracle-core" créer un dossier "tmp"
- dans "tmp" créer un fichier "password.json" avec à l'intérieur 
```
[
    "theOracleAdmin",
    "monSuperPassword"
]
```


# The Oracle Core

Il faut lancer le serveur mongo.

Installer les dépendances
```
npm i
```

Ensuite, il vous faut vous placer dans "theoracle-core" et vous avez trois options:

- Tester la connexion mongo  
```
node main.js mongo
```

- Pour lancer le scraping (en gros quand vous developez) 
```
node main.js dev
```

- Pour la prod (ça lance une sorte de cron)
```
node main.js
```


# The Oracle Back

Il vous faut vous placer dans "theoracle-back".

Installer les dépendances
```
npm i
```

Vous avez deux options:

- Sans la bdd mongo (data mockée)
```
node theoracle-back.js mock
```

- Avec mongo
```
node theoracle-back.js
```

- Vérifier que ça fonctionne
  - http://localhost:3000/reports
  - http://localhost:3000/coin/ada




# The Oracle Front


Il vous faut vous placer dans "theoracle-front".

Installer les dépendances
```
npm i
```

Lancer le front
```
ng serve
```

- Vérifier que ça fonctionne
  - http://localhost:4200/



# THE ORACLE

L'app est composée de quatres composants:

- mongodb : la base de donnée
- theoracle-core : scraper youtube, calcule des rapports, stockage en base
- theoracle-back : api rest pour le front 
- theoracle-front : ihm

EN GROS

theoracle-core -> mongodb -> rapport

mongodb -> rapport -> theoracle-back -> theoracle-front

# Prérequis

Il vous faut :

- node
- npm
- docker
- docker-compose


REMARQUE : Je n'ai pas window. Je pense qu'il vous faut une power shell ou un git bash pour lancer les commandes suivantes.

# La base de données

## 1) Lancer mongo
Pour lancer mongo c'est simple. 
  - Soit vous installer mongo manuellement
  - Soit vous le lancer avec docker

Si vous voulez le lancer avec docker:

Vous allez dans le sous projet : "theoracle" et vous faite cette commande : 

```
./theoracle-dev.sh mongo start
```

pour éteindre mongo

```
./theoracle-dev.sh mongo stop
```


## 2) Explorer votre base

Il vous faut un soft pour mongo (NoSQLBooster for mongodb par exemple) https://www.nosqlbooster.com/downloads



# Initialiser le projet

Avant toute chose il vous faut initaliser la bdd et le projet.

Vous allez dans le sous projet : "theoracle" et vous faite cette commande : 

```
./theoracle-dev.sh init
```

Si tous ce passe bien vous retrouverez une sortie de commande comme ça :

```
  timestamp: 2021-04-26T08:35:53.054Z
}
UPDATE COIN  {
  symbol: 'usd',
  name: 'United States Dollar',
  price: 0,
  timestamp: 2021-04-26T08:35:53.054Z
}
[OK] coins updated
2021-04-26T08:35:49.089Z - Connexion OK
Initialisation terminée
```


# Prêt à coder

## The Oracle Core

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


## The Oracle Back

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




## The Oracle Front


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



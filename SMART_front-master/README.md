# Orientify • Une application mobile pour l'orientation

## Configuration préliminaire

L'application n'étant pas distribuée sur les stores, il faudrait cloner le répertoire Github et l'installer localement pour pouvoir s'en servir. De plus, la fonctionnalité de "Notifications PUSH" ayant été développée par le bias d'un package fourni par Expo, il est conseillé d'utiliser l'environnement de test Expo Go, un client pour tester des applications mobiles développées en React Native sur iOS ou Android. Télécharger Expo Go ici: https://expo.io/client

## Installation de dépendances

Si ce n'est pas déjà fait, télécharger Yarn, un package manager pour applications JavaScript: https://classic.yarnpkg.com/en/docs/install/#mac-stable
(Cette installation suppose que vous avez déjà npm qui est normalement groupé automatiquement avec Node.js).

Installer expo: ```npm install --global expo-cli```

Cloner le répértoire. Dans le dossier "SMART_FRONT", lancer la commande ```yarn```, ceci installera toutes les dépendances dont l'application a besoin pour tourner.

## Lancez l'application

Si vous avez bien suivi les instructions pour lancer le serveur, vous devez à ce stade avoir un lien ngrok vers un tunnel prêt à servir les requêtes de l'appli. Remplacer le lien dans ```src/constants.js``` par votre nouveau lien généré. Attention à bien respecter le format "xxxxxxxxxxxx.ngrok.io" pour le lien, sans le ```http://``` au début ni le ```/``` à la fin qui sont déjà gérés ailleurs. 
Exécuter la commande: ```yarn start```. Ceci va éxecuter ```expo start``` ce qui démarre Metro Bundler, un serveur HTTP qui compile le  JavaScript de l'application à l'aide de Babel pour le servir à Expo Go qui va télécharger notre application.

## Testez l'application 

Passez en mode production sur la page web qui s'ouvre en lançant l'application avec yarn start, et en mode ```tunnel``` si votre téléphone et votre ordinateur ne sont pas sur le même réseau. 
Depuis votre appareil photo sur iPhone, ou Expo Go sur Android, scannez le QR Code affiché, et voilà ! Des opportunités illimitées en matière d'orientation académique comme professionnelle s'offrent désormais à vous grâce à l'application. N'hésitez pas à en tirer profit, et surtout à en redonner à d'autres qui pourraient bénéficier de vos expériences ! 

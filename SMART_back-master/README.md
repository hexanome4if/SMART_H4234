# Prérequis :

- Dossier SMART_back contenant le code source
- JDK 16 ( https://www.oracle.com/java/technologies/javase-jdk16-downloads.html )

- Serveur MariaDB ( Tutorial d'installation : https://www.youtube.com/watch?v=lH_2taJUOj4 )
  * Il est important de garder "root" comme nom d'utilisateur ET comme mot de passe
 
- IntelliJ IDEA ( https://www.jetbrains.com/idea/download/ )
- ngrok ( https://ngrok.com/download )


# Pour créer la base de données

  ## (Option 1) Depuis l'invite de commande (terminal)

  - Lancer la commande : "mysql -u root -p"
  - Entrer le mot de passe : "root"
  - Une fois connecté, lancer la commande : "source <chemin vers le dossier/SMART_back/scripts_sql/orientation.sql>

  -> Une base de données "orientation" est créée avec ses tables
  * Pour insérer des données de tests dans la base, lancer la commande : 
     "source <chemin vers le dossier/SMART_back/scripts_sql/insertions.sql>" ce script supprime par défaut toute donnée déjà présente dans la base


  ## (Option 2) Depuis HeidiSQL

  - Créer une session avec les paramètres suivants :
      - Type de réseau -> MySQL TCP/IP
      - Library -> libmariadb.dll
      - Ip hôte -> 127.0.0.1
      - Utilisateur -> root
      - Mot de passe -> root
      - Port -> 3306
      Sans oublier d'entrer votre mot de passe

  - Cliquer sur Fichier / Exécuter un fichier SQL
  - Choisir le fichier SMART_back/scripts_sql/orientation.sql

  -> Une base de données "orientaion" est créée avec ses tables
    * Pour insérer des données de tests dans la base, exécuter le fichier SMART_back/scripts_sql/insertions.sql
    ce script supprime par défaut toute donnée déjà présente dans la base
       
  
# Pour lancer le Serveur Back-end

- Ouvrir l'IDE IntelliJ IDEA
- Cliquer sur Fichier (File) / Nouveau (New) / Projet provenant de sources existantes (Project from existing sources)
- Selectionner le dossier SMART_back
- Cliquer sur "Build" puis "Build Project"
- Cliquer sur "Run" en selectionner la classe SmartBackApplication comme main

-> Le serveur Spring Boot est lancé
* Pour les prochaines fois, il suffira d'ouvrir le project et de le lancer ("Run project")


# Lancer un tunnel ngrok

- Lancer l'exécutable ngrok.exe
- Ecrire la commande : "ngrok http 9000"

-> Le tunnel est lancé
* Récupérer alors l'adresse "Forwarding" sécurisée semblable à celle ci :  https://15f6767a12f1.ngrok.io
  permettant la connexion avec le front

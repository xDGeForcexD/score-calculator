# Score Calculator

Mit dieser App ist es möglich die Punktstände bei Karten bzw. Brettspielen Digital zu erfassen.
Es gibt einen Standard Punktezähler der die Runden Punkte einfach addiert.

Es ist außerdem möglich weitere Spieltypen auszuwählen.

Aktuell gibt es folgende Spieltypen:

* Rage

Wie man weitere Spieltype hinzufügen kann [sieht man hier](#Neuen-Spieltyp-erstellen).

## Installieren

Diese App muss auf einem Webserver bereit gestellt werden.

Die App kann mittels:

### npm run build

gebaut werden.

Anschließend muss das build Verzeichnis auf einen Webserver hochgeladen werden.

Die App kann dann mittels dem Smartphone Browser aufgerufen werden. 
Falls gewünscht kann man sich diese auch auf den Homescreen installieren.

## Neuen Spieltyp erstellen

Um einen neuen Spieltyp zu erstellen sind Programmierkenntnisse in Javascript nötig.

Für einen neuen Spieltyp muss ein neues Verzeichniss unter src/lib/gameTypes/ erstellt werden.
Dies Verzeichnis muss mindestens eine Klasse enthalten die von GameGeneralMain erbt.

Verfügbare Methoden können der GameGeneralMain Klasse entnommen werden.

Die neue erstellte Klasse muss in der GameTypes Klasse mittels:

### import GameTypeXXX from 'xxx';

und 

### this.games.push(new GameTypeXXX());

hinzugefügt werden.


## Kompatibel

Die App wurde auf folgenden Geräten getestet:

* Apple iPhone XS
* Apple iPad Pro 9,7"
* Samsung Galaxy S8
* Mac OS Safari
* Mac OS Google Chrome

## TODO

* Bestenliste erweitern
* in Typescript umwandeln
* Neue Spieltypen hinzufügen
* Standard Tastatur durch react-simple-keyboard ersetzten
* Unit Tests erstellen

## License
Diese App ist mit React und Onsen UI aufgebaut.
Copyright (c) 2020 xDGeForcexD. Licensed under MIT license, see LICENSE for the full license.
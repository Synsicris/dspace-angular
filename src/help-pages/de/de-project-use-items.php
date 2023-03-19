<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

 <body class="use" id="use-items">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><strong>Einträge_anlegen</strong></n2><br>
	  <n2><a href="de-project-use-fill.php">Einträge_ausfüllen</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-use-saving.php">Speichern</a></n2><br> <!-- Datei fehlt -->
    <n2><a href="de-project-use-permissions.php">Bearbeitungsrechte_festlegen</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-use-versioning.php">Versionierung</a></n2><br>> <!-- geprueft -->
	  <n2><a href="de-project-use-export.php">Export_/_Drucken</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>
      <h1>Einträge anlegen</h1>

		<article>
		<h1>Neue Einträge anlegen oder vorhandene Einträge editieren – Verschiedene Möglichkeiten</h1>
		<p>

      Reminder: Ein „Eintrag“ ist immer <strong>ein </strong>Inhalt, der einem bestimmten Bereich zugeordnet ist
      (z.B. Veröffentlichung oder Veranstaltung). Für weitere Inhalte, z.B. eine weitere Veröffentlichung
      oder Veranstaltung, legen Sie weitere Einträge an.

        <ol>
            <li>Wirkungspfad oder Arbeitsplan</li>
                <ul>
                      <li>Bester Weg, um inhaltliche Einträge anzulegen.</li>
                      <li>Hier erhalten Sie weiterführende Hilfe dazu, welche Inhalte in welchem Bereich eingetragen werden.</li>
                      <li>Die neuen Einträge sind gleich in der richtigen Struktur eingeordnet.</li>
                </ul>
                <br>

            <li>Listenansicht</li>
                <ul>
                      <li>Bester Weg, um (Teil-)Projekte und Beteiligte anzulegen.</li>
                      <li>Sie sehen alle bereits eingetragenen Daten eines Bereiches, können sie auswählen und editieren.</li>
                      <li>Sie können einen neuen Eintrag in diesem Bereich anlegen.</li>
                </ul>
<br>

            <li>Arbeitsbereich</li>
                <ul>
                      <li>Sie können in allen vorhandenen Einträgen des Verbundprojektes filtern und suchen.</li>
                      <li>Sie können <strong>Einträge in allen Bereichen</strong> anlegen.</li>
                      <li>Sie können Einträge wiederfinden, die noch nicht vollständig gespeichert wurden.</li>
                </ul>


        </ol>
</p>

		</article>

</br>

		<article>
		<img src="img/de_project_use_items_eintraege_impactpathway.png">
		</article>

</br>

    <article>
  <img src="img/de_project_use_items_eintraege_listenansicht.png">
    </article>
</br>
    <article>

    <img src="img/de_project_use_items_alle_items.png">
    </article>

</br>
    </main>


  <footer align="center">
     <p>Kontakt: <a href="mailto:support@synsicris.de">support@synsicris.de</a> </p>
     <p>© 2023 by SynSICRIS: Universität Kassel & Disy Informationssysteme GmbH</p>
  </footer>
  </body>
</html>

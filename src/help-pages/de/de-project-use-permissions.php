<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="use" id="use-permissions">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-use-items.php">Einträge_anlegen</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-use-fill.php">Einträge_ausfüllen</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-use-saving.php">Speichern</a></n2><br> <!-- Datei fehlt -->
    <n2><strong>Bearbeitungsrechte_festlegen</strong></n2><br>
	  <n2><a href="de-project-use-versioning.php">Versionierung</a></n2><br>> <!-- geprueft -->
	  <n2><a href="de-project-use-export.php">Export_/_Drucken</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>
  <main>


        <h1>Zugangsrechte zum Projekt</h1>

  		<article>
  		<h2>Bearbeitungsrechte beim Anlegen eines Projektes festlegen</h1>
  		<p>Wenn Sie ein Teilprojekt anlegen, können Sie zwischen zwei Optionen von Zugangsrechten auswählen.
          <ul>
            <li>Option A - <strong>Offener Zugang für alle Mitglieder des Verbundes:</strong><br>Alle Mitglieder des Verbundes können im Arbeitsbereich Ihres Projektes den Verwertungsplan und den Zwischenbericht einsehen und bearbeiten.</li>
            <br>
            <li>Option B - <strong>Zugang  nur für Mitglieder des Projektes:</strong><br>Nur Mitglieder des Projektes können im Arbeitsbereich Ihres Projektes den Verwertungsplan und Zwischenbericht einsehen und bearbeiten sowie Aktionen durchführen.</li>
          </ul>

      </p>

      <br>

      <p>Wichtig:
          <ul>
            <li>Einträge und deren Inhalte sind für alle Mitglieder des Verbundes <strong>sichtbar und editierbar</strong>, unabhängig davon, ob Option A oder B gewählt wurde.</li>
            <li>Aktionen, wie Projektmitarbeitende verwalten, easy-online-Import durchführen, etc., sind immer nur für Mitglieder des Projektes mit der entsprechenden Rolle möglich. D.h. die Einstellung der Zugangsrechte ist unabhängig davon.</li>
          </ul>

      </p>


  </article>
  <br>

      <article>
      <img src="img/de_project_use_permission_Zugriff.png">

      </article>
      <br>




      </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

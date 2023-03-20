<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="use" id="use-versioning">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-use-items.php">Einträge_anlegen</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-use-fill.php">Einträge_ausfüllen</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-use-saving.php">Speichern</a></n2><br> <!-- Datei fehlt -->
    <n2><a href="de-project-use-permissions.php">Bearbeitungsrechte_festlegen</a></n2><br> <!-- geprueft -->
	  <n2><strong>Versionierung</strong></n2><br>
	  <n2><a href="de-project-use-export.php">Export_/_Drucken</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>



      <h1>Versionierung</h1>

      <h2>Wozu dient die Versionierung?</h2>

      <p>Die Versionierung ermöglicht einen komfortablen Workflow vom Antrag bis zum Bericht, mit dem die Informationen im Monitoring-Tool zu verschiedenen Zeitpunkten festgeschrieben werden können. In der Antragsphase werden zunächst alle Ziele, Arbeiten und Wirkungen geplant. Diese Antragsinformationen können dann als unveränderbare Version „eingefroren“ und für den Projektträger freigegeben werden. Im Projektverlauf arbeitet das Projektteam in der aktiven Instanz weiter und kann dort alle Informationen immer weiter anpassen. Zu jedem Berichtszeitpunkt wird wieder eine Version erstellt und für den Projektträger freigegeben. Diese haben dadurch lesenden Zugriff auf die Projektdaten und können die vielfältigen Funktionen des Monitoring-Tools, wie Filter, Suchfunktionen, Visualisierungen und der Wechsel zwischen Übersichten und Details, für ihre Arbeit nutzen.</p>

      <p>Die Versionierung reduziert den Dokumentationsaufwand und ermöglicht verschiedene Versionen zu vergleichen. Bei einem Vergleich werden im Wirkungspfad, Arbeitsplan und im Verwertungsplan entfernte, neue und geänderte Elemente unterschiedlich angezeigt. Durch Aufrufen des Eintrags wird der Vergleich zwischen den Versionen auf Basis der einzelnen Metadaten dargestellt. Zusätzlich kann das Projektteam Einträge manuell kennzeichnen, um wichtige Veränderungen im Vergleich zum Antrag hervorzuheben. </p>
      <br>

      <article>
      <img src="img/de_project_use_versioning_1.png">
      </article>

      <br>

      <article>

      <img src="img/de_project_use_versioning_2.png">
    </article>

      <br>

      <article>

      <img src="img/de_project_use_versioning_3.png">
    </article>

      <br>

      <article>

      <img src="img/de_project_use_versioning_4.png">
    </article>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

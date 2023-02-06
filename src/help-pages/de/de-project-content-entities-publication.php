<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="content" id="content-entities-publication">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-proj.php">Verbundprojekt_/_Teilprojekt</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-involved.php">Beteiligte</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-objectives.php">Ziele</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-events.php">Interaktion</a></n3><br> <!-- Datei fehlt -->
	  <n3><strong>Veröffentlichungen</strong></n3><br>
	  <n3><a href="de-project-about-entities-applic.php">Anwendung_(Möglichkeiten)</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-impact.php">gesell._Wirkung</a></n3><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-about-structure.php">Inhalte_strukturieren</a></n2><br> <!-- Datei fehlt -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>

	<h1>Veröffentlichungen</h1>

  <h2>Die Kategorien <i>Geplante Veröffentlichungen</i> und <i>Veröffentlichung</i> unterscheiden</h2>

  <p>Für Einträge der Antragsplanung und für die Aktualisierung im Verlauf des Vorhabens verwenden Sie im Tool üblicherweise dieselbe Kategorie. Bei Veröffentlichungen ist das anders:</p>
  <p><strong>Einträge für die Planung</strong> erfolgen in der Kategorie <i>Geplante Veröffentlichungen</i>, <strong>Aktualisierungen im Verlauf</strong> des Vorhabens in der Kategorie <i>Veröffentlichung</i>.</p>
  <p>Das hat folgende Vorteile:

    <ul>
      <li><p><i>Geplante Veröffentlichungen</i> dient als <strong>Sammeleintrag</strong>, wie zum ausgewählten „Ziel für Interaktion und Transfer“ beigetragen werden soll. D.h. hier können Sie eine Veröffentlichungs- oder Kommunikationsstrategie für ein bestimmtes Ziel darstellen. Dabei können Sie alternative Möglichkeiten, Umsetzungswege und Verbreitungsstrategien mit aufführen. In einzelnen Einträgen in der Kategorie <i>Veröffentlichung</i> könnte dies nicht angemessen dargestellt werden.</p>
          <p>Im Verlauf des Vorhabens wird z. B. geprüft, ob die Ergebnisse für Zielgruppe xy in kurzen Videos oder in Factsheeds für die Beratung zugänglich gemacht werden.</p></li>
      <li>In der Kategorie <i>Veröffentlichung</i> wird jede Veröffentlichung, die während des Vorhabens entstanden ist, als <strong>Einzeleintrag</strong> erfasst.</li>
    </ul>

  </p>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

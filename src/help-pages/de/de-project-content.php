<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="content" id="content">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ipw.php">Impact_Pathway</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-wp.php">Arbeitsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ep.php">Verwertungsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-pages.php">Bereiche</a></n2> <!-- Datei fehlt --><br> <!-- Datei fehlt -->
	  <n3><strong>Akteursgruppen</strong></n3><br>
	  <n3><a href="de-project-details-pages-ethics.php">Ethische_Reflexion</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-pages-impacts.php">Erwartete_gesell._Wirkung</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-pages-gender.php">Geschlechteraspekte</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-pages-solution.php">Lösung/Veränderung/Innovation</a></n3> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>
<h1>Wichtigste Infos zu den Inhalten</h1>

    <h2>Inhalte im Monitoring-Tool: Kategorisiert erfassen und individuell strukturieren</h2>
    <p>Im Monitoring-Tool erfassen Sie die Informationen zum Vorhaben in einzelnen Einträgen, die jeweils zu einer bestimmten Kategorie (z.B. Arbeitspaket, Veranstaltung) gehören (<a href="de-project-content-entities.php">Überblick über die Kategorien im SynSICRIS-Monitoring-Tool</a>).</p>
    <p>Im Arbeitsplan, im Wirkungspfad und im Verwertungsplan können Sie die einzelnen Einträge strukturieren (siehe <a href="de-project-content-structure.php">Inhalte strukturieren</a>).</p>
    <p>Außerdem bekommen Sie Hinweise zu einzelnen Gruppen von Kategorien, die Ihnen dabei helfen, Informationen in die richtige Kategorie einzuordnen.</p>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

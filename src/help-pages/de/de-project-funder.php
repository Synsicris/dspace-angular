<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="funder" id="funder">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><strong>Förderinformationen</strong></n1><br>
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>

      <h1>Informationen für Förderer</h1>
      <p>Die folgenden Seiten sind nur für Förderer relevant.</p>
      <p>Es werden verschiedene Funktionen erläutert, die Förderer im SynSICRIS Monitoring-Tool nutzen können.</p>



    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

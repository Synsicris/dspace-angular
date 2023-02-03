<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="ipw" id="ipw">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1><br> <!-- Datei fehlt -->
	  <n2><strong>Impact_Pathway</strong></n2><br>
	  <n3><a href="de-project-details-ipw-ipwabout.php">Hintergrund</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-ipw-ipwhelp.php">Hilfe</a></n3><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-wp.php">Arbeitsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ep.php">Verwertungsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-pages.php">Bereiche</a></n2> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

  <main>


        <h1>Impact Pathway</h1>

  		<article>
        <p>Wirkungspfade visualisieren und strukturieren die <strong>Zusammenhänge von Inputs, Outputs und Outcomes sowie die beabsichtigten Wirkungen</strong> eines Projekts mit Karten und Pfeilen an einer Pinnwand oder digital über Textfelder.</p>  


  		<img src="img/de_project_ipw_zentrales_element.png">

  		</article>


      </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>
 
  <body class="use" id="use">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
	
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><strong>Navigation_/_Funktion</strong></n1><br>
	  <n2><a href="de-project-use-items.php">Einträge_anlegen</a></n2><br> <!-- geprueft -->
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
      <h1>Navigation und Funktionen im Tool</h1>

		<article>


		<img src="img/de_project_use_functions_navigation_funktionen.png">
  </br>



		</article>

</br>

		<article>

    <img src="img/de_project_use_functions_Arbeitsbereiche.png">

		</article>
    </br>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

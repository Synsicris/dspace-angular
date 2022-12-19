<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>
 
  <body class="content" id="content-entities">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
  
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><strong>Inhalte_unterscheiden</strong></n2><br>
	  <n3><a href="de-project-about-entities-proj.php">Verbundprojekt_/_Teilprojekt</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-involved.php">Beteiligte</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-objectives.php">Ziele</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-events.php">Interaktion</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-publication.php">Veröffentlichungen</a></n3><br> <!-- Datei fehlt -->
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
      <h1>Inhalte - erster Überblick</h1>

		<article>

		<img src="img/de_project_about_entities_bereiche_nutzen.png">

		</article>

<br>

      <h2>Überblick über die Bereiche im Monitoring-Tool</h2>

      <article>
          <p>Die Bereiche im Monitoring-Tool dienen dazu, verschiedene Fragen zu beantworten. Die folgende Abbildung zeigt beispielhaft Fragen mit Bezug zu den Beiträgen des Projektes zur Wirkung.</p>

</article>
<br>
<p>
<img src="img/de_project_about_entities_Inhalte_MT.png">
</p>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

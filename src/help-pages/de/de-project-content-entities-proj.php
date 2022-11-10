<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>
 
  <body class="content" id="content-entities-proj">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
	
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n3><strong>Verbundprojekt_/_Teilprojekt</strong></n3><br>
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
      <h1>Verbundprojekt und Teilprojekt</h1>

		<article>
		<h2>Verbundprojekt und Teilprojekt unterscheiden</h2>
		<p>

          Verbundprojekte bestehen aus mehreren Teilprojekten, d.h. mehrere Organisationen arbeiten zusammen, um ein bestimmtes Forschungsthema zu bearbeiten. Dabei hat jede Organisation ein eigenes Teilprojekt.	<p>
          	<p>Wenn nur eine Organisation am Forschungsthema arbeitet, ist dies im Monitoring-Tool als ein Verbundprojekt mit nur einem Teilprojekt zu erfassen.


  	<p>

<br>

		<img src="img/de_project_about_entities_proj_Verbundstruktur_1.png">
    <br>
	</p>

  <p>
    <img src="img/de_project_about_entities_proj_Verbundstruktur_2.png">
<br>

		</p>
    <br>

		</article>

		<article>
		<h2>Jedes Teilprojekt hat einen eigenen easy-Online Antrag</h2>
    <ul>
      <li>Jedes Teilprojekt erstellt einen eigenen <strong>Antrag in easy-Online </strong> und bekommt ein eigenes
        <strong>Förderkennzeichen</strong> sowie einen eigenen <strong>Zuwendungsbescheid </strong>vom Förderer. Dieser Zuwendungsbescheid ist die
        <strong>vertragliche Vereinbarung</strong> zwischen dem Förderer und einer einzelnen Organisation.</li>
      <li>Der easy-Online Antrag deckt die finanziell-rechtliche Seite des Antrags auf Förderung des Forschungsprojekts ab. Das Monitoring-Tool ersetzt Teile der Vorhabensbeschreibung des Förderantrags.</li>
      <li>Jedes Teilprojekt importiert Informationen aus dem eigenen easy-Online Antrag in das Monitoring-Tool.</li>
      <li>Wenn an einem Teilprojekt wiederum mehrere Organisationseinheiten derselben Organisation
        mitwirken (z.B. eine Universität mit mehreren Fachgebieten, die am Projekt finanziert
         mitarbeiten), sind diese Organisationseinheiten zusätzlich als Projektpartner einzutragen. Durch diese detaillierte Erfassung wird im
         Monitoring-Tool deutlich, welche Disziplinen zusammenarbeiten.</li>

    </ul>
		<p></p>

    <br>

    <img src="img/de_project_about_entities_proj_Import_von_Informationen.png">

      <br>

		</article>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

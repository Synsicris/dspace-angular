<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="step" id="step-proposal">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><strong>Antrag</strong></n2><br>
	  <n2><a href="de-project-step-livetime.php">Projektverlauf</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-step-completion.php">Projektabschluss</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-step-update.php">Nach_Projektende</a></n2><br> <!-- geprueft -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>



      <h1>Schritt-für-Schritt-Anleitung für die Antragstellung</h1>

		<article>
		<h2>Koordintor:in des Verbundprojektes lädt Koordinator:innen der (Teil-)Projekte ein</h2>

		<img src="img/de_project_step_proposal_hilfsseiten_0_1.png">

		</article>

<br>

		<article >
		<h2>Projekt-Koordinator:innen legen den Arbeitsbereich des (Teil-)Projektes an</h2>
			<img src="img/de_project_step_proposal_hilfsseiten_2_3_4a.png">
      <img src="img/de_project_step_proposal_hilfsseiten_4b_5.png">

		</article>
    <br>

    <article>
    <h2>Projektpartner stellen Inhalte für die Vorhabensbeschreibung im Arbeitsbereich des Verbundes zusammen</h2>
      <img src="img/de_project_step_proposal_hilfsseiten_6_7_8.png">
      <img src="img/de_project_step_proposal_hilfsseiten_9_10.png">
      <img src="img/de_project_step_proposal_hilfsseiten_11_12.png">


    </article>
    <br>

    <article>
    <h2>Projekt-Koordinator:innen erstellen den Verwertungsplan im Arbeitsbereich Ihres (Teil-)Projektes</h2>
      <img src="img/de_project_step_proposal_hilfsseiten_13_14.png">
    </article>

    <br>


    <article>
    <h2>Koordintor:in des Verbundprojektes kontrolliert die Vorhabensbeschreibung und gibt eine Version für den Fördermittelgeber frei</h2>
      <img src="img/de_project_step_proposal_hilfsseiten_15_16.png">
    </article>

    <br>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

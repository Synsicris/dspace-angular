<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="funder" id="funder-role">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-step-proposal.php">Antrag</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-step-livetime.php">Projektverlauf</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><strong>Projektabschluss</strong></n2><br>
	  <n2><a href="de-project-step-update.php">Nach_Projektende</a></n2><br> <!-- geprueft -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>



      <h1>Rollen und Rechte der Förderer verwalten</h1>

		<article>

		<img src="img/de_project_funder_role_RechteRollenmanagement.png">

		</article>

    <article>
    <p> Es gibt drei Rollen, die mit unterschiedlich weitreichenden Rechten verbunden sind:</p>

    <img src="img/de_project_funder_role_drei_Rollen.png">

    </article>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

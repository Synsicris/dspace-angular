<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="funder" id="funder-comment">

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



  <h1>Kommentarfunktion</h1>
<article>
  <h2>Was ist die Kommentarfunktion?</h2>

    <p>Sie können Kommentare zu jedem einzelnen Eintrag sowie im Wirkungsplan, Arbeitsplan und Verwertungsplan vornehmen. Kommentare sind ausschließlich für die Projektbetreuer eines Verbundes sichtbar.</p>



    <p>In Ihrem <strong>persönlichen Arbeitsbereich</strong> sind über „Alle Kommentare“ Ihre Kommentare aus den von Ihnen betreuten Vorhaben aufgelistet.</p>

    <p>Im <strong>Arbeitsbereich des Verbundes</strong> gelangen Sie über „Alle Kommentare“ in eine Liste der Kommentare, die Sie und ggf. weitere Projektbetreuer zum betreffenden Vorhaben vorgenommen haben.</p>

    <p>In jeder Liste steht Ihnen eine Filterfunktion zur Verfügung, um die Kommentare zu durchsuchen.</p>
</article>

  <br>

<article>
  <h2>Wozu dient die Kommentarfunktion?</h2>

    <p>Die Kommentarfunktion können Sie beispielsweise nutzen, um Vermerke vorzubereiten oder sich selbst Erinnerungen an bestimmte Tätigkeiten in Bezug auf das (Teil-)Projekt zu setzen. Außerdem erleichtern die Kommentare die Übergabe des (Teil-)Projektes an andere Projektbetreuer.</p>
</article>

    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

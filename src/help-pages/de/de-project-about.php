<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="about" id="about">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
      <n1><strong>Über_das_Tool</strong></n1><br>
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-about-structure.php">Inhalte_strukturieren</a></n2><br> <!-- Datei fehlt -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>
<h1>Das Monitoring-Tool</h1>

    <h2>Worum es im Monitoring-Tool geht:</h2>
    <p>Das SynSICRIS-Monitoring-Tool dient dazu, Hintergründe, Ziele, Arbeiten, Ergebnisse und Wirkungspotenziale eines Verbundes oder Einzelprojektes zu erfassen. Teile von Textdokumenten für <strong>Anträge und Berichte</strong> für den Fördermittelgeber <strong> sollen dadurch ersetzt</strong> werden. Anstatt zusammenhängender Textdokumente erstellen Sie <strong>einzelne „Einträge“</strong> (z. B. ein Ziel oder eine Veröffentlichung). Diese Einträge können strukturiert werden, indem Sie sie in einem Wirkungspfad, in Ihrem Arbeitsplan und im Verwertungsplan wie an einer Pinnwand anpinnen.</p>
    <p>Sie erstellen und bearbeiten die Einträge zusammen mit allen Projektpartnern.</p>
    <p>Das Tool soll Sie von der <strong>Antragstellung bis 2 Jahre nach Projektende</strong> begleiten, indem Sie die Einträge regelmäßig aktualisieren und ergänzen. Für die Antragstellung und zu allen Berichtszeitpunkten erstellen Sie eine <strong>Version für den Fördermittelgeber</strong>, in welcher er die Einträge lesen kann.  Außerdem können Sie die Informationen in PDF-Dokumente exportieren.</p>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

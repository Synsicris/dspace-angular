<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="index" id="index">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	<?php /* Alte Navigation kann geloescht werden.
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel --><!-- geaenderter Name -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel --><!-- geaenderter Name -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>
      <h1>Ergänzende Hilfeseiten</h1>
      <!--p></p-->
		<article>



      <p>Diese Hilfeseiten ergänzen die Hilfen im SynSICRIS Monitoring-Tool durch Abbildungen, vertiefende Informationen und (zukünftig auch) Erklärvideos. Die Hilfeseiten sind so gestaltet, dass sie auch ohne die Hilfen im Tool genutzt werden können. Daher sind einige Informationen redundant.</p>
<br>
<h2>Wie Sie diese Hilfe benutzen</h2>
      <p>Am besten öffnen Sie die Hilfeseiten in einem zweiten Browserfenster. So können Sie das Browserfenster des Monitoring-Tools und das Browserfenster der Hilfeseiten nebeneinander auf Ihrem Bildschirm anordnen und parallel nutzen.<!---[Link zu Erklärvideo]--></p>
      <p>Wenn Sie Fehler identifizieren oder weitergehende technische Fragen haben, melden Sie sich gerne bei uns unter <a href="mailto:support@synsicris.de">support@synsicris.de</a>.</p>




		</article>

    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

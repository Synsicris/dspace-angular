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
		<!--h1>Überschrift</h1-->
		<p>Im SynSICRIS-Monitoring-Tool sind Tooltipps und Hilfetexte auf den einzelnen Seiten vorhanden. Diese sind möglichst knapp gehalten, damit möglichst viel Platz für die Eingabe und die Darstellung der Projektinformationen vorhanden ist. Zusammenhängende, übergreifende und vertiefende Informationen werden über diese Hilfeseiten bereitgestellt.</p>
		</article>

		<article>
		<h2>Kontakt</h2>
		<p>Wenn Sie Fehler identifizieren oder weitergehende technische Fragen haben, melden Sie sich gerne bei uns:</p>
		<p><a href="mailto:support@synsicris.de">support@synsicris.de</a></p>
		</article>
  
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

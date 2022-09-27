<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>
 
  <body class="use" id="use-permissions">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
	
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-use-items.php">Einträge_anlegen</a></n2><br> <!-- geprueft -->
	  <n2><a href="de-project-use-fill.php">Einträge_ausfüllen</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-use-saving.php">Speichern</a></n2><br> <!-- Datei fehlt -->
    <n2><strong>Bearbeitungsrechte_festlegen</strong></n2><br>
	  <n2><a href="de-project-use-versioning.php">Versionierung</a></n2><br>> <!-- geprueft -->
	  <n2><a href="de-project-use-export.php">Export_/_Drucken</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>
  
  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>
	<main>


      <h1>Bearbeitungsrechte festlegen</h1>

		<article>
		<h1>Bearbeitungsrechte beim Anlegen eines Teilprojektes festlegen</h1>
		<p>Wenn Sie ein Teilprojekt anlegen, können Sie zwischen zwei Optionen von Bearbeitungsrechten auswählen. Diese Bearbeitungsrechte gelten für Inhalte, die von den Mitgliedern Ihres Teilprojektes angelegt wurden:
        <ul>
          <li><strong>Option A:</strong> unbeschränkte Bearbeitungsrechte für <strong>alle Mitglieder</strong> des Verbundprojektes</li>
          <li><strong>Option B:</strong> Bearbeitungsrechte <strong>beschränkt auf Mitglieder des Teilprojektes</strong></li>
        </ul>

    </p>

    <br>

    <p>Die gewählten Bearbeitungsrechte wirken sich auf zwei Aspekte aus:
        <ul>
          <li>Wer (A oder B) in Ihre Teilprojekt-Seite navigieren, dort Aktionen durchführen und den Verwertungsplan einsehen darf</li>
          <li>Wer (A oder B) Einträge von Mitgliedern Ihres Teilprojektes bearbeiten darf</li>
        </ul>

    </p>

    <br>

    <p><strong>Wichtig:</strong>
        <ul>
          <li>Einträge und deren Inhalte sind für alle Mitglieder des Verbundprojektes <strong>sichtbar</strong>, unabhängig davon, ob Option A oder B gewählt wurde.</li>
          <li>Die Bearbeitungsrechte einzelner Einträge lassen sich ändern (freigeben oder einschränken).</li>
        </ul>

    </p>
</article>
<br>

    <article>
    <img src="img/de_project_use_permissions_Zugriff.png">

    </article>
    <br>

    <article>
		<img src="img/de_project_use_permissions_Bearbeitungsrechte_Eintraege.png">

		</article>
    <br>

    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

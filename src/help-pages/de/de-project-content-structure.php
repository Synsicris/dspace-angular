<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="content" id="content-structure">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n2><strong>Inhalte_strukturieren</strong></n2><br>
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>
      <h1>Inhalte strukturieren</h1>

		<article>
		<h2>Einträge strukturieren</h2>
		<p>Im Monitoring-Tool können Sie die Einträge für drei verschiedene Zwecke strukturieren:
      <ul>
        <li>Der <strong>Impact Pathway</strong> visualisiert die Wirkungsplanung.</li>
        <li>Der <strong>Arbeitsplan </strong>strukturiert die Arbeiten des Projektes in Arbeitspakete und erlaubt es,
          Zeiträume und Verantwortlichkeiten festzulegen.</li>
        <li>Der <strong>Verwertungsplan </strong>wird von jedem Teilprojekt separat durchgeführt. Dabei können alle
          <strong>Einträge aus dem Impact Pathway und aus dem Arbeitsplan</strong> verwendet werden. Wenn das Teilprojekt
          als geschützter Bereich angelegt wurde, können dort im Verwertungsplan weitere Einträge angelegt
          werden, die von Mitgliedern anderer Teilprojekte nicht bearbeitet werden können.</li>
      </ul>
      Wie die drei Strukturierungsmöglichkeiten/-oberflächen zusammenhängen, zeigt die folgende Abbildung.

    </p>

  </article>

</br>

<article>
		<img src="img/de_project_about_structure_zusammenwirken.png">

		</article>

<article>
    		<img src="img/de_project_content_structure_1_create.png">

</article>

<article>
    		<img src="img/de_project_content_structure_2_edit.png">

</article>

<article>
    		<img src="img/de_project_content_structure_3_multiple.png">

</article>

<article>
    		<img src="img/de_project_content_structure_4_changes.png">

</article>

<article>
    		<img src="img/de_project_content_structure_5_remove.png">

</article>

<article>
    		<img src="img/de_project_content_structure_6_delete.png">

</article>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

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
      <ol>
        <li>Der <strong>Wirkungspfad</strong> stellt Zusammenhänge zwischen Zielen, Arbeiten und beabsichtigten Wirkungen her.</li>
        <li>Der <strong>Arbeitsplan </strong>strukturiert die Arbeiten des (Teil-)Projektes in Arbeitspakete und erlaubt es, Zeiträume und Verantwortlichkeiten festzulegen.</li>
        <li>Der <strong>Verwertungsplan </strong>wird von jedem (Teil-)projekt separat durchgeführt.</li>
      </ol>


    </p>
</article>

<br>

<article>
  <h2>Einträge anlegen, anpinnen und ändern</h2>

  <ul>
    <li>Der Wirkungspfad, Arbeitsplan und Verwertungsplan funktionieren wie eine Pinnwand.</li>
    <li>Einträge können neu angelegt und angepinnt werden, oder vorhandene Einträge können ausgewählt und angepinnt werden.</li>
    <li>Jeder Eintrag gehört zu einer Kategorie (z.B. Rahmenbedingung oder Veranstaltung). Je nach Kategorie werden im Eingabeformular unterschiedliche weitere Informationen abgefragt.</li>
    <li>Wenn ein Eintrag angepinnt wird, ist die Bezeichnung und die Kategorie sichtbar. Ein und derselbe Eintrag kann an verschiedenen Stellen angepinnt werden.</li>
    <li>Von jeder angepinnten Karte aus kann der Eintrag geöffnet und geändert werden.</li>
  </ul>


    		<img src="img/de_project_content_structure_1_create.png">

</article>

<br>

<article>
    		<img src="img/de_project_content_structure_2_edit.png">

</article>

<br>

<article>
    		<img src="img/de_project_content_structure_3_multiple.png">

</article>

<br>

<article>
    		<img src="img/de_project_content_structure_4_changes.png">

</article>

<br>

<article>
  <h2>Einträge abpinnen und löschen</h2>

  <p>Da Einträge an mehreren Stellen angepinnt werden können und versehentliches Löschen vermieden werden muss, gibt es den folgenden Unterschied:

  <ul>

    <li>Abpinnen geht an jeder Pinnwand. Die Karte wird abgepinnt, aber der Eintrag bleibt im System erhalten und kann über „Vorhandene hinzufügen“ wieder angepinnt werden. Außerdem bleibt der Eintrag auch in den Listenansichten zur jeweiligen Kategorie im Arbeitsbereich des Verbundes enthalten.</li>
    <li>Löschen ist als Button auf jeder angepinnten Karte zu sehen. Von dort gelangen Sie in das Eingabeformular, damit Sie vor dem Löschen noch überprüfen können, ob Sie den richtigen Eintrag ausgewählt haben. Löschen entfernt den Eintrag unwiederbringlich aus dem System. Alle angepinnten Karten des Eintrags verschwinden dadurch auch.</li>
  </ul>

</p>

<article>
    		<img src="img/de_project_content_structure_5_remove.png">

</article>

<br>

<article>
    		<img src="img/de_project_content_structure_6_delete.png">

</article>

<br>

<article>
<h2>Einträge anordnen</h2>

  <p>Die Reihenfolge der Einträge kann über drag&drop verändert werden:

    <ul>
      <li>im Wirkungspfad innerhalb einer Säule</li>
      <li>im Verwertungsplan innerhalb einer Frage</li>
      <li>im Arbeitsplan die Arbeiten innerhalb der Arbeitspakete und die Reihenfolge der Arbeitspakete</li>
    </ul>

  </p>
  </article>

<br>

<article>
<h2>Einträge mehrfach anpinnen: Drei zusammenhängende Strukturierungsoberflächen</h2>

  </article>



<article>
    <img src="img/de_project_content_structure_Fokus.png">

    </article>
  </p>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

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
      <h1>Verbundprojekt und (Teil-)Projekt</h1>

		<article>
		<h2>Unterscheidung Verbundprojekt und Zuwendungsempfänger / (Teil-)Projekt</h2>
		<p>

          In Verbünden/Verbundprojekten arbeiten mehrere Zuwendungsempfänger / Organisationen / (Teil-)Projekte zusammen, um ein Forschungsthema zu bearbeiten.</p>
          	<p>Wenn nur eine Organisation an einem Forschungsthema arbeitet (Einzelprojekt), ist dies im SynSICRIS-Monitoring-Tool als ein Verbund mit nur einem Zuwendungsempfänger / (Teil-)Projekt zu erfassen.</p>

<br>

  	<p>Für den Verbund und jeden einzelnen Zuwendungsempfänger gibt es separate Arbeitsbereiche:
      <ul>
        <li>Im Arbeitsbereich des Verbundes arbeiten alle Beteiligten inhaltlich zusammen</li>
        <li>Der Arbeitsbereich des Zuwendungsempfängers / (Teil-)Projektes kann als offen eingestellt oder im Zugang beschränkt werden (siehe <a href="de-project-use-permissions.php">Zugangsrechte zum Projekt</a>)</li>

</p>
<br>

		<img src="img/de_project_content_entities_proj_Verbundstruktur.png">
    <br>
	</p>

  <p>
    <img src="img/de_project_content_entities_proj_verbund_erklaert.png">
<br>

		</p>
    <br>

		</article>

		<article>
		<h2>Easy-Online wird von jedem Zuwendungsempfänger / (Teil-)Projekt genutzt</h2>
    <ul>
      <li>Jedes Organisation innerhalb des Verbundes stellt für ihr (Teil-)Projekt einen eigenen <strong>easy-Online-Antrag</strong>. Dieser deckt die finanziell-rechtliche Seite des Antrags ab.</li>
      <li>Bei einer Förderung erhält jedes (Teil-)Projekt ein eigenes <strong>Förderkennzeichen</strong> und einen eigenen <strong>Zuwendungsbescheid</strong>. Dieser ist die vertragliche Vereinbarung zwischen dem Fördermittelgeber und der einzelnen Organisation (=Zuwendungsempfänger).</li>
      <li>Im SynSICRIS-Monitoring-Tool wird die <strong>Vorhabensbeschreibung des Verbundes</strong> erstellt.</li>
      <li>Die <strong>Daten</strong> zur antragstellenden Organisation und zu den (Teil-)Projekten können über die easy-online-xml Datei in das <strong>SynSICRIS-Monitoring-Tool importiert</strong> werden.</li>
    </ul>

    <br>

    <img src="img/de_project_content_entities_proj_Forschungsfoerderer.png">

      <br>

    <ul>
      <li>Koordinatior:innen des (Teil-)Projektes können die Informationen aus dem eigenen easy-Online-Antrag importieren (importiert werden Basisdaten zur Organisation und zum (Teil-)Projekt, nicht das Budget, dieses wird später aus easy-Online importiert)</li>
      <li><strong>Wichtig:</strong> wenn in einem (Teil-)Projekt mehrere Organisationseinheiten derselben Organisation mitwirken (z.B. eine Universität mit mehreren Fachgebieten, die am Projekt finanziert mitarbeiten), sind diese zusätzlich als Projektpartner einzutragen. Dadurch wird im SynSICRIS-Monitoring-Tool deutlich, welche Disziplinen zusammenarbeiten.</li>
    </ul>
    <br>

    <img src="img/de_project_content_entities_proj_Import_von_Informationen.png">

      <br>

		</article>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

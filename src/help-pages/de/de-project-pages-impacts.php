<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="pages" id="pages-impacts">

  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>

	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-use.php">Navigation_/_Funktion</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
      <n1><a href="de-project-funder.php">Förderinformationen</a></n1><br> <!-- geprueft -->
	  <n1><a href="de-project-step.php">Nutzung_im_Projektverlauf</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n1><a href="de-project-details.php">Details</a></n1><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ipw.php">Impact_Pathway</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-wp.php">Arbeitsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ep.php">Verwertungsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-pages.php">Bereiche</a></n2> <!-- Datei fehlt --><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-pages-actor.php">Akteursgruppen</a></n3><br>
	  <n3><a href="de-project-details-pages-ethics.php">Ethische_Reflexion</a></n3><br> <!-- Datei fehlt -->
	  <n3><strong>Erwartete_gesell._Wirkung</strong></n3><br>
	  <n3><a href="de-project-details-pages-gender.php">Geschlechteraspekte</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-details-pages-solution.php">Lösung/Veränderung/Innovation</a></n3> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

	<main>

  <h1>Erwartete Wirkungen</h1>

  <h2>Wie wird nachhaltige Entwicklung hier verstanden?</h2>

  <p>Nachhaltige Entwicklung ist ein zentrales Anliegen der gesellschaftlichen Transformation zu Beginn des 21. Jahrhunderts. Dafür wurden die 17 <strong>Sustainable Development Goals (SDGs)</strong> mit ihren Unterzielen global ausgehandelt. Die <strong>Deutsche Nachhaltigkeitsstrategie (DNS)</strong> 2021 ist das demokratisch legitimierte Steuerungsinstrument zur Umsetzung der SDGs auf nationaler Ebene.</p>
  <p>Gemäß der Leitprinzipien der DNS bedeutet nachhaltige Entwicklung:
    <ul>
      <li>gleichermaßen den Bedürfnissen der heutigen sowie künftiger Generationen gerecht zu werden – in Deutschland sowie in allen Teilen der Welt</li>
      <li>wirtschaftlich leistungsfähige, sozial ausgewogene und ökologisch verträgliche Entwicklung</li>
      <li>Einhaltung der planetaren Grenzen</li>
      <li>Orientierung an einem Leben in Würde für alle (ein Leben ohne Armut und Hunger; ein Leben, in dem alle Menschen ihr Potenzial in Würde und Gleichheit voll entfalten können)</li>
    </ul>
  </p>

  <p>Die Transformationsbereiche stammen aus der Green Deal Roadmap der Europäischen Kommission. Diese sind thematisch identisch mit den sechs Transformationsbereichen der DNS, jedoch feiner aufgegliedert.</p>
  <p>Als Kernelemente der Nachhaltigkeit wurden Aktivitäten oder Themengebiete herausgearbeitet, durch die zu einer nachhaltigen Entwicklung in den Transformationsbereichen beigetragen wird.</p>

  <p>
  In <a href="oth/Tabelle_SDG_Kernelemente.pdf" target="_blank">dieser Tabelle</a> finden sie <strong>inhaltliche Erläuterungen</strong> der Kernelemente im Monitoring-Tool sowie der zugehörigen SDGs.
  </p>
    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte)
?>

    <title>Titel eintragen (SynSICRIS-Hilfe)</title>

</head>

  <body class="ipw" id="ipw-about">

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
	  <n3><strong>Hintergrund</strong></n3><br>
	  <n3><a href="de-project-details-ipw-ipwhelp.php">Hilfe</a></n3><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-wp.php">Arbeitsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-ep.php">Verwertungsplan</a></n2><br> <!-- Datei fehlt -->
	  <n2><a href="de-project-details-pages.php">Bereiche</a></n2> <!-- Datei fehlt -->
	  */ ?>

  <?php include("includes/sidenav.inc.php"); echo "\n"; // Seitennavigation ?>

  <main>


      <h1>Impact Pathway - Hintergrund</h1>

		<article>
		<p>Das Entwickeln von Wirkungspfaden wird methodisch in der Wirkungsplanung eingesetzt. Wirkungspfade stammen aus der Entwicklungszusammenarbeit und finden zunehmend Anwendung in Forschung und Evaluierung.</p>
    <p>Es werden i.d.R. <strong>Projektpartner</strong> und die <strong>relevanten Interessengruppen</strong> einbezogen. Dies dient dazu, den Wirkungspfad plausibel und durchführbar zu machen, Zustimmung und Engagement zu erzeugen sowie Transparenz über Aktivitäten, Verantwortliche und Beteiligte zu schaffen.
    </p>

<br>

    <p>Besonders empfehlenswerte Literatur ist die Participatory Impact Pathways Analysis (Douthwaite et al., 2009) und der ImpresS Leitfaden für die Erstellung von ex-ante Wirkungspfaden (Blundo Canto et al., 2018).</p>
    <p><div style="margin-left: 8%;">Blundo Canto, G.; Barret, D.; Faure, G.; Hainzelin, E.; Monier, C.; Triomphe, B. (2018): ImpresS ex ante. An approach for building ex ante impact pathways: Cirad. DOI: 10.19182/agritrop/00013 <a href="https://agritrop.cirad.fr/587546/">https://agritrop.cirad.fr/587546/</a></div></p>
    <p><div style="margin-left: 8%;">Douthwaite, B.; Alvarez, S.; Keatinge, J. D. H.; Mackay, R.; Thiele, G., Watts, J. (2009): Participatory impact pathways analysis (PIPA) and research priority assessment. <a href="https://www.researchgate.net/publication/287020432_Participatory_impact_pathways_analysis_PIPA_and_research_priority_assessment">https://www.researchgate.net/publication/287020432_Participatory_impact_pathways_analysis_PIPA_and_research_priority_assessment</a></div></p>



    </p>

<br>

<p>Darüber hinausgehend bietet die <i>Theory of Change</i> ebenfalls Handwerkszeug für die Entwicklung von Wirkungspfaden. Dort steht insbesondere das kritische Hinterfragen der Wirkungsannahmen im Vordergrund, welches für die Überprüfung von Wirkungspfaden sehr nützlich ist. Eine kurze Einführung finden sie <a href="https://www.theoryofchange.org/wp-content/uploads/toco_library/pdf/ToCBasics.pdf">hier.</a>
</p>

  <p>Das allgemeine Impact-Output-Outcome-Impact Modell wurde für das SynSICRIS Monitoring-Tool angepasst, um den <strong>Forschungsprozessen</strong> und <strong>Interaktionen</strong> einen größeren Stellenwert einzuräumen. Zudem wurde der Bezug zu den <strong>förderpolitischen Zielen</strong> hinzugefügt, da diese im Förderkontext erforderlich sind.</p>

<br>

		<img src="img/de_project_ipw_about_allgemeine_wirkungslogik.png">

		</article>


    </main>



	<?php include("includes/footer.inc.php"); echo "\n";?>

  </body>
</html>

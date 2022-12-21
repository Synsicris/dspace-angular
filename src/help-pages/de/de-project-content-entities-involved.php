<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>

  <body class="content" id="content-entities-involved">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
	
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-proj.php">Verbundprojekt_/_Teilprojekt</a></n3><br> <!-- Datei fehlt -->
	  <n3><strong>Beteiligte</strong></n3><br>
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
      <h1>Beteiligte</h1>
      <p> <strong>Projektpartner, Unterauftragnehmer, Kooperationspartner und Akteursgruppen</strong> </p>
      </br>
		<article>
		<h2>Wer ist beteiligt?</h2>
		<p>Das Erfassen der Beteiligten soll zeigen, welche Disziplinen und Handlungsfelder in ihrem Projekt zusammenarbeiten und in welcher Intensität sie in das Projekt eingebunden sind. Die Zusammenarbeit kann auf verschiedenen Wegen stattfinden:

      <ul>
        <li><strong>Zusammenarbeit mit einzelnen Organisationen</strong> (darin sind auch Betriebe und andere Solo-Selbständige eingeschlossen), z.B.

          <ul>
            <li>Projektpartner in einem Verbundprojekt (siehe <a href="de-project-about-entities-proj.php">Verbundprojekt und Teilprojekt</a>)</li>
            <li>Unterauftragnehmer</li>
            <li>Kooperationspartner</li>
          </ul>


          <li><strong>Zusammenarbeit mit Akteursgruppen</strong>
            <ul>
              <li>Akteursgruppen sind Gruppen von Personen und/oder Organisationen, die im Projekt mitwirken aber nicht
                namentlich genannt werden (dies kann dazu dienen, ihre Anonymität zu wahren oder größere Gruppen mit einem geringeren Aufwand zu erfassen)</li>
            </ul>
      </ul>
      Mit der Erfassung der Beteiligten setzen Sie die Grundlage dafür, zu sehen, welche Disziplinen und Handlungsfelder  in welcher Intensität eingebunden und mit dem Projekt adressiert werden, beispielsweise indem sie:
        <ul>
          <li>bei der Erarbeitung von Ergebnissen mitwirken</li>
          <li> ihre Sichtweisen und Erfahrungen einbringen</li>
          <li>mit dem Transfer adressiert werden </li>
          <li>Projektergebnisse nutzen können</li>
        </ul>
        …hierzu wird bei den Interaktionen erfasst, wer jeweils beteiligt ist. Deshalb ist es wichtig, dass Sie zunächst die Beteiligten eingeben, bevor Sie die geplanten Interaktionen beschreiben.

</p>
</br>
		</article>

  <article>
    <p>
        	<img src="img/de_project_about_entities_involved_externe_Beteiligte.png">
          <br>
          </p>
	</article>

    <article>
		<h2>Unterauftragnehmer</h2>
		<p>

		Unterauftragnehmer übernehmen Arbeiten und Aktivitäten <strong>innerhalb eines Teilprojektes</strong>. Die Zusammenarbeit wird
    <strong>vertraglich festgehalten</strong> und <strong>durch den jeweiligen Projektpartner aus dem Budget des Teilprojektes entlohnt.</strong></p>

    <p>Im Monitoring-Tool ist es lediglich notwendig jene Unterauftragnehmer zu erfassen, die <strong>maßgeblich an der Erarbeitung von Ergebnissen mitwirken</strong>. Für ausführende Tätigkeiten (z.B. eine Elektrik installieren, eine Analyse durchführen) sind keine Unterauftragnehmer zu erfassen.</p>
</p>

<br>

    	<img src="img/de_project_about_entities_involved_Unterauftragnehmer.png">
      <br>

		</article>



  </br>


    <article>
      <br>

    <h2>Kooperationspartner</h2>

    <p>

      Kooperationspartner wirken in der Regel <strong>ohne Vertrag </strong>maßgeblich an der Erarbeitung von Ergebnissen im Projekt mit.</p>
      <p>Sie bringen ihre Erfahrungen und ihr Wissen in das Projekt ein, ohne als Projektpartner direkt vom Förderer oder indirekt als
        Unterauftragnehmer in einem Teilprojekt entlohnt zu werden. Das heißt, dass Kooperationspartner normalerweise auf eigene Kosten am Verbundprojekt mitarbeiten.</p>
      <p>Achtung: Der Übergang zwischen Kooperationspartner und Akteursgruppe ist fließend. Sie nehmen die Einordnung selbst vor,
        je nachdem was passender ist (Leitfragen zur Unterscheidung finden Sie weiter unten).

    </p>

    <br>


    <img src="img/de_project_about_entities_involved_Kooperationspartner.png">

  </br>
    </article>
</br>
    <article>
      <br>


    <h2>Akteursgruppe</h2>


    <p>

      Eine Akteursgruppe ist eine Gruppe von Personen oder Organisationen aus demselben Tätigkeitsbereich.
      Relevant sind für das Monitoring-Tool jene Akteursgruppen, mit denen das Projekt zusammenarbeitet oder die durch die Projektergebnisse adressiert werden.</p>
      <p>    Genau wie die Kooperationspartner wirken auch die Akteursgruppen in der Regel <strong>ohne vertragliche Bindung</strong> im Verbundprojekt mit.</p>
      <p>Anders als bei den Kooperationspartnern wird bei den Akteursgruppen eine Zusammenfassung von Organisationen und Personen zu einer Gruppe vorgenommen.
          Die Zusammenarbeit mit einer Akteursgruppe ist eher <strong>unverbindlich</strong>, die dahinterstehenden Organisationen möchten eher <strong>anonym</strong> bleiben
          und <strong>die Zusammensetzung der Gruppe</strong> wechselt gegebenenfalls
        (Leitfragen zur Unterscheidung finden Sie im folgenden Abschnitt).

    </p>
    <br>

    <img src="img/de_project_about_entities_involved_Akteursgruppen.png">
    <br>
    </article>
    <br>

    <article>
    <h2>Akteursgruppe oder Kooperationspartner? Sie entscheiden!</h2>


    <p>
      Der Übergang zwischen Kooperationspartner und Akteursgruppe ist fließend. Folgende Leitfragen geben eine Hilfestellung, um die beteiligten Organisationen im Projekt passend einzuordnen:

      <ol>
        <li>Möchte die Organisation für den Förderer <strong>sichtbar werden</strong> oder <strong>anonym</strong> bleiben? </li>
            <ul>
                <li>Sichtbarkeit gewünscht: Kooperationspartner </li>
                <li> Anonymität gewünscht: Akteursgruppe</li>
            </ul>
            <br>
        <li>Wirkt  <strong>eine einzelne Organisation </strong> aus einer bestimmten Disziplin bzw. Handlungsfeld
          oder  <strong>mehrere Organisationen/Personen </strong> aus einer bestimmten Disziplin oder einem Handlungsfeld mit? </li>
            <ul>
                <li>eine einzelne Organisation: Kooperationspartner </li>
                <li> mehrere Organisationen/Personen: Akteursgruppe</li>
            </ul>
            <br>


        <li> <strong>Wechseln  </strong>die beteiligten Organisationen/Personen?</li>
            <ul>
                <li>Nein: Kooperationspartner </li>
                <li> Ja: Akteursgruppe</li>
            </ul>
            <br>

    </ol>
    </p>
    </article>
    <br>

    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

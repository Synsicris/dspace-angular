<?php session_start(); ?>

<!DOCTYPE html>
<html lang="de">

<head>
<?php 
include("../includes/head-content.inc.php"); echo "\n"; // Angaben im Head (Meta, Stil, Scripte) 
?>
 
    <title>Titel eintragen (SynSICRIS-Hilfe)</title>   
  
</head>

  <body class="content" id="content-entities-objectives">
  
  <?php include("includes/header.inc.php"); echo "\n"; // Header ("SynSICRIS Hilfe") ?>
	
	 <?php /* Alte Navigation kann geloescht werden.
	 <h1>&nbsp;</h1>
	 <!-- Platzhalter deutsch / englisch für Auswahl anderer Sprache -->
      <n1><a href="de-project-about.php">Über_das_Tool</a></n1><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-objectives.php">Hintergrund_/_Ziele</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-difference.php">Tool_ersetzt_Textdokumente</a></n2><br> <!-- geprueft, unterschiedliche Titel -->
	  <n2><a href="de-project-about-entities.php">Inhalte_unterscheiden</a></n2><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-proj.php">Verbundprojekt_/_Teilprojekt</a></n3><br> <!-- Datei fehlt -->
	  <n3><a href="de-project-about-entities-involved.php">Beteiligte</a></n3><br> <!-- Datei fehlt -->
	  <n3><strong>Ziele</strong></n3><br>
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
      <h1>Ziele</h1>
		<article>

      <h2>Wie werden die Projektziele im Monitoring-Tool dargestellt?</h2>
      <p>In Ihrer Vorhabensbeschreibung gibt es die Abschnitte <em>Gesamtziele des Projektes</em> und <em>wissenschaftlich-technische Arbeitsziele</em>. Im Monitoring-Tool geben Sie diese Ziele in Ihren Impact Pathway ein, unterteilt in Projektziele im engeren Sinne (Säule 2 und 3) und Ziele im Sinne von intendierten Wirkungen (Säule 4 und 5).

    </p>
    <p><strong>Projektziele im engeren Sinne:</strong></p>
      <ul>
        <li>In Säule 2 sind die klassischen wissenschaftlich-technischen Arbeitsziele des Projekts eingetragen.</li>
        <li>In Säule 3 werden alle Ziele im Bereich Interaktion und Transfer hervorgehoben, unabhängig davon, ob sie Teil des Forschungsprozesses sind (wie in der transdisziplinären Forschung) oder ob sie als nachgelagert zum Forschungsprozess angesehen werden.</li>
        <li>Wichtig ist in Säule 2 und 3, dass Sie zwischen den Zielen und den Maßnahmen/Arbeiten im Projekt unterscheiden, die zum Erreichen dieser Ziele umgesetzt werden. Die Ziele werden auf der ersten Ebene des Impact Pathway erfasst. Die Maßnahmen/Arbeiten tragen Sie zu jedem einzelnen Ziel in der zweiten Ebene des Impact Pathway ein (siehe <a href="de-project-about-structure.php">Inhalte strukturieren</a>).</li>


      </ul>

      <p><strong>Ziele im Sinne von intendierten Wirkungen:</strong></p>
        <ul>
          <li>In Säule 4 verdeutlichen Sie die Ziele in Bezug auf die mögliche Nutzung der Ergebnisse in Form einer Lösung, Veränderung oder Innovation sowie weitere Bereiche, in denen Sie Ihre Zielsetzung in Bezug auf die Anwendung verdeutlichen können, z.B. dass eine Ausgründung oder Patentanmeldung beabsichtigt ist.</li>
          <li>In Säule 5 verdeutlichen Sie die Ziele des Projektes in Bezug auf die erwartete gesellschaftliche Wirkung des Projektes. Also das, was sich für die Gesellschaft positiv verändert, wenn Projektergebnisse genutzt werden.</li>
        </ul>


  <p>
  <img src="img/de_project_about_entities_objectives_IP_Ziele_d_Projekts.png">
</p>

  <p>
  <img src="img/de_project_about_entities_objectives_Projektziele_engerer_Sinn.png">
</p>

<p>
		<h2>Leitfragen zur Unterscheidung von „wissenschaftlich-technischem Arbeitsziel“ und „Ziel für Interaktion und Transfer“</h2>
		<p><strong>Wissenschaftlich-technisches Arbeitsziel:</strong>
        <ul>
            <li>Was soll gemessen oder untersucht werden?</li>
            <li>Welche Hypothesen sollen überprüft werden? </li>
        </ul>

      </p>

      <p><strong>Ziel für Interaktion und Transfer:</strong>
        <ul>
          <li>Welche Ziele werden durch die Zusammenarbeit der Partner angestrebt?</li>
          <li>Was soll im Austausch mit anderen Akteuren herausgefunden werden?</li>
          <li>Welche Anforderungen oder Erfahrungen von Akteuren sollen in das Projekt integriert werden?</li>
          <li>Was soll im Transfer erreicht werden? Welche „Outputs“ werden für den Wissenstransfer erstellt?</li>
        </ul>

      </p>

    </p>
		</article>


    </main>


	<?php include("includes/footer.inc.php"); echo "\n";?>
    
  </body>
</html>

import { Component, OnInit } from '@angular/core';
import { LocaleService } from '../../core/locale/locale.service';

@Component({
  selector: 'ds-development-funding',
  templateUrl: './development-funding.component.html',
  styleUrls: ['./development-funding.component.scss']
})
export class DevelopmentFundingComponent implements OnInit {
  public fourscienceLink: any;
  public tlcLink: any;
  public uniKasselLink: any;
  public libKasselLink: any;
  public disyLink: any;
  public eresultLink: any;
  public rexLink: any;
  public tibLink: any;
  public userlutionsLink: any;
  public zbmedLink: any;

  constructor(private locale: LocaleService) { }

  ngOnInit(): void {
    if (this.locale.getCurrentLanguageCode() === 'de') {
      this.fourscienceLink = 'https://www.4science.com/';
      this.tlcLink = 'https://www.the-library-code.de/index.de.html';
      this.uniKasselLink = 'https://www.uni-kassel.de/fb11agrar/fachgebiete-/-einrichtungen/oekologischer-land-und-pflanzenbau/startseite';
      this.libKasselLink = 'https://www.uni-kassel.de/ub/';
      this.disyLink = 'https://www.disy.net/';
      this.rexLink = 'http://rex-publica.de/';
      this.tibLink = 'https://www.tib.eu/de/';
      this.eresultLink = 'https://www.eresult.de/';
      this.userlutionsLink = 'https://userlutions.com/';
      this.zbmedLink = 'https://www.zbmed.de/';
    } else {
      this.fourscienceLink = 'https://www.4science.com/';
      this.tlcLink = 'https://www.the-library-code.de/index.en.html';
      this.uniKasselLink = 'https://www.uni-kassel.de/fb11agrar/en/sections-/-facilities/organic-farming-and-cropping-systems/home';
      this.libKasselLink = 'https://www.uni-kassel.de/ub/en/';
      this.disyLink = 'https://www.disy.net/en/';
      this.rexLink = 'http://rex-publica.de/';
      this.tibLink = 'https://www.tib.eu/en/';
      this.eresultLink = 'https://www.eresult.de/english/';
      this.userlutionsLink = 'https://userlutions.com/en/';
      this.zbmedLink = 'https://www.zbmed.de/en/';
    }
  }

}

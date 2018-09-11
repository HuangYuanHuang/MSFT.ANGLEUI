import { Injectable } from '@angular/core';

const themeA = require('../../../angle-theme/styles/themes/theme-a.scss');
const themeB = require('../../../angle-theme/styles/themes/theme-b.scss');
const themeC = require('../../../angle-theme/styles/themes/theme-c.scss');
const themeD = require('../../../angle-theme/styles/themes/theme-d.scss');
const themeE = require('../../../angle-theme/styles/themes/theme-e.scss');
const themeF = require('../../../angle-theme/styles/themes/theme-f.scss');
const themeG = require('../../../angle-theme/styles/themes/theme-g.scss');
const themeH = require('../../../angle-theme/styles/themes/theme-h.scss');
@Injectable()
export class ThemesService {

    styleTag: any;
    defaultTheme = 'G';

    constructor() {
        this.createStyle();
        this.setTheme(this.defaultTheme);
    }

    private createStyle() {
        const head = document.head || document.getElementsByTagName('head')[0];
        this.styleTag = document.createElement('style');
        this.styleTag.type = 'text/css';
        this.styleTag.id = 'appthemes';
        head.appendChild(this.styleTag);
    }

    setTheme(name) {
        switch (name) {
            case 'A':
                this.injectStylesheet(themeA);
                break;
            case 'B':
                this.injectStylesheet(themeB);
                break;
            case 'C':
                this.injectStylesheet(themeC);
                break;
            case 'D':
                this.injectStylesheet(themeD);
                break;
            case 'E':
                this.injectStylesheet(themeE);
                break;
            case 'F':
                this.injectStylesheet(themeF);
                break;
            case 'G':
                this.injectStylesheet(themeG);
                break;
            case 'H':
                this.injectStylesheet(themeH);
                break;
        }
    }

    injectStylesheet(css) {
        this.styleTag.innerHTML = css;
    }

    getDefaultTheme() {
        return this.defaultTheme;
    }

}

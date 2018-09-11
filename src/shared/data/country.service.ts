import { Injectable, Injector } from '@angular/core';
import { CountryData } from './country';
import { LocalizationService } from '@abp/localization/localization.service';
import { AppConsts } from '@shared/AppConsts';
import { NzTreeNode } from 'ng-zorro-antd';

@Injectable()
export class CountryService {
    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    public treeNodes: NzTreeNode[] = [];
    constructor(private localization: LocalizationService) {

    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }
}

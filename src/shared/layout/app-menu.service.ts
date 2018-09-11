import { Injectable, Injector } from '@angular/core';
import { MenuItem } from './menu-item';
import { menuItems } from '@shared/AppMenu'
import { LocalizationService } from '@abp/localization/localization.service';
import { AppConsts } from '@shared/AppConsts';
import { NzTreeNode } from 'ng-zorro-antd';

@Injectable()
export class AppMenuService {
    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    public treeNodes: NzTreeNode[] = [];
    constructor(private localization: LocalizationService) {
        menuItems.forEach(d => this.transTitle(d));
        menuItems.forEach(d => {
            const diabled = d.permissionName === '';
            const node = new NzTreeNode({
                title: d.name,
                key: d.permissionName === '' ? this.GetGUID() : d.permissionName,
                children: [],
                disabled: diabled
            });
            this.treeNodes.push(node);
            this.loadTree(d, node);
        });
        this.treeNodes.forEach(d => this.initTreeLeaf(d));
    }
    getNewTreeNode(isDisable?: boolean) {
        const res = [];
        menuItems.forEach(d => {
            const diabled = d.permissionName === '';
            const node = new NzTreeNode({
                title: d.name,
                key: d.permissionName === '' ? this.GetGUID() : d.permissionName,
                children: [],
                disabled: isDisable ? true : diabled
            });
            res.push(node);
            this.loadTree(d, node);
        });
        res.forEach(d => this.initTreeLeaf(d));
        return res;
    }
    getSelectKeys(node: NzTreeNode, resArr: Set<string>) {
        resArr.add(node.key);
        if (node.children) {
            node.children.forEach(d => this.getSelectKeys(d, resArr));
        }
    }
    initTreeLeaf(node: NzTreeNode) {
        if (node.children && node.children.length > 0) {
            node.children.forEach(d => {
                this.initTreeLeaf(d);
            });
        } else {
            node.isLeaf = true;
        }
    }
    transTitle(node: MenuItem) {
        node.name = this.l(node.name);
        if (node.items) {
            node.items.forEach(d => {
                this.transTitle(d);
            });
        }
    }
    loadTree(node: MenuItem, treeNode: NzTreeNode) {
        if (node.items) {
            node.items.forEach(d => {
                const diabled = d.permissionName === '';
                const temp = new NzTreeNode({
                    title: d.name,
                    key: d.permissionName === '' ? this.GetGUID() : d.permissionName,
                    children: [],
                    disabled: diabled,
                }, treeNode);
                treeNode.children.push(temp);
                this.loadTree(d, temp);
            });
        }
    }
    public GetGUID() {
        let guid = '';
        for (let i = 1; i <= 12; i++) {
            const n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
                guid += '-';
            }
        }
        return guid;
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

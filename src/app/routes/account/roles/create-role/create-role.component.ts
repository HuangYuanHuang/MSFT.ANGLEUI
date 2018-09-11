import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RoleServiceProxy, CreateRoleDto, ListResultDtoOfPermissionDto, PermissionDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTreeNode, NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd';
import { AppMenuService } from '@shared/layout/app-menu.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'create-role-modal',
    templateUrl: './create-role.component.html'
})
export class CreateRoleComponent extends AppComponentBase implements OnInit {
    active = false;
    saving = false;
    validateForm: FormGroup;
    role: CreateRoleDto = null;
    @ViewChild('nzTree') nzTree: NzTreeComponent;
    @ViewChild('nzOperationTree') nzOperaTree: NzTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    searchValue;
    nodes = [];
    isVisible = false;
    operationNodes = [];
    nzDefaultCheckedKeys = [];
    permissions: PermissionDto[];
    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy,
        private menuService: AppMenuService, private fb: FormBuilder
    ) {
        super(injector);


    }
    mouseAction(name: string, e: NzFormatEmitEvent): void {
        const nodes = e.checkedKeys;
        this.operationNodes = [];
        nodes.forEach(d => {
            const tempNode = new NzTreeNode({ title: d.title, key: d.key, checked: false, children: [] });
            const find = this.permissions.filter(f => f.name.includes(d.key) && f.name !== d.key);
            if (find && find.length > 0) {
                for (let i = 0; i < find.length; i++) {
                    tempNode.children.push(new NzTreeNode(
                        { title: find[i].displayName, key: find[i].name, isLeaf: true, checked: false }, tempNode));
                }

            }
            this.operationNodes.push(tempNode);
        });
    }
    ngOnInit(): void {
        this.validateForm = this.fb.group({
            roleName: [null, [Validators.required]],
            displayName: [null, [Validators.required]],
            description: [null],
            permissionTree: [null],
            operationTree: [null]
        });
        this._roleService.getAllPermissions()
            .subscribe((permissions: ListResultDtoOfPermissionDto) => {
                this.permissions = permissions.items;
            });
    }

    show(): void {
        this.active = true;
        this.role = new CreateRoleDto();
        this.role.init({ isStatic: false });
        this.operationNodes = [];
        this.nodes = this.menuService.getNewTreeNode();
        this.isVisible = true;
        this.validateForm.reset();

    }
    submitForm(): void {

        this.save();
    }

    save(): void {
        const permissions = [];
        const mapPerm = new Set();
        this.nzTree.getCheckedNodeList().forEach(d => {
            mapPerm.add(d.key);
        });
        this.nzOperaTree.getCheckedNodeList().forEach(d => {
            this.menuService.getSelectKeys(d, mapPerm);
        });
        mapPerm.forEach(d => {
            permissions.push(d);
        })
        this.role.permissions = permissions;

        this.saving = true;
        this._roleService.create(this.role)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }
    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    close(): void {
        this.active = false;
        this.isVisible = false;
    }
}

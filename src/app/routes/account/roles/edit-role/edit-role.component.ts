import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RoleServiceProxy, RoleDto, ListResultDtoOfPermissionDto, PermissionDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTreeNode, NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd';
import { AppMenuService } from '@shared/layout/app-menu.service';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'edit-role-modal',
    templateUrl: './edit-role.component.html'
})
export class EditRoleComponent extends AppComponentBase implements OnInit {
    @ViewChild('editRoleModal') modal: ModalDirective;
    @ViewChild('modalContent') modalContent: ElementRef;
    @ViewChild('nzTree') nzTree: NzTreeComponent;
    @ViewChild('nzOperationTree') nzOperationTree: NzTreeComponent;
    active = false;
    saving = false;
    validateForm: FormGroup;
    role: RoleDto = null;
    searchValue;
    nodes = [];
    operationNodes = [];
    nzDefaultCheckedKeys = [];
    nzOperaCheckedKeys = [];
    permissions: PermissionDto[];
    isVisible = false;
    nzSelectedIndex = 0;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy, private menuService: AppMenuService, private fb: FormBuilder
    ) {
        super(injector);
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

    show(id: number): void {
        this.nzSelectedIndex = 0;
        this._roleService.get(id)
            .pipe(finalize(() => {
                this.active = true;
                this.isVisible = true;
            }))
            .subscribe((result: RoleDto) => {
                this.role = result;
                this.nodes = this.menuService.getNewTreeNode(this.role.isStatic);
                this.nzDefaultCheckedKeys = this.role.permissions;
                setTimeout(() => {
                    this.setOperm(this.nzTree.getCheckedNodeList());

                }, 1000);

            });
    }
    getTitle() {
        if (this.role && this.role.isStatic) {
            return 'Edit Role (Static)';
        }
        return 'Edit Role';
    }
    mouseAction(name: string, e: NzFormatEmitEvent): void {
        this.setOperm(e.checkedKeys);
    }
    setOperm(nodes: NzTreeNode[]) {
        this.nzOperaCheckedKeys = [];
        this.operationNodes = [];
        nodes.forEach(d => {
            const tempNode = new NzTreeNode({ title: d.title, key: d.key, checked: false, children: [], disabled: this.role.isStatic });
            const find = this.permissions.filter(f => f.name.includes(d.key) && f.name !== d.key);
            if (find && find.length > 0) {
                for (let i = 0; i < find.length; i++) {
                    tempNode.children.push(new NzTreeNode({
                        title: find[i].displayName, key: find[i].name,
                        isLeaf: true, disabled: this.role.isStatic
                    }, tempNode));
                    if (this.role.permissions.indexOf(find[i].name) !== -1) {
                        this.nzOperaCheckedKeys.push(find[i].name);
                    }

                }

            }
            this.operationNodes.push(tempNode);
        });
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
        this.nzOperationTree.getCheckedNodeList().forEach(d => {
            this.menuService.getSelectKeys(d, mapPerm);
        });
        mapPerm.forEach(d => {
            permissions.push(d);
        })
        this.role.permissions = permissions;
        this.saving = true;
        this._roleService.update(this.role)
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

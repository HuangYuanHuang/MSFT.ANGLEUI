import { Component, OnInit, ViewChild } from '@angular/core';
import { CropperComponent } from '../cropper/cropper.component';
import { UserAspServiceProxy, ChangeUserProfileDto, UserDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    settingActive = 1;
    isUploadAccount = false;
    isLoadCropper = true;
    @ViewChild('cropper') cropperComponet: CropperComponent;
    currentUser: UserDto;
    isImageLoad = false;
    constructor(private userAspProxy: UserAspServiceProxy) {
        this.currentUser = AppConsts.currentUser;
    }

    ngOnInit() {
    }
    croppedEvent(data) {
        this.isImageLoad = true;
    }
    UploadImage() {
        const changeDto = new ChangeUserProfileDto();
        changeDto.bio = this.currentUser.bio;
        changeDto.id = this.currentUser.id;
        changeDto.icon = this.cropperComponet.getBase64Image();
        this.isUploadAccount = true;

        this.userAspProxy.changeUserProfie(changeDto).subscribe(d => {
            abp.notify.success('Update Image Success!');
            this.isUploadAccount = false;
            this.isImageLoad = false;
            this.isLoadCropper = false;
            AppConsts.currentUser.icon = d.icon;
            setTimeout(() => this.isLoadCropper = true, 1000);
        });
    }
    UploadAccount() {
        const changeDto = new ChangeUserProfileDto();
        changeDto.bio = this.currentUser.bio;
        changeDto.id = this.currentUser.id;
        this.isUploadAccount = true;
        this.userAspProxy.changeUserProfie(changeDto).subscribe(d => {
            abp.notify.success('Update Accout Success!');
            this.isUploadAccount = false;
        });
    }
}

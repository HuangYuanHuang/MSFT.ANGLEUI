import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
    selector: 'app-cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {

    name: string;
    data1: any;
    cropperSettings: CropperSettings;

    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
    @Output() croppedEvent = new EventEmitter<any>();
    constructor() {
        this.name = 'Angular2';
        this.cropperSettings = new CropperSettings();

        this.cropperSettings.noFileInput = true;

        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;

        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;

        this.cropperSettings.canvasWidth = 460;
        this.cropperSettings.canvasHeight = 400;

        this.cropperSettings.minWidth = 100;
        this.cropperSettings.minHeight = 100;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,.25)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

        this.cropperSettings.rounded = true;

        this.data1 = {};
    }

    setRoundedMethod(value: boolean) {
        this.cropperSettings.rounded = value;
    }

    cropped(bounds: Bounds) {
        if (this.croppedEvent) {
            this.croppedEvent.emit(bounds);
        }
        console.log(bounds);
    }
    getBase64Image(): string {
        if (this.data1) {
            return this.data1.image;
        }
        return '';
    }
    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    ngOnInit() {
    }

}

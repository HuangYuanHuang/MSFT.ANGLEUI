import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
    selector: 'app-cropper',
    templateUrl: './cropper.component.html',
    styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {
    @Input() width;
    @Input() height;
    @Input() image;
    name: string;
    data1: any;
    cropperSettings: CropperSettings;
    currentSize = 'Defalut';
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    constructor() {
        this.name = 'Angular2';

    }


    setRoundedMethod(value: boolean) {
        this.cropperSettings.rounded = value;
    }
    getBase64Image(): string {
        if (this.data1) {
            return this.data1.image;
        }
        return '';
    }
    cropped(bounds: Bounds) {

    }
    init(width: number, height: number, image: any) {
        this.cropperSettings = new CropperSettings();

        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = width;
        this.cropperSettings.height = height;
        this.cropperSettings.preserveSize = false;
        this.cropperSettings.croppedWidth = width;
        this.cropperSettings.croppedHeight = height;

        this.cropperSettings.canvasWidth = 460;
        this.cropperSettings.canvasHeight = 400;


        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,.25)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

        this.cropperSettings.rounded = false;

        this.data1 = {};

    }
    fileChangeListener($event) {
        this.image = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = (loadEvent: any) => {
            this.image.src = loadEvent.target.result;
            that.cropper.setImage(this.image);
        };

        myReader.readAsDataURL(file);
    }

    ngOnInit() {
        this.init(this.width, this.height, this.image);
    }

}

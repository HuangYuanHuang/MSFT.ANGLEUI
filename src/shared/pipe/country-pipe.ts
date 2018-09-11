import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countryPipe'
})
export class CountryPipePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value || !args) {
            return value;
        }
        return value.filter(node => {
            return node.text.toLowerCase().indexOf(args.toLowerCase()) !== -1;
        });

    }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'namePipe'
})
export class NamePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value || !args) {
            return value;
        }
        return value.filter(node => {
            return node.user.fullName.toLowerCase().indexOf(args.toLowerCase()) !== -1;
        });

    }

}

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'parseJsonDate'
})
export class ParseJsonDatePipe implements PipeTransform {

	constructor(private datePipe: DatePipe) {}

	transform(value: any): any {
		// format the date
		if(value != null){
			let val = value.replace('/Date(', '').replace(')/', '');
			
			return this.datePipe.transform(val, 'dd/MM/yyyy');
		}
	}

}

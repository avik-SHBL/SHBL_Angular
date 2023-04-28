import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'inputJsonDate'
})
export class InputJsonDatePipe implements PipeTransform {

	constructor(private datePipe: DatePipe) {}

	transform(value: any): any {
		// format the date
		if(value != null){
			let val = value.replace('/Date(', '').replace(')/', '');
			
			return this.datePipe.transform(new Date(parseInt(val)), 'yyyy-MM-dd');
		}
	}

}

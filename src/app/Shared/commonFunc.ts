export class CommonFunc {

	public static handleError(err: any) {
		const error_response = err.json();
        console.log(error_response);
	}  
 }

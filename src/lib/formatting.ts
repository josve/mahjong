//various shared formatting functions

//returns a formatted date string based on timestamp, for example match time
export function formatDate(time: Date | string): string {
	const date = new Date(time)
	return date.toLocaleDateString("sv-SE", {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

//make first letter capital
export function capitalize(value: string): string {
	//make first letter 
	if (value.length>0)
	{
		value = value[0].toUpperCase() + value.substring(1,value.length)
	}
	return value
}

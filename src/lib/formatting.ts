//various shared formatting functions

//returns a formatted date string based on timestamp, for example match time
export function formatDate(time): String {
	var date = new Date(time)
	var string = date.toLocaleDateString("sv-SE",{
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

  return string
}

//make first letter capital
export function capitalize(string): String {
	//make first letter 
	if (string.length>0)
	{
		string = string[0].toUpperCase() + string.substring(1,string.length)
	}
	return string
}

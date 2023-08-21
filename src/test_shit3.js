
function Log(f,message,level="log"){
	console.log(f.name);
}

function do_stuff(){
	Log(self, "some");
	
	//this.log();
	console.log("doing stuff");
}

do_stuff();
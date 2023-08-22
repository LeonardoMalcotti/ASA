//let rnd = Math.floor(Math.random() * (to_visit.length));

class exec{
	
	actions;
	stopped = true;
	
	async do_action(action){
		console.log(action);
	}
	
	async loop(){
		while(true){
			
			if(this.actions.length !== 0){
				this.stopped = false;
				await this.do_action(this.actions.shift());
			} else {
				this.stopped = true;
			}
			
			await new Promise((r) => {setTimeout(r)});
		}
	}
}

class filler{
	counter = 1;
	
	executor;
	
	constructor() {
		this.executor = new exec();
		this.executor.actions = [];
	}
	
	async loop(){
		while (true){
			while (!this.executor.stopped){
				await new Promise((r) => {setTimeout(r)});
			}
			
			let i = 10;
			while (i >=0){
				this.executor.actions.push("action " + i + " | " + this.counter);
				i--;
			}
			this.counter ++;
			await new Promise((r) => {setTimeout(r)});
		}
	}
}

let f = new filler();
f.executor.loop();
f.loop();
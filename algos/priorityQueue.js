var PriorityQueue = function(){
    this.collection = []

    this.print = function(){
        console.log(this.collection)
    }

    this.enqueue = function(elt){
        if(this.isEmpty()){
            this.collection.push(elt)
        }else{
            var added = false

            for(var i = 0; i < this.collection.length; i++){
                if(elt[1] < this.collection[i][1]){
                    //checking priorities
                    this.collection.splice(i, 0, elt)
                    added = true
                    break
                }
            }
            if(!added){
                this.collection.push(elt)
            }
        }
    }

    this.dequeue = function(){
        var value = this.collection.shift()
        return value[0]
    }

    this.front = function(){
        return this.collection[0]
    }

    this.size = function(){
        return this.collection.length
    }

    this.isEmpty = function(){
        return(this.collection.length === 0)
    }
}//end PriorityQueue

//usage

var lag_queue = new PriorityQueue()

lag_queue.enqueue(["BRT", 1])
lag_queue.enqueue(["Ambulance", 5])
lag_queue.enqueue(["school bus", 2])
lag_queue.enqueue(["Staff bus", 3])
lag_queue.enqueue(["Danfo", 4])
lag_queue.enqueue(["Okada", 5])
lag_queue.enqueue(["Honda", 2])
lag_queue.print()
lag_queue.dequeue()
console.log("==================")
lag_queue.print()


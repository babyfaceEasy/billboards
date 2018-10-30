var Queue =  function(){
    this.collection = []

    this.print = function(){
        console.log(this.collection)
    }

    this.enqueue = function(elt){
        this.collection.push(elt)
    }

    this.dequeue = function(){
        return this.collection.shift()
    }

    this.front = function(){
        return this.collection[0]
    }

    this.size = function(){
        return this.collection.length
    }

    this.isEmpty = function(){
        return (this.collection.length === 0)
    }

}//end of Queue

//test use

var lag_queue = new Queue()

lag_queue.enqueue("young boy")
lag_queue.enqueue("female student")
lag_queue.enqueue("old market woman")
lag_queue.print()
lag_queue.dequeue()
lag_queue.print()
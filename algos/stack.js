var Stack = function(){
    this.count = 0
    this.storage = {}

    this.push = function(value){
        this.storage[this.count] = value
        this.count++
    }

    this.pop = function(){
        if (this.count == 0) {
            return undefined
        }
        this.count--
        var temp = this.storage[this.count]
        delete this.storage[this.count]
        return temp
    }

    this.size = function(){
        return this.count
    }
    this.peek = function(){
        return this.storage[this.count-1]
    }
}//end of Stack

//test the app
var myStack = new Stack()

myStack.push(1)
myStack.push(2)
myStack.push(3)

console.log(myStack.peek())
console.log(myStack.pop())
console.log(myStack.peek())
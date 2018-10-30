var mySet = function(){
    //the goal is to store elements in any order as well as gurantee no duplicates

    this.collection = []

    this.has =  function(value){
        return (this.collection.indexOf(value) !== -1)
    }

    this.add = function(value){
        if(!this.has(value)){
            this.collection.push(value)
        }
    }

    this.remove = function(value){
        let loc = this.collection.indexOf(value)
        if(loc !== -1 ){
            this.collection.splice(loc, 1)
        }
    }

    this.values = function(){
        return this.collection
    }

    //union
    this.union = function(otherSet){
        let unionSet = new mySet()
        let firstSet = this.values()
        let otherSetVals = otherSet.values()

        firstSet.forEach(element => {
            //console.log(`DEBUG: ${element}`)
            unionSet.add(element)
        })

        otherSetVals.forEach(element => {
            //console.log(`DEBUG: ${element}`)
            unionSet.add(element)
        })

        return unionSet
    }

    //difference whats in set A and not ins setB
    this.difference = function(otherSet){
        let differenceSet = new mySet()
        let firstSet = this.values()

        firstSet.forEach(element => {
            if (!otherSet.has(element)){
                differenceSet.add(element)
            }
        })
        return differenceSet
    }

    //this i to check if a set is sub set of another set i.e contains all deir elements
    this.subset = function(otherSet){
        var firstSet = this.values()
        return firstSet.every( elt => {
            return otherSet.has(elt)
        })
    }

}

//test the app
var setA =  new mySet()
var setB = new mySet()
setA.add("a")
setA.add("b")
setB.add("a")
setB.add("b")


console.log(setA.values())
console.log(setB.values())

setC = setA.union(setB)
setD = setA.difference(setB)
isSubset =  setA.subset(setB)

console.log(setC.values())
console.log(setD.values())
console.log(isSubset)
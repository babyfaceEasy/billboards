//Binary trees can have only two child nodes at most
//binary search trees are ordered each left sub child is <= to the  parent root node
//and each right sub child node is >= to the root node

class Node{
    constructor(data, left = null, right = null){
        this.data = data
        this.left = left
        this.right = right
    }
}

class BST{
    constructor(){
        this.root = null
    }

    add(data){
        const node = this.root
        if(node === null){
            this.root = new Node(data)
            return
        }else{
            const searchTree = function(node){
                if(data < node.data){
                    if(node.left === null){
                        node.left = new Node(data)
                        return
                    } else if (node.left !== null){
                        return searchTree(node.left)
                    }
                } else if (data > node.data){
                    if(node.right === null){
                        node.right = new Node(data)
                        return
                    } else if (node.right !== null){
                        return searchTree(node.right)
                    }
                } else {
                    return null
                }
            }//end of searchTree()
            return searchTree(node)
        }

    }

    findMin(){
        let current = this.root
        while(current.left !== null){
            current = current.left
        }
        return current.data
    }

    findMax(){
        let current = this.root
        while (current.right !== null){
            current = current.right
        }
        return current.data
    }
    find(data){
        let current = this.root
        while(current.data !== data){
            if (data < current.data) {
                current = current.left
            } else {
                current = current.right
            }
        }
        if(current === null){
            return null
        }
        return current
    }
    isPresent(data){
        let current = this.root
        while(current){
            if(data === current.data){
                return true
            }
            if( data < current.data){
                current = current.left
            } else {
                current = current.right
            }
        }

        return false
    }

    remove(data){
        const removeNode = function(node, data){
            if(node == null){
                return null
            }
            if(data == node.data){
                //node has no children
                if(node.left == null && node.right == null){
                    return null
                }
                //node has no left child
                if(node.left == null){
                    return node.right
                }
                //node has no right child
                if(node.rigth == null){
                    return node.left
                }
                //node has two children
                var tempNode = node.right;
                while(tempNode.left !== null){
                    tempNode = tempNode.left
                }
                node.data = tempNode.data
                node.right = removeNode(node.right, tempNode.data)
                return node
            } else if(data < node.data){
                node.left = removeNode(node.left, data)
                return node
            } else {
                node.right = removeNode(node.right, data)
                return node
            }//end of if == node.data
        }//end of removeNode

        this.root = removeNode(this.root, data)
    }
}//end of BST

//usage
const bst = new BST()

bst.add(4)
bst.add(2)
bst.add(6)
bst.add(1)
bst.add(3)
bst.add(5)
bst.add(7)
bst.remove(4)
console.log(bst.findMin())
console.log(bst.findMax())
bst.remove(7)
console.log(bst.findMax())
console.log(bst.isPresent(4))
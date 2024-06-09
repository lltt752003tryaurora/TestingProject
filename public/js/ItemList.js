function ItemList(){
    this.list = [];

    this.addItemMethod = function(itemObj){
        this.list.push(itemObj);
    }

    this.findIndexMethod = function(id) {
        var indexItem = -1;
        this.list.map(function(item,index) {
            if(item.id === id){
                indexItem = index;
            }
        });

        return indexItem;
    }
    this.deleteItemMethod = function(id) {
        var indexItem = this.findIndexMethod(id);

        if(indexItem > -1){

            this.list.splice(indexItem,1);
        }else{
            alert("Can't delete item");
        }
    }

    this.getItemMethod = function(id) {
        var indexItem = this.findIndexMethod(id);

        if(indexItem > -1){
            return this.list[indexItem];
        }else{
            alert("Can't get item");
        }
    }

    this.editItemMethod = function(id,value){
        var indexItem = this.findIndexMethod(id);

        if(indexItem > -1){

            this.list[indexItem].value = value;
        }else{
            alert("Can't edit item");
        }
    }


}
function Table() {

}

Table.prototype.generate = function(mainTableName) {
	let list = [];

	let master = GAME.json['tables'][mainTableName];
	if (master != null && master.length > 0) {
		master.forEach(single_item => {
			if (single_item['table'] != null && single_item['table'] != undefined) {
				this.addItem(list, this.generate(single_item['table']), single_item['weight']);
			} else {
				this.addItem(list, single_item['id'], single_item['weight']);
			}
		});
	}

	let index = Math.floor(Math.random() * (list.length-1));
    return list[index];
};

Table.prototype.addItem = function(list, itemID, quantity) {
	for (let i=0; i<quantity;i++) {
		list.push(itemID);
	}
};
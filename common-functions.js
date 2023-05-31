function randomFromRange(from, to) {
	return Math.round((Math.random() * (to - from)) + from);
}

function deleteRandomFromArray(array) {
	var index = randomFromRange(0, array.length - 1);
	var re = array[index]
	array.splice(index, 1);
	return re;
}

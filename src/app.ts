const fs = require('fs');
import assert from 'node:assert/strict';

type Position = {
    start: number; 
    stop: number;
    word: string;
};

type Input = {
	words: string[];
	string: string;
}

const findWords = function(text: Input): Position[] {

  var positions : Position[] = [];

  text.words.forEach(word => {
    if(text.string.indexOf(word) > -1){
      positions.push({
        start: text.string.indexOf(word),
        stop: text.string.indexOf(word) + word.length - 1,
        word: word
      })
    }
  })

  return  positions.sort((a,b) => a.start - b.start);

};

const readFromFile = function(): Input {
	try {
		const data = fs.readFileSync('test.txt', 'utf8');
		const deleteStrings = ['words:',  '\nstring:', ''];
		var aux = data.split(/(?:,| |'|"|\r)+/).filter(el =>  (deleteStrings.indexOf(el) == -1 ? true : false));
	
		var string = aux.pop();

		var input : Input = {
			words: aux,
			string: string
		}

		return input;
		
	} catch (err) {
		console.error(`Couldn't read from file`);
	}
}

const createListOfWords = function(words: Position[], string: string): string[] {

	//deletes words that don't have continuity
	for( var i = 0; i< words.length ; i++)
	{
		if(words[i].start != 0 && words[i].stop != string.length -1) {
				
			if(!(words.find(elf => elf.start == words[i].stop + 1) &&  words.find(elf => elf.stop == words[i].start - 1))){
				words.splice(i, 1);
				i--;
			}
		}
		else if(words[i].start == 0) {
			if(!(words.find(elf => elf.start == words[i].stop + 1))) {
				words.splice(i, 1);
				i--; 
			}
		}
		else if( words[i].stop ==  string.length - 1) {
			if(!(words.find(elf => elf.stop == words[i].start - 1))) {
				words.splice(i, 1);
				i--;
			}
		}
	}
	
	//deletes the duplicated words
	words.forEach((el, index, obj) => {
		if(index != obj.length -1) {
			if(el.stop > obj[index+1].start && el.start != obj[index+1].start){
				obj.splice(index, 1);
			}
		}
	});

	return words.map(word => word.word);
}

function main(){
	var input = readFromFile();
	console.log(createListOfWords(findWords(input), input.string));
}

function tests(){
	var testInput : Input = {
		words: ['quick', 'brown', 'the', 'fox'],
		string: "thequickbrownfox"
	};
	
	assert.deepEqual(createListOfWords(findWords(testInput), testInput.string), ['the', 'quick', 'brown', 'fox']);

	testInput = {
		words: ['bed', 'bath', 'bedbath', 'and', 'beyond'],
		string: "bedbathandbeyond"
	};

	assert.deepEqual(createListOfWords(findWords(testInput), testInput.string), ['bed', 'bath', 'and', 'beyond']);

	testInput = {
		words: ['be', 'bed', 'bath', 'beyo','bedbath', 'and', 'beyond', 'bey'],
		string: "bedbathandbeyond"
	};

	assert.deepEqual(createListOfWords(findWords(testInput), testInput.string), ['bed', 'bath', 'and', 'beyond']);
	console.log("tests passed");

}

main();
tests();





// STEP 2: Create an object called 'byeSpeaker' with a method 'speak' that logs "Good Bye" + name.
var byeSpeaker = {};

var speakWord = "Good Bye";

byeSpeaker.speak = function(name) {
  console.log(speakWord + " " + name);
};

// STEP 1: Create an object called 'helloSpeaker' with a method 'speak' that logs "Hello" + name.
var helloSpeaker = {};

// DO NOT attach speakWord to the global scope
var speakWord = "Hello";

helloSpeaker.speak = function(name) {
  console.log(speakWord + " " + name);
};

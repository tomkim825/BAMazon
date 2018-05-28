#Readme for Hangman-CLI

This app is also posted to github.io, but since it is a NODE app, it will not work on chrome. It is also not linked on the profile page for the same reason.

This is a simple hangman game with one round. It is an exercise using constructors and modularizing functions. Random words are chosen using the random-words npm package. The answer is displayed to help you test it. Comment it out if you want a serious game. When you run out of guesses or solve the word, it will exit out of the recursive loop and back to the terminal. 

KNOWN BUGS: due to the async nature of node, some elements fail to display. It is in the promise section of inquirer and should work (it does work most of the time).

```
Before running this app, 
run these commands one at a time to install necessary packages

npm install inquirer
npm install random-words

*******     Commands to run Hangman     *******

node index.js
(press any letter)
```
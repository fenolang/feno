# The `#Feno` Class

The #Feno class is the main element of everything and that is where the magic will arise, where we will use nothing more and nothing less than just syntax that Feno understands

## Starting the class

To start programming in pure Feno we need to create the { Feno } class as follows at the end of our .feno files:

```
doc: {
     #- Nothing around here .. again -#
}

new Feno() {

}

```

## Your first Hello World in Feno!

As a first exercise you could not miss the typical "Hello World", and this is how we do it in Feno:

```js
new Feno() {
     print("Hello World in Feno!")
}
```

Compile the code and open your browser, go to the console and you will see a message saying: Hello World in Feno!

## A better hello world

Now we know that to place a message on the console we need to call the function print() but what if we better make the message come out in a small window? We introduce you to the msg() function:

```js
new Feno() {
     msg("Hello World!")
}
```

Now reload the page and you will see a small window exit with the message Hello World!

## print() and msg()

When we need to know something that is happening internally as the result of a function in a simple way we need a message to show it to us, msg() is a good option but if we need several messages and we need them several times we will end up getting tired of so many pop-ups.

Then we make use of print() which is just a simple message in the console, it's like a console.log() in JavaScript :)
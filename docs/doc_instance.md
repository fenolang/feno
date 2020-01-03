# Document Instance

The `#Document` instance it is the main object that encapsulates all the marking and structure of our website

## Defining our instance

We will define our first document, the correct way to do it is as follows:

```javascript
doc: {
    #- Our content will go here -#
}
```

> ### ALERT!
>You can only declare one document per file, if you declare more than one instance you will see a compilation error

## Why?

And you will ask: Why do we need to declare a principal instance that encapsulates our marking? The answer is simple: Feno needs to know where the structure of your website is, by declaring our document internally what is happening is the following:

```html
<!doctype html>
<html>
   <body>
      <!-- Our content will go here -->
   </body>
</html>
```

Where is the `<head>`?

In HTML we know of the existence of the important head tag, in Feno head it is an instance! If you want to know more about the #head instance continue visiting: #Head Instance
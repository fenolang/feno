# Meta Elements

There is much to learn about the properties that we can use in our #meta to achieve a good SEO in our project

## The `#Meta` element

The `#Meta` element is a group of properties that you can assimilate as an array, this is where we place different properties such as the description of our site, how we want our links to appear on facebook, twitter and other things that make up something called: SEO. We can start the #Meta element as follows:

```
head: {
     title: A good and precious title
     meta: [
          #- Here will go the content of our meta -#
     ]
}
doc: {
    
}
```

## Property structure

Before we begin to see what are the properties that we can use within the #Meta element we have to understand how is the structure of a property:

## Our first description!

Now that we know how to write a property we can start writing our first property: description

```
head: {
     meta: [
          "description, This is the amazing description of my page"
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

## Author property

The Author property is the one indicated to place our name as creator of the website, it is important and all we have to do is the following:

```
head: {
     meta: [
          "author, Your wonderful and beautiful name"
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

## Understanding the `#Meta` element

While we in Feno are only filling an element with properties internally what is happening is the following: (Taking as an example that we want to use the #description and #author property)

```html
<!doctype html>
<html>
     <head>
          <meta name="description" content="This is the amazing description of my page">
          <meta name="author" content="Your wonderful and beautiful name">
     </head>
     <body>
          <!-- Nothing around here... for now -->
     </body>
</html>
```

## Import functions

Feno has 2 specialized functions to import external files with content for your document:

### The style() function

The `style()` function helps us import CSS style sheets, how do we do it? Check out the following

```
head: {
     title: "A good and precious title",
     meta: [
          style("css_file_name")
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

Did you see that? It is not necessary to place the extension: .css or even place the path where the file is located, nothing more and nothing less than just the name of the file.

>ALERT! Only for the files inside the styles folder it is not necessary to place the path, if your file IS NOT in this folder or is in a subfolder of the same you have the following options:

### Call the file from another path

If your .css file is not in the styles folder then YES you must place a path, suppose our file is in the styles folder BUT it is in a subfolder called "index", we would do something like this:

```
style("./index/my_file")
```

Again remember that it is not necessary to place the extension ".css", just place a point at the beginning and start placing the path to the file.
Now, if our style file is totally OUT of the styles folder and is in a folder called for example: "tools", we do something like the following:

```
style("/tools/my_file")
```

It is important that you notice that when our style file is completely out of the styles folder we directly place the path with a bar: "/", BUT if instead our file is in a subfolder inside the styles folder we start the path with a point and bar as: "./"

### Configure another folder for styles

If you do not want to use the default styles folder for your styles you can configure another folder to use it by default so that Feno locates your .css files, see the #Styles section in the Feno configuration file guide:

### The #import function

The import() function performs the same as the style() function BUT this function only works for files with extension: .feno, the syntax is very simple:

```
head: {
     title: "A good and precious title",
     meta: [
          import("feno_file_name")
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

If you want to call a file that is outside the scripts folder you can do the same as indicated here (Just change the style() function to import())
Properties

### Charset

The Charset property defines the encoding format for our site, by default we all use the value of: "utf-8" and we recommend doing so:

```
head: {
     title: "A good and precious title",
     meta: [
          "charset, utf-8"
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

### Viewport

The Viewport property gives us the possibility to configure how our site will look on mobile devices and other things related to the responsive design, most of us use a standard and it is the following in HTML:

```html
<!doctype html>
<html>
     <head>
         <title>A good and precious title</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
     </head>
     <body>
          <!-- Nothing around here... for now -->
     </body>
</html>
```

But Feno makes life easier for us so that to do the above we just have to write the word "viewport":

```
head: {
     title: "A good and precious title",
     meta: [
          "viewport"
     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

### Base

In Feno IT IS NO LONGER NECESSARY to place the base property that we place in HTML since the same language does it automatically for us;)

### Noscript

There are ways to disable javascript in our browser so that we have to be prepared for these types of situations. Feno gives us the NoScript object:

```
head: {
     title: "A good and precious title",
     meta: [
          noscript: {
               <p> This site needs JavaScript! </p>
          }

     ]
}
doc: {
     #- Nothing around here... for now -#
}
```

It is important to know that noscript is NOT an instance, it is an object. Therefore, it does not receive the same priority for errors as the instances.
Default Noscript

If you don't define any noscript object then Feno adds one by default so you don't have to worry about anything :)

### Configure default Noscript

Now, we know that if we want to customize our noscript object we have to define it in each file, that's tired! The solution could be to create a component that only contains our noscript object and call it on each page, but it is still dirty.

The solution that Feno provides us is to configure and customize the noscript object that Feno by default adds, this is done in the Feno configuration file. Click on the following link and see all about how to configure the noscript object


## More properties

Of course there are many more properties than the previous ones, but this would be redundant, so you can visit https://htmlhead.dev and see all the properties of the meta in HTML as they also work in Feno, BUT remember that if in HTML it is like this:

```html
<meta name="theme-color" content="#0a8cbd">
```

In Feno is more clean, like this:

```
"theme-color, #0a8cbd"
```

---
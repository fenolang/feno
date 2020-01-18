# Styles Instance

We already learned about the `#Doc` instance and the `#Head` instance, now it's time to delve into the third and last instance of Feno: `#Styles`

## Defining the instance

The #Styles instance helps us to define CSS styles in the same file, it is placed inside the `#Head` instance and thus its correct use:

```
head: {
     styles: {
          .my_class {
               color: #0a8cbd;
          }
     }
}
doc: {
  #- Here will go our html -#
}
```

Remember that the `#Styles` instance can ONLY be defined within the `#Head` instance! If you do otherwise you will receive a compilation error!
Understanding the instance

When we want to insert css styles into our documents and not call an external file, it is when we use the `#Styles` instance, with the previous code actually what Feno is producing internally for the browser is the following:

```
<!doctype html>
<html>
     <head>
          <style>
               .my_class {
                    color: #0a8cbd;
               }
          </style>
     </head>
     <body>
          <!-- Here will go our html -->
     </body>
</html>
```

## I want my styles in separate files!

No problem! For people like you cleaning enthusiasts Feno has the function style() Follow the documentation to know more and more of the best language you can use to develop your next project

---
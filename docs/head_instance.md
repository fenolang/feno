
# Head  Instance

In Feno  head  it is an instance or object that we can declare to start placing our title and others

## Declaring the instance

The ideal way to declare our #head instance is before declaring our #doc instance, as you can see below:

```
head:  {  
	#- Here is the content of our head -#  
}  
doc:  {  
	#- Here goes our structure -#  
}
```

You cannot declare the #head instance without having the #doc instance declared before, if you do you will see a compilation error

### Understanding the instance

---

The previous code where we declare our two instances: #doc and #head will be transpiled to HTML and will give a result like the following:

```
<!doctype html>  
<html>  
	<head>  
		<!-- Here is the content of our head -->  
	</head>  
	<body>  
		<!-- Here goes our structure -->  
	</body>  
</html>
```

## Elements

### Title
---
In Feno we have the  title  element available within our #head instance, to assign a value we need to do the following:

```
head:  {  
	title:  "This is my title"  
}
```

### Styles
---
To import styles that you defined in an external  .css  file we use the  style()  function while if you want to define styles in the same file we use the  # styles  instance:

[SEE MORE ABOUT THE STYLE() FUNCTION](http://localhost:3000/docs/meta_elements#style)

[SEE MORE ABOUT THE #STYLES INSTANCE](http://localhost:3000/docs/styles_instanceundefined)

### Scripts
---
To import external Feno scripts we use the  import()  function and to define a script in the same file we call the  { Feno }  class

[SEE MORE ABOUT THE IMPORT() FUNCTION](http://localhost:3000/docs/meta_elements#import)

[SEE MORE ABOUT THE { FENO } CLASS](http://localhost:3000/docs/feno_classundefined)

### Meta
---
And where do we place the content of our meta? For that there is the #meta group that we place within our #head instance, as you see in the example below

```
head:  {  
	title:  "This is my title",
	meta:  [  
		"description, This is my incredible description"  
	]  
}
```

## Continue learning about the  #meta!
This is just the beginning of what you can learn about #meta and how to use good SEO on your next website with Feno

---
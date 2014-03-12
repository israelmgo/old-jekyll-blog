---
layout: post
title: "Scala 注解"
categories:
- articles
comments: true
tags: [scala]
---

注释将元信息和定义关联到一起。

简单的注释从句的格式有`@C`或`@C(a1, .., an)`。这里`C`是一个类`C`的构造器，必须遵从类`scala.Annotation`。所有指定的构造器参数`a1, .., an`必须是常量表达式（例如，数值序列，字符串，类序列，Java枚举，以及他们的一维数组）。

注释从句作用于后面第一个定义或者声明。一个定义或者声明之前可能有不止一个注释从句。这些从句给出的顺序没有影响。

注释从句的意义在于 _实现依赖_ 。Java平台中，下面的Scala注释有对应的标准含义。

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](http://www.scala-lang.org/api/2.9.1/scala/SerialVersionUID.html)   |  [`serialVersionUID`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (field)  |
|  [`scala.cloneable`](http://www.scala-lang.org/api/2.9.1/scala/cloneable.html)   |  [`java.lang.Cloneable`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Cloneable.html) |
|  [`scala.deprecated`](http://www.scala-lang.org/api/2.9.1/scala/deprecated.html)   |  [`java.lang.Deprecated`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](http://www.scala-lang.org/api/2.9.1/scala/inline.html) (since 2.6.0)  |  no equivalent |
|  [`scala.native`](http://www.scala-lang.org/api/2.9.1/scala/native.html) (since 2.6.0)  |  [`native`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.remote`](http://www.scala-lang.org/api/2.9.1/scala/remote.html) |  [`java.rmi.Remote`](http://java.sun.com/j2se/1.5.0/docs/api/java/rmi/Remote.html) |
|  [`scala.serializable`](http://www.scala-lang.org/api/2.9.1/index.html#scala.annotation.serializable) |  [`java.io.Serializable`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html) |
|  [`scala.throws`](http://www.scala-lang.org/api/2.9.1/scala/throws.html) |  [`throws`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.transient`](http://www.scala-lang.org/api/2.9.1/scala/transient.html) |  [`transient`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.unchecked`](http://www.scala-lang.org/api/2.9.1/scala/unchecked.html) (since 2.4.0) |  no equivalent |
|  [`scala.volatile`](http://www.scala-lang.org/api/2.9.1/scala/volatile.html) |  [`volatile`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.reflect.BeanProperty`](http://www.scala-lang.org/api/2.9.1/scala/reflect/BeanProperty.html) |  [`Design pattern`](http://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

下面例子中我们为方法`read`的定义添加`throws`注释，为了捕获Java主程序抛出的异常。
In the following example we add the `throws` annotation to the definition of the method `read` in order to catch the thrown exception in the Java main program.

> Java编译器通过分析在方法或者构造器执行过程可能产生哪些异常，来检查程序是否包含对[被检查的异常](http://docs.oracle.com/javase/specs/jls/se5.0/html/exceptions.html)的处理。对于被检查的每个可能产生的异常，方法或构造器的**throws**从句 _必须_ 提到那个异常类或者那个异常类的一个子类。
> 由于Scala不检查异常，Scala方法 _必须_ 标注一个或多个`throws`注释，以便于Java代码能够捕获Scala方法抛出的异常。

    package examples
    import java.io._
    class Reader(fname: String) {
      private val in = new BufferedReader(new FileReader(fname))
      @throws(classOf[IOException])
      def read() = in.read()
    }

下面的Java程序打印以main方法传入第一个参数命名的文件的内容。

    package test;
    import examples.Reader;  // Scala class !!
    public class AnnotaTest {
        public static void main(String[] args) {
            try {
                Reader in = new Reader(args[0]);
                int c;
                while ((c = in.read()) != -1) {
                    System.out.print((char) c);
                }
            } catch (java.io.IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

注释掉Reader类的`throws`注解会在编译这个Java主程序产生下面的错误信息：

    Main.java:11: exception java.io.IOException is never thrown in body of
    corresponding try statement
            } catch (java.io.IOException e) {
              ^
    1 error

### Java 注释

**注意** 请确保将`-target:jvm-1.5`选项与Java注释一同使用。

Java 1.5 介绍了以[注释](http://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html)的形式的用户定义元数据。注释的一个关键的特性是基于特定的名－值对来初始化他们的元素。

### Java Annotations ###

**Note:** Make sure you use the `-target:jvm-1.5` option with Java annotations.如果我们需要一个注释来跟踪某个类的源文件的情况下，我们可能定义成：

    @interface Source {
      public String URL();
      public String mail();
    }

并且像下面这样应用它

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

Scala的一个注释程序看起来像一个构造器行为，为了表示一个Java注释，必须使用命名参数：

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

如果注释只包含一个元素（没有默认值），语法相当单调，所以为了方便，如果名称被指定为`value`，能够用一种类似构造函数的语法应用到Java中：

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

并且可以像这样使用它

    @SourceURL("http://coders.com/")
    public class MyClass extends HisClass ...

这种用法在Scala中同样可行

    @SourceURL("http://coders.com/")
    class MyScalaClass ...

`mail`元素指定了一个默认值，所以我们不需要显式为它赋值。然而，如果我们需要这么做，我们不能在Java中混用两种方式！

    @SourceURL(value = "http://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

Scala在这个方面提供更多灵活性

    @SourceURL("http://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...

这个扩展的语法是与.NET的注释一致的，并且能涵盖他们的所有能力。

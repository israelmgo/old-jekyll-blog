---
layout: post
title: "Scala 类"
categories:
- articles
comments: true
tags: []
---

Scala的类是指能够在运行时实例化为许多对象的静态模版。
这里是一个类的定义，定义类`Point`：

    class Point(xc: Int, yc: Int) {
      var x: Int = xc
      var y: Int = yc
      def move(dx: Int, dy: Int) {
        x = x + dx
        y = y + dy
      }
      override def toString(): String = "(" + x + ", " + y + ")";
    }

这个类定义两个变量`x`和`y`以及两个方法：`move`和`toString`。`move`接受两个整数参数，但是不返回值（隐式返回类型`Unit`，对应于类Java语言中的`void`）。`toString`，反而，不接受任何参数，但是返回一个`String`值。由于`toString`重载了预定义的`toString`方法，它必须用`override`标记。

Scala中的类接受构造器参数。上面代码定义了两个构造器参数，`xc`和`yc`；他们都是整个类的主体中可见的。我们的例子里他们被用于初始化变量`x`和`y`。

类使用`new`关键字初始化，如下面例子所示：

    object Classes {
      def main(args: Array[String]) {
        val pt = new Point(1, 2)
        println(pt)
        pt.move(10, 10)
        println(pt)
      }
    }

这个程序以有一个`main`方法的顶层单例对象的形式定义了一个可执行的应用类。这个`main`方法创建了一个新的`Point`并存储在值`pt`中。 _注意`val`结构定义的值不同于以`var`结构定义的变量（看上面的`Point`类），它们不允许更改。也就是说值是常量_

这是程序的输入 

    (1, 2)
    (11, 12)

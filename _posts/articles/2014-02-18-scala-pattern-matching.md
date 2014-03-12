---
layout: post
title: "Scala 模式匹配"
categories:
- articles
comments: true
tags: [scala]
---

Scala有内置通用模式匹配机制。它遵循首次匹配策略，允许匹配任何形式的数据。
这里是一个小例子显示如何针对整数值进行匹配：

    object MatchTest1 extends App {
      def matchTest(x: Int): String = x match {
        case 1 => "one"
        case 2 => "two"
        case _ => "many"
      }
      println(matchTest(3))
    }

有`case`语句的块定义了一个函数，将整数映射到字符串。`match`关键字提供了一种方便的方式将函数应用于对象（就像上面的模式匹配函数）。

这里是第二个例子，针对不同类型的模式匹配一个值：

    object MatchTest2 extends App {
      def matchTest(x: Any): Any = x match {
        case 1 => "one"
        case "two" => 2
        case y: Int => "scala.Int"
      }
      println(matchTest("two"))
    }

第一个`case`当`x`指带整数值`1`时匹配。第二个`case`当`x`等于字符串`"Two"`时匹配。第三个case由一个类型模式组成；它针对任意整数匹配并且将选择器值`x`绑定至整数类型的变量`y`上。

Scala的模式匹配语法在匹配基于[实例类](case-classes.html)表示的代数类型时最有用。
Scala也允许利用[提取器对象](extractor-objects.html)中的`unapply`方法独立于实例类来定义模式。

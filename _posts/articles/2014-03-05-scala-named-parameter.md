---
layout: post
title: "Scala 命名参数"
categories:
- articles
comments: true
tags: [scala]
---

当调用方法和函数时，你能在调用中显式使用变量名，像这样：

      def printName(first:String, last:String) = {
        println(first + " " + last)
      }

      printName("John","Smith")
      // Prints "John Smith"
      printName(first = "John",last = "Smith")
      // Prints "John Smith"
      printName(last = "Smith",first = "John")
      // Prints "John Smith"

注意一旦你在调用中使用了参数名，只要所有参数都被命名，顺序便没有意义。这个特性与[默认参数值](default-parameter-values.html)配合使用效果很好:

      def printName(first:String = "John", last:String = "Smith") = {
        println(first + " " + last)
      }

      printName(last = "Jones")
      // Prints "John Jones"

由于你能将参数以任何你喜欢的顺序放置，你能在参数列表中优先考虑使用参数的默认值。

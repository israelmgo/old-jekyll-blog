---
layout: post
title: "Scala 匿名函数"
categories:
- articles
comments: true
tags: [scala]
---

Scala提供一套相当轻量级的语法来定义匿名函数。下述表达式创建了一个整数的递增函数（successor function）：

    (x: Int) => x + 1

这种语法是下面匿名类定义的缩写：

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

也可以定义多个参数的函数：

    (x: Int, y: Int) => "(" + x + ", " + y + ")"

或者没有参数：

    () => { System.getProperty("user.dir") }

也有一套非常轻量级的方式来写函数类型。这里是上述三个函数的类型：

    Int => Int
    (Int, Int) => String
    () => String

这种语法是下面类型的缩写：

    Function1[Int, Int]
    Function2[Int, Int, String]
    Function0[String]

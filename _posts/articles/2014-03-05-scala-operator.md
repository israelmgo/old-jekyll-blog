---
layout: post
title: "Scala 中序操作符"
categories:
- articles
comments: true
tags: []
---

Scala中任何接受单一参数的方法可以被用作 *中序操作符*。这里是`MyBool`类的定义，定义了三个方法`and`，`or`和`negate`。

    class MyBool(x: Boolean) {
      def and(that: MyBool): MyBool = if (x) that else this
      def or(that: MyBool): MyBool = if (x) this else that
      def negate: MyBool = new MyBool(!x)
    }

现在可以将`and`和`or`用作中序操作符：

    def not(x: MyBool) = x negate; // semicolon required here
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)

正如这段代码的第一行所示，也可以将空元方法用作后序操作符。第二行利用`and`和`or`方法定义了一个`xor`函数以及新的`not`函数。这个例子中， _中序操作符_ 的使用帮助使得`xor`的定义更加可读。

这是更传统的面向对象编程语言语法对应的代码：

    def not(x: MyBool) = x.negate; // semicolon required here
    def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)

---
layout: post
title: Scala 高阶函数
categories:
- articles
comments: true
tags: [scala]
---

Scala允许定义高阶函数。这是指 _将其他函数作为参数_ ，或者 _结果是一个函数_ 的函数。这里是函数`apply`，以另一个函数`f`和一个值`v`，并且将函数`f`应用于`v`：

    def apply(f: Int => String, v: Int) = f(v)

_注意：如果上下文需要，方法会自动强制转化为函数_

这里是另一个例子

    class Decorator(left: String, right: String) {
      def layout[A](x: A) = left + x.toString() + right
    }
    
    object FunTest extends App {
      def apply(f: Int => String, v: Int) = f(v)
      val decorator = new Decorator("[", "]")
      println(apply(decorator.layout, 7))
    }
    
执行会产生输出：

    [7]

这个例子中，方法`decorator.layout`应方法`apply`的要求自动强制转化为类型`Int => String`的值。请注意方法`decorator.layout`是一个 _多态方法_ （即它对它的一些签名类型进行了抽象），而且Scala编译器必须首先恰当地实例化它的方法类型。

---
layout: post
title: "Scala 柯里化"
categories:
- articles
comments: true
tags: [scala]
---

Scala的Currying机制即“柯里化”。
方法可能定义多个参数列表。当一个方法被较少数量的参数列表调用时，那么它将会产生一个接受缺少的参数列表作为它的参数的函数。

这里有个例子：

    object CurryTest extends App {
    
      def filter(xs: List[Int], p: Int => Boolean): List[Int] =
        if (xs.isEmpty) xs
        else if (p(xs.head)) xs.head :: filter(xs.tail, p)
        else filter(xs.tail, p)
    
      def modN(n: Int)(x: Int) = ((x % n) == 0)
    
      val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
      println(filter(nums, modN(2)))
      println(filter(nums, modN(3)))
    }

_注意：方法`modN`在两次`filter`的调用中被部分使用；也就是只有它的第一个参数被实际使用到。`modN(2)`这句生成了一个`Int => Boolean`类型的函数，而且因此成为了函数`filter`的第二个参数的可能候选。_

上面程序的输出如下：

    List(2,4,6,8)
    List(3,6)

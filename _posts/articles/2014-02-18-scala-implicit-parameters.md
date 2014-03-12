---
layout: post
title: Scala 隐式参数
categories:
- articles
comments: true
tags: [scala]
---

有 _隐式参数_ 的方法能够像普通方法一样应用于参量。这种情况中隐式标签没有效果。然而，如果这样一个方法缺少针对它的隐式参数的参量时，这些参量将会自动提供。

符合条件地传给隐式参数的实际参量归为两类：

* 首先，符合所有标识符 x 都能够从不需要前缀的方法调用中访问，并且表示一个隐式定义或者一个隐式参数。
* 其次，要符合隐式参数类型的相邻模块的所有成员也都标记为隐式的。

接下来的例子中我们定义了一个方法`sum`，利用独异点（monoid）的`add`和`unit`操作计算一系列成员的和。请注意隐式值不能是顶层的，它们必须是模版的成员。

    abstract class SemiGroup[A] {
      def add(x: A, y: A): A
    }
    abstract class Monoid[A] extends SemiGroup[A] {
      def unit: A
    }
    object ImplicitTest extends App {
      implicit object StringMonoid extends Monoid[String] {
        def add(x: String, y: String): String = x concat y
        def unit: String = ""
      }
      implicit object IntMonoid extends Monoid[Int] {
        def add(x: Int, y: Int): Int = x + y
        def unit: Int = 0
      }
      def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
        if (xs.isEmpty) m.unit
        else m.add(xs.head, sum(xs.tail))

      println(sum(List(1, 2, 3)))
      println(sum(List("a", "b", "c")))
    }

这是这个Scala程序的输出：

    6
    abc

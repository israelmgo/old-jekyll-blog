---
layout: post
title: Scala 提取器对象
categories:
- articles
comments: true
tags: [scala]
---

Scala中，模式可以独立于实例类定义。为此，一个名为unapply的方法被定义来生成一个所谓的提取器。例如，下面的代码定义了一个提取器对象Twice。

    object Twice {
      def apply(x: Int): Int = x * 2
      def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
    }
    
    object TwiceTest extends App {
      val x = Twice(21)
      x match { case Twice(n) => Console.println(n) } // prints 21
    }

这里有两个语法约定在其作用。

模式`case Twice(n)`将会引起对`Twice.unapply`的调用，它用来匹配任何偶数；`unapply`的返回值表示参数是否匹配以及能够被后续匹配用到的任何子值。这里的子值是`z/2`。

方法`apply`对于模式匹配不是必须的。它仅仅用于模拟一个构造函数。`val x = Twice(21)`等价于`val x = Twice.apply(21)`.

`unapply`的返回类型应该像下面这样选择：
* 如果仅仅是一个测试，则返回一个`Boolean`。例如`case even()`
* 如果返回类型T的单个子值，则返回一个`Option[T]`
* 如果你想返回多个子值`T1,...,Tn`，则将它们组合到一个课可选的元组`Option[T1,...,Tn]`

有时，子值的数量是固定的，并且我们想返回一个序列。
为了这个原因，你也能通过`unapplySeq`的方式定义模式。最后的子值类型`Tn`必须为`Seq[S]`。这一机制被用于模式`case List[x1, ..., xn]`中的实例。

提取器能够使得代码更易于维护。想要了解细节，阅读Emir, Odersky 和 Williams（2007年1月份）所写的论文 ["Matching Objects with Patterns"](http://lamp.epfl.ch/~emir/written/MatchingObjectsWithPatterns-TR.pdf) (看第四章节)。

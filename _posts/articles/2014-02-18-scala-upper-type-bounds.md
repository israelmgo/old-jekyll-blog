---
layout: post
title: "Scala 类型上限"
categories:
- articles
comments: true
tags: []
---

Scala中[类型参数](generic-classes.html)和[抽象类型](abstract-types.html)可以通过类型范围来约束。这样的类型范围限制类型的具体值而且可能透露更多关于这些类型的成员信息。 _类型上限_ `T <: A` 声明类型变量`T`指向类型`A`的子类型。
这里有个例子，依赖于多态方法`findSimilar`实现的类型上限。

    trait Similar {
      def isSimilar(x: Any): Boolean
    }
    case class MyInt(x: Int) extends Similar {
      def isSimilar(m: Any): Boolean =
        m.isInstanceOf[MyInt] &&
        m.asInstanceOf[MyInt].x == x
    }
    object UpperBoundTest extends App {
      def findSimilar[T <: Similar](e: T, xs: List[T]): Boolean =
        if (xs.isEmpty) false
        else if (e.isSimilar(xs.head)) true
        else findSimilar[T](e, xs.tail)
      val list: List[MyInt] = List(MyInt(1), MyInt(2), MyInt(3))
      println(findSimilar[MyInt](MyInt(4), list))
      println(findSimilar[MyInt](MyInt(2), list))
    }
    
如果没有类型上限标注，不可能在方法`findSimilar`中调用方法`isSimilar`。
类型下限的用法在[这里](lower-type-bounds.html)讨论。

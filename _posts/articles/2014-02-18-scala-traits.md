---
layout: post
title: "Scala Traits"
categories:
- articles
comments: true
tags: [scala]
---

类似Java中的接口，特性通常被用于通过制定支持方法的签名来定义对象类型。不同于Java的是Scala允许特性被部分实现；也就是说，可以定义一些方法的默认实现。相较于类，特性不能有构造器参数。
这里有个例子：

    trait Similarity {
      def isSimilar(x: Any): Boolean
      def isNotSimilar(x: Any): Boolean = !isSimilar(x)
    }

这个特性由两个方法`isSimilar`和`isNotSimilar`组成。 然而`isSimilar`不提供具体的方法实现（就Java术语而言是抽象的），方法`isNotSimilar`定义了具体实现。所以，整合这个特性的类只需要为`isSimilar`提供具体实现。`isNotSimilar`的行为正确地继承至这个特性。典型的做法是利用[混合类合成](mixin-class-composition.html)将特性整合到[类](classes.html)（或者其他特性）中。
 
    class Point(xc: Int, yc: Int) extends Similarity {
      var x: Int = xc
      var y: Int = yc
      def isSimilar(obj: Any) =
        obj.isInstanceOf[Point] &&
        obj.asInstanceOf[Point].x == x
    }
    object TraitsTest extends Application {
      val p1 = new Point(2, 3)
      val p2 = new Point(2, 4)
      val p3 = new Point(3, 3)
      println(p1.isNotSimilar(p2))
      println(p1.isNotSimilar(p3))
      println(p1.isNotSimilar(2))
    }
    
程序的输出为：

    false
    true
    true

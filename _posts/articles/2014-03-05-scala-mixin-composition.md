---
layout: post
title: "Scala 混入类合成"
categories:
- articles
comments: true
tags: [scala]
---

相对于只支持 _单一继承_ 的语言，Scala有一个更加通用的类重用的概念。Scala允许定义新类的时候重用 _一个类中新增的成员定义_ （即相较于其父类的差异之处）。表达为一个 _混入类合成_ 。考虑下面对于迭代器的抽象：

    abstract class AbsIterator {
      type T
      def hasNext: Boolean
      def next: T
    }

接下来， 考虑一个继承至`AbsIterator`的混入类，有一个`foreach`方法，将给定函数应用于迭代器返回的每个元素。为了定义一个能被用作混入类的类，我们采用关键字`trait`。
 
    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next) }
    }

这里有一个具体的迭代器类，返回给定字符串的连续字符：
 
    class StringIterator(s: String) extends AbsIterator {
      type T = Char
      private var i = 0
      def hasNext = i < s.length()
      def next = { val ch = s charAt i; i += 1; ch }
    }

我们想将`StringIterator`和`RichIterator`的功能合并到一个类中。单独利用单一继承和接口是不可能的，因为两个类都包含成员的代码实现。Scala借助于它的 _混入类合成_ 。它允许程序员重用类定义的不同点，也就是所有没有继承的新的定义。这个机制使得可以合并`StringIterator`和`RichIterator`，正如下面测试程序所做的，打印一列给定字符串的所有字符。
 
    object StringIteratorTest {
      def main(args: Array[String]) {
        class Iter extends StringIterator(args(0)) with RichIterator
        val iter = new Iter
        iter foreach println
      }
    }

`main`函数中的`Iter`类是利用关键字`with`通过父亲`StringIterator`和`RichIterator`的混入类组合构造而成。第一个父亲称之为 `Iter`的 _超类_ ， 而第二个（以及其他任何声明的）父亲称之为一个 _混入类_

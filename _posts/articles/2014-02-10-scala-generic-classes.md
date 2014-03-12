---
layout: post
title: Scala 范型类
categories:
- articles
comments: true
tags: [scala]
---

类似Java 5(也称作 [JDK 1.5](http://java.sun.com/j2se/1.5/))，Scala内置支持类的类型参数。这种范型类特别是对集合类的开发非常有用。
这里以一个例子说明这一点：

    class Stack[T] {
      var elems: List[T] = Nil
      def push(x: T) { elems = x :: elems }
      def top: T = elems.head
      def pop() { elems = elems.tail }
    }

类`Stack`模拟一个任意元素类型`T`的强制（可变的）的栈。类型参数确保仅合法的元素（即类型`T`）可以被推入栈中。同样地，通过类型参数，我们可以表示方法`top`将仅产生指定类型的元素。

这里是一些用例：

    object GenericsTest extends App {
      val stack = new Stack[Int]
      stack.push(1)
      stack.push('a')
      println(stack.top)
      stack.pop()
      println(stack.top)
    }

这个程序的输入将会是

    97
    1

_注意：范型的子类型是*不可变的*。这意味着如果我们有一个`Stack[Char]`类型的字符栈，那么它不能被用作一个`Stack[Int]`类型的整数栈。这是不可靠的，因为它会使得我们能够将真正的整数输入到字符栈中。总的而言，当且仅当`S = T`时，`Stack[T]`只是`Stack[S]`的一个子类型。因为这可能会非常局限的，Scala提供[类型参数标注机制](variances.html) 来控制范型的子类型行为。_

---
layout: post
title: "Scala 类型下限"
categories:
- articles
comments: true
tags: [scala]
---
因为[类型上限](upper-type-bounds.html)将类型限制为另外一个类型的子类型，顾名思义*类型下限* 则是声明一个类型是另一个类型的父类型。术语`T >: A`表示类型参数`T`或者抽象类型`T`指的是类型`A`的子类型。

这里有一个说明它有用的例子：

    case class ListNode[T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend(elem: T): ListNode[T] =
        ListNode(elem, this)
    }

上面的程序实现了一个带有前置操作的链表。不幸地是，类`ListNode`的类型参数中的类型是不变的；也就是类型`ListNode[String]`不是类型`List[Object]`的子类型。借助于[型变注解](variances.html)我们能表达这样的子类型语义。

	case class ListNode[+T](h: T, t: ListNode[T]){ ... }

很不幸这个程序无法通过编译，因为协方差标注只能够当类型变量用在协变量位置时使用。因为类型变量`T`是作为方法`prepend`的参数类型，违背了这一规则。然而借助`类型下限`，我们能实现一个`T`仅出现在协变量位置的前置方法。

对应代码如下：
	
    case class ListNode[+T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend[U >: T](elem: U): ListNode[U] =
        ListNode(elem, this)
    }

_注意：新的`prepend`方法有一个略微没那么严格的类型。事实上它允许将子类型的对象前置到一个已存在的列表中。结果的列表是这个子类型的列表_

这里有一些代码阐明这点：


    object LowerBoundTest extends App {
      val empty: ListNode[Null] = ListNode(null, null)
      val strList: ListNode[String] = empty.prepend("hello")
                                           .prepend("world")
      val anyList: ListNode[Any] = strList.prepend(12345)
    }

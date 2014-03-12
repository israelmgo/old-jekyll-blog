---
layout: post
title: Scala 混合类型
categories:
- articles
comments: true
tags: [scala]
---

有些时候需要表示一个对象的类型是多个其他类型的子类型。Scala中可以借助*混合类型*来表达，是这些对象类型的交集。

假设我们有两个特性`Cloneable`和`Resetable`：

    trait Cloneable extends java.lang.Cloneable {
      override def clone(): Cloneable = { 
        super.clone().asInstanceOf[Cloneable]
      }
    }
    trait Resetable {
      def reset: Unit
    }

现在假设我们想要写一个函数`cloneAndReset`，接受一个对象，克隆它并且重置原始对象：

    def cloneAndReset(obj: ?): Cloneable = {
      val cloned = obj.clone()
      obj.reset
      cloned
    }

问题在于参数`obj`的类型是什么。如果是`Cloneable`，那么这个对象能够被`clone`，但不能`reset`；如果是`Resetable`，我们能够`reset`它，但是没有`clone`操作。为了避免这样情况下的类型转换，我们能指定`obj`的类型同时是`Cloneable`和`Resetable`。这个混合类型Scala中写作：`Cloneable with Resetable`。

这里是更新后的函数：

    def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
      //...
    }

混合类型可以由多个对象类型构成，而且他们可以使用单一的改良，从而精简现有对象成员的声明。通常格式是：`A with B with C ... { refinement }`

在关于抽象类型[abstract types](abstract-types.html)的页面中给出过一个关于改良的使用的例子. 

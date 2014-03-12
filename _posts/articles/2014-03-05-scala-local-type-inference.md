---
layout: post
title: "Scala 局部类型推理"
categories:
- articles
comments: true
tags: [scala]
---
Scala有一个内置类型推理机制，允许程序员省略特性类型注释。事实上，Scala中通常没必要指定变量的类型，因为编译器能从变量的初始化表达式中推理出其类型。同样方法的返回类型也经常能被省略，因为它们对应着主体的类型，可被编译器推测出来。

这里有个例子：

    object InferenceTest1 extends App {
      val x = 1 + 2 * 3         // the type of x is Int
      val y = x.toString()      // the type of y is String
      def succ(x: Int) = x + 1  // method succ returns Int values
    }

对于递归方法而言，编译器不能推理出结果类型。这有个程序便会因为这个原因而编译失败：

    object InferenceTest2 {
      def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
    }

当[多态方法](polymorphic-methods.html) 被调用或者[范型类](generic-classes.html) 被实例化时也不需要强制指定类型参数。Scala编译器会通过上下文和实际方法／构造函数参数的类型来推理这些缺失的类型参数。

这里有个例子说明这点：

    case class MyPair[A, B](x: A, y: B);
    object InferenceTest3 extends App {
      def id[T](x: T) = x
      val p = MyPair(1, "scala") // type: MyPair[Int, String]
      val q = id(1)              // type: Int
    }

这个程序的最后两行等价于下面的代码，所有推理的类型都变成显式的：

    val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
    val y: Int = id[Int](1)

在某些情景下依赖Scala的类型推理机制可能会相当危险的，正如下面这个程序所示：

    object InferenceTest4 {
      var obj = null
      obj = new Object()
    }

这个程序无法编译，因为为变量`obj`推断的类型是`Null`。因为那个 类型的唯一值是`null`，不可能使得它指向其他值。

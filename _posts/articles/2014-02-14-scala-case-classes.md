---
layout: post
title: "Scala 实例类"
categories:
- articles
comments: true
tags: []
---

Scala支持 _实例类_ 的概念。实例类是普通类，可以导出他们的构造器参数，并且利用[模式匹配](pattern-matching.html)提供一种递归分解的机制。

这里是一个类的层级的例子，由一个抽象父类`Term`以及三个具体实例类`Var`，`Fun`，和`App`组成。

    abstract class Term
    case class Var(name: String) extends Term
    case class Fun(arg: String, body: Term) extends Term
    case class App(f: Term, v: Term) extends Term

这个类层级可以用于表示[无类型λ微积分](http://www.ezresult.com/article/Lambda_calculus)。为了帮组实例类实例的创建，Scala不要求使用`new`关键字。可以简单的将类名用作函数。

这里有个例子：

    Fun("x", Fun("y", App(Var("x"), Var("y"))))

实例类的构造器参数作为公开值并可以直接访问。

    val x = Var("x")
    println(x.name)

对于每个实例类，Scala编译器生成一个实现结构相等的`equals`方法和一个`toString`方法。实例：

    val x1 = Var("x")
    val x2 = Var("x")
    val y1 = Var("y")
    println("" + x1 + " == " + x2 + " => " + (x1 == x2))
    println("" + x1 + " == " + y1 + " => " + (x1 == y1))

将打印：

    Var(x) == Var(x) => true
    Var(x) == Var(y) => false


只有当模式匹配是用于分解数据结构，定义实例类才是合理的。下面的对象为我们的λ微积分的表现方法定义了一个漂亮的打印函数
It makes only sense to define case classes if pattern matching is used to decompose data structures. The following object defines a pretty printer function for our lambda calculus representation:

    object TermTest extends scala.App {
      def printTerm(term: Term) {
        term match {
          case Var(n) =>
            print(n)
          case Fun(x, b) =>
            print("^" + x + ".")
            printTerm(b)
          case App(f, v) =>
            print("(")
            printTerm(f)
            print(" ")
            printTerm(v)
            print(")")
        }
      }
      def isIdentityFun(term: Term): Boolean = term match {
        case Fun(x, Var(y)) if x == y => true
        case _ => false
      }
      val id = Fun("x", Var("x"))
      val t = Fun("x", Fun("y", App(Var("x"), Var("y"))))
      printTerm(t)
      println
      println(isIdentityFun(id))
      println(isIdentityFun(t))
    }

我们的例子中，函数`printTerm`表达了一个模式匹配语句，已`match`关键字
开头并且由一系列`case Pattern => Body`分句构成。
上述程序还定义了一个函数`isIdentityFun`，用来检查是否给定的术语对应着一个简单恒等函数。这个例子采用深度模式和保护。给定值匹配一个模式后，保护（关键字`if`后定义的）被执行。如果它返回`true`，则匹配成功；否则，失败并且尝试下一个模式。

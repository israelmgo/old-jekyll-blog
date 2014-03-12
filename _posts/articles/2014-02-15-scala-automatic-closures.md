---
layout: post
title: Scala 自动类型依赖闭包
categories:
- articles
comments: true
tags: [scala]
---

Scala允许无参函数名作为方法参数。当此类方法被调用时，这个无参函数名的实际参数并没有被执行，而是传入一个空元函数，囊括了对应参数的计算（所谓的 *按名调用* 执行）。

下面的代码展示了这个机制：

    object TargetTest1 extends App {
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if (cond) {
          body
          whileLoop(cond)(body)
        }
      var i = 10
      whileLoop (i > 0) {
        println(i)
        i -= 1
      }
    }

函数`whileLoop`接受两个参数`cond`和`body`。当这个函数被使用时，实际参数并没有被执行。但是无论什么时候这个真正的参数在`whileLoop`的主体中被使用到，隐式创建的空元函数将被执行。因此，我们的方法`whileLoop`利用递归实现了一个类-Java的while-loop。

我们利用这种机制能够结合使用[前缀／后缀操作符](operators.html) 来创造更多复杂的语句（拥有优美语法）。

这里是一个loop-unless语句的实现：

    object TargetTest2 extends App {
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if (!cond) unless(cond)
        }
      }
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }

这个`loop`函数仅接受一个循环的主题并返回一个`LoopUnlessCond`的实际例（囊括这个主体对象）。注意这个主题尚未执行。类`LoopUnlessCond`有一个方法`unless`，我们能用作*中缀操作符*。这样，我们便为我们的新循环创造了一个相当自然的语法：`loop { < stats > } unless ( < cond > )`.

这里是`TargetTest2`执行时的输出：

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1


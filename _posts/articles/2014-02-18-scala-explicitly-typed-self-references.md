---
layout: post
title: Scala 显式指定自身引用类型
categories:
- articles
comments: true
tags: [scala]
---

当开发可扩展的软件，有时显式声明`this`的类型是很有用的。为了说明这一点，我们从Scala中一个小的图数据结构的可扩展表示开始。

这里描述图的定义：

    abstract class Graph {
      type Edge
      type Node <: NodeIntf
      abstract class NodeIntf {
        def connectWith(node: Node): Edge
      }
      def nodes: List[Node]
      def edges: List[Edge]
      def addNode: Node
    }

图由一系列的节点和边构成，所有的节点和边类型都是左侧抽象。使用[抽象类型](abstract-types.html)能够通过实现图的特性来提供节点和边的各自具体类。此外，有一个`addNode`方法来为图添加新的节点。节点通过方法`connectWith`连接。

下一个类给出了类`Graph`的可能实现：

    abstract class DirectedGraph extends Graph {
      type Edge <: EdgeImpl
      class EdgeImpl(origin: Node, dest: Node) {
        def from = origin
        def to = dest
      }
      class NodeImpl extends NodeIntf {
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)
          edges = edge :: edges
          edge
        }
      }
      protected def newNode: Node
      protected def newEdge(from: Node, to: Node): Edge
      var nodes: List[Node] = Nil
      var edges: List[Edge] = Nil
      def addNode: Node = {
        val node = newNode
        nodes = node :: nodes
        node
      }
    }

类`DirectedGraph`通过提供部分细节来指定`Graph`类。这个实现也只是部分的，因为我们想接下来可以继承`DirectedGraph`.所以这个类保持所有实现细节开放，而且边和节点类型也是抽象的。
然而，类`DirectedGraph`还是透露了关于边类型的实现的一些额外细节，它限制了｀EdgeImpl｀类的范围。
此外，我们有一些边和节点的初步实现，通过类`EdgeImpl`和`NodeImpl`表示。因为部分图的实现中，有必要创建新的节点和边对象，我们还必须添加工厂方法`newNode`和`newEdge`。方法`addNode`和`connectWith`都是依据这些工厂方法定义的。更仔细来看方法`connectWith`的实现，可以发现为了创建一个边，我们必须将自引用`this`传给工厂方法`newEdge`。但是`this`被指定类型为`NodeImpl`，所以与对应工厂方法要求的类型`Node`不兼容。因此，上述程序并未完全成型，Scala编译器将会报出一个错误信息。

Scala中，可以通过显式指定自引用`this`的另一个类型来将一个类与另一类型（将在后面实现）关联起来。我们能利用这一机制修订我们上面的代码。显式自身类型在类`DirectedGraph`的主体中指定。

修订后的程序：

    abstract class DirectedGraph extends Graph {
      ...
      class NodeImpl extends NodeIntf {
        self: Node =>
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)  // now legal
          edges = edge :: edges
          edge
        }
      }
      ...
    }

在类`NodeImpl`的新定义里，`this`类型为`Node`。由于类型`Node`是抽象的，而且我们还不知道是否`NodeImpl`真的是`Node`的子类型，Scala的类型系统不会允许我们实例这个类。但是我们声明this的显式类型标注，某点而言，`NodeImpl`（的子类型）必须表示着一个`Node`的子类型从而能够实例化。

`DirectedGraph`的具体定制如下，所有抽象类成员均被转为具体的：

    class ConcreteDirectedGraph extends DirectedGraph {
      type Edge = EdgeImpl
      type Node = NodeImpl
      protected def newNode: Node = new NodeImpl
      protected def newEdge(f: Node, t: Node): Edge =
        new EdgeImpl(f, t)
    }

请注意在这个类中，我们能够实例化`NodeImpl`，因为现在我们知道`NodeImpl`指的是`Node`的子类型（仅仅是一个`NodeImpl`的别名而已）。

这里是类`ConcreteDirectedGraph`的用法例子：

    object GraphTest extends App {
      val g: Graph = new ConcreteDirectedGraph
      val n1 = g.addNode
      val n2 = g.addNode
      val n3 = g.addNode
      n1.connectWith(n2)
      n2.connectWith(n3)
      n1.connectWith(n3)
    }


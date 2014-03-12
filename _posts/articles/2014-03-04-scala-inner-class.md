---
layout: post
title: "Scala和Java内部类"
categories:
- articles
comments: true
tags: [scala,java]
---

Scala中类能够以其他类作为成员。然而不同于类Java语言中内部类是作为封闭类的成员，Scala中这些内部类是对外部对象的约束。为了说明其中的不同，我们快速地勾画一个图数据类型的实现

    class Graph {
      class Node {
        var connectedNodes: List[Node] = Nil
        def connectTo(node: Node) {
          if (connectedNodes.find(node.equals).isEmpty) {
            connectedNodes = node :: connectedNodes
          }
        }
      }
      var nodes: List[Node] = Nil
      def newNode: Node = {
        val res = new Node
        nodes = res :: nodes
        res
      }
    }


In Scala it is possible to let classes have other classes as members. Opposed to Java-like languages where such inner classes are members of the enclosing class, in Scala such inner classes are bound to the outer object. To illustrate the difference, we quickly sketch the implementation of a graph datatype:
 
    class Graph {
      class Node {
        var connectedNodes: List[Node] = Nil
        def connectTo(node: Node) {
          if (connectedNodes.find(node.equals).isEmpty) {
            connectedNodes = node :: connectedNodes
          }
        }
      }
      var nodes: List[Node] = Nil
      def newNode: Node = {
        val res = new Node
        nodes = res :: nodes
        res
      }
    }

在我们的程序中，图由一系列节点表示。节点是内部类`Node`的对象。每个节点有一系列邻居，存放在列表`connectedNodes`中。现在我们设置一个拥有一些节点的图并将节点依次连接起来。
 
    object GraphTest extends App {
      val g = new Graph
      val n1 = g.newNode
      val n2 = g.newNode
      val n3 = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }

我们现在结合类型来丰富上面的例子，显式声明各个定义的实体是什么类型：
 
    object GraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      val n3: g.Node = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }

代码清晰地显示节点类型以它的外部实例为前缀（即我们的例子中的对象`g`）。如果我们现在有两个图，Scala的类型系统不允许我们将一个图中定义节点与另外一个图的节点混用，因为其他图的节点具有不同的类型。
这是一个不合法的程序：
 
    object IllegalGraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      n1.connectTo(n2)      // legal
      val h: Graph = new Graph
      val n3: h.Node = h.newNode
      n1.connectTo(n3)      // illegal!
    }

请注意Java中前面的示例程序中的最后一行本应该是正确的。对于其他图的节点而言，Java将会赋予相同的类型`Graph.Node`；即`Node`是以类`Graph`作为前缀。Scala中也可以表达这样的类型，写作`Graph#Node`。如果我们想要能够链接不同图的节点，我们必须按接下来这种方式修改我们起初图实现的定义
 
    class Graph {
      class Node {
        var connectedNodes: List[Graph#Node] = Nil
        def connectTo(node: Graph#Node) {
          if (connectedNodes.find(node.equals).isEmpty) {
            connectedNodes = node :: connectedNodes
          }
        }
      }
      var nodes: List[Node] = Nil
      def newNode: Node = {
        val res = new Node
        nodes = res :: nodes
        res
      }
    }

> 请注意这个程序不允许我们将一个节点添加到两个不同的图。如果也想移除这个限制，我们必须将变量节点的类型变为`Graph#Node`。

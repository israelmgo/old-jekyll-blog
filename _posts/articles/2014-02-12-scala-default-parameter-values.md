---
layout: post
title: Scala 默认参量值
categories:
- articles
comments: true
tags: [scala]
---

Scala提供为参量设置默认值的能力，可用于允许调用者省略他们的参量。

Java中，会倾向于看到许多重载方法，只是为了给一个大的方法的特定参量提供默认值。这点在构造函数中尤为明显：

    public class HashMap<K,V> {
      public HashMap(Map<? extends K,? extends V> m);
      /** Create a new HashMap with default capacity (16) 
        * and loadFactor (0.75) 
        */
      public HashMap();
      /** Create a new HashMap with default loadFactor (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

这里真的只有两个构造函数；一个接收另外一个映射，而一个接收一个容量和载入因数。第三个和第四个构造函数在那里是为了允许`HashMap`的用户以大多数情况下可能最优的默认载入因数和容量来创建实例。

更有问题的是默认使用的值同时存在于Javadoc*和*代码中。很容易忘记保持更新。关于这一点典型的模式是添加到公开的常量中，它的值也会在Javadoc中显示。

    public class HashMap<K,V> {
      public static final int DEFAULT_CAPACITY = 16;
      public static final float DEFAULT_LOAD_FACTOR = 0.75;

      public HashMap(Map<? extends K,? extends V> m);
      /** Create a new HashMap with default capacity (16) 
        * and loadFactor (0.75) 
        */
      public HashMap();
      /** Create a new HashMap with default loadFactor (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

虽然它使得我们避免重复自己，但是并不那么具有表现力。
Scala对此添加了直接的支持：

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75) {
    }

    // Uses the defaults
    val m1 = new HashMap[String,Int]

    // initialCapacity 20, default loadFactor
    val m2= new HashMap[String,Int](20)

    // overriding both
    val m3 = new HashMap[String,Int](20,0.8)

    // override only the loadFactory via
    // named arguments
    val m4 = new HashMap[String,Int](loadFactor = 0.8)

注意我们能怎样通过使用[命名参量](named-parameters.html)发挥`任何`默认值的优势。

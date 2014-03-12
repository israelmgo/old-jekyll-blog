---
layout: post
title: "Pig Function Tutorial"
categories:
- articles
comments: true
tags: [apache,hadoop,pig,mapreduce,hdfs,bigdata]
---

> Slide: [pig_function](/talks/pig_function)

title: Pig Function
subtitle: A  tutorial for Pig built-in function and user defined functions

Pig Functions
=============
* Dynamic Invokers
* Built in functions
* User defined functions (UDFs)

Dynamic Invokers
================

	DEFINE UrlDecode InvokeForString('java.net.URLDecoder.decode', 'String String'); 
	encoded_strings = LOAD 'encoded_strings.txt' as (encoded:chararray); 
	decoded_strings = FOREACH encoded_strings GENERATE UrlDecode(encoded, 'UTF-8'); 

Java standard functions and not UDFs yet

- __static function__
- __primitives only__
- (void|string|int|long|double|float|array) => string|int|long|double|float


Dynamic Invokers - contine
================
>
	DEFINE ALIAS InvokerFor___('CLASS_PATH','PARAM_RET_TYPES')

* DEFINE
* Invoker
* Invoker (depending in return type)
	- InvokeForString
	- InvokeForInt
	- InvokeForLong
	- InvokeForDouble
	- InvokeForFloat
* Class Name
* Argument Types:
	- _space-delimited_ ordered list of the classes
	- string, long, float, double, and int
	- not case sensitive



Built in functions
================
* Eval Functions
* Load/Store Functions
* Math Functions
* String Functions
* Bag and Tuple Functions

Eval Functions
==============
* AVG
* CONCAT
* COUNT
* COUNT_STAR: Computes the number of elements in a bag
* DIFF
* IsEmpty
* MAX
* MIN
* SIZE
* SUM
* TOKENIZE

Load/Store Functions
====================
* Handling Compression
	- gzip: .gz (not splitable)
	- bzip: .bz or bz2
* BinStorage
	－ NOT compression
	－ multiple location inputs
* PigDump
	－ store data of tuples in human-readable UTF-8 format
* PigStorage: Load/Stores as structured text files
* TextLoader: Loads unstructured data in UTF-8 format

Math Functions
==============
* ABS
* ACOS
* ASIN
* ATAN
* CBRT
* CEIL
* COS
* COSH
* EXP
* FLOOR
* ...

String Functions
================
* INDEXOF(string, 'character', startIndex)
* LAST_INDEX_OF(string, 'character', startIndex)
* LCFIRST
* LOWER
* REGEX_EXTRACT(string, regex, index)
* REGEX_EXTRACT(string, regex)
* REPLACE(string, 'oldChar', 'newChar');
* STRSPLIT(string, regex, limit)
* SUBSTRING(string, startIndex, stopIndex)
* TRIM
* UCFIRST
* UPPER

Bag and Tuple Functions
=======================
* TOBAG(expression [, expression ...])
* TOP(topN,column,relation)
* TOTUPLE(expression [, expression ...])

User Defined Functions
======================

    -- myscript.pig
    REGISTER myudfs.jar;
    A = LOAD 'student_data' AS (name: chararray, age: int, gpa: float);
    B = FOREACH A GENERATE myudfs.UPPER(name);
    DUMP B;

* Java/Python/Javascript
* Piggy Bank
* Write UDF in Java: org.apache.pig.{EvalFunc,FilterFunc,StorageFunc,...}
* Load UDF in Pig

Eval UDFS
=========
* org.apache.pig.EvalFunc
	- Object exec(Tuple objects)
* Algebraic Interface
* Accumulator Interface

Algebraic Interface
==================

    public interface Algebraic{
        public String getInitial();
        public String getIntermed();
        public String getFinal();
    }

Gist: <https://gist.github.com/haoch/8346176#file-pig-udf-count-java>

Accumulator Interface
=====================

    public interface Accumulator <T> {
       /**
        * Process tuples. Each DataBag may contain 0 to many tuples for current key
        */
        public void accumulate(Tuple b) throws IOException;
        /**
        * Called when all tuples from current key have been passed to the accumulator.
        * @return the value for the UDF for this key.
        */
        public T getValue();
        /**
        * Called after getValue() to prepare processing for next key. 
        */
        public void cleanup();
    }

Gist: <https://gist.github.com/haoch/8346176#file-pig-udf-intmax-java>

Filter Function
===============
* org.apache.pig.FilterFunc
	- Boolean exec(Tuple input)

Gist:<https://gist.github.com/haoch/8346176#file-pig-udf-isempty-java>

Load/Storage UDF
================

    -- full outer join
    A = LOAD 'student_data' AS (name: chararray, age: int, gpa: float);
    B = LOAD 'voter_data' AS (name: chararray, age: int, registration: chararay, contributions: float);
    C = COGROUP A BY name, B BY name;
    D = FOREACH C GENERATE group, flatten((IsEmpty(A) ? null : A)), flatten((IsEmpty(B) ? null : B));
    dump D;

* org.apache.pig.StoreFunc
	- public void putNext(Tuple f) throws IOException
* org.apache.pig.LoadFunc
	- public Tuple getNext() throws IOException

Load UDF
========

	REGISTER myudfs.jar;
	A = LOAD 'student_data' AS (name: chararray, age: int, gpa: float);
	B = FOREACH A GENERATE myudfs.UPPER(name);
	DUMP B;

* REGISTER <jar>
* packege.ClassName(arguments)

Reference
=========
* [Pig Function](http://pig.apache.org/docs/r0.9.1/func.html)
* [Pig UDF](http://pig.apache.org/docs/r0.9.1/udf.html)
* [Programming-Pig](http://www.amazon.fr/Programming-Pig-Alan-Gates/dp/1449302645/ref=sr_1_1?ie=UTF8&qid=1389288284&sr=8-1&keywords=pig+programming)

The End
=======
Thanks

Hao
[haoch.me](http://haoch.me)

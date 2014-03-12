---
layout: post
title: "Github 项目管理与开发流程实践"
categories:
- articles
comments: true
tags: [git,github]
---

总所周知，[Github](http://github.com)是目前为止体验最好的Git版本控制服务，但是同时提供了非常清晰高效的项目跟踪和管理功能，全球知名的互联网公司如ebay等均购买其企业版本作为内部代码管理之用，对于普通个人开发者和开源项目，Github提供的开放免费或付费服务，也会为开发工作以及项目追踪和管理带来诸多便利。本文将概要记录本人利用github来跟踪和管理个人项目的实践与经验，作为自我总结，也便于日后改进完善。

创建项目
------
_项目名_:项目名统一均以字符加“-”组成，英文字母小写

_项目描述_:尽可能加入项目初略描述

_项目链接_: 此处链接一般为wiki链接，或者个人网站中的项目发布页(针对公开发行项目)

_README_: 作为项目的主要说明文档入口，一般会包含以下内容

* 项目全名
* 项目描述
* 当前版本以及链接(即tag链接)
* 项目截图（针对应用）
* 使用说明
	- 对于library，会提供maven（java）或者npm（nodejs）等
	- 对于应用，会提供安装使用的具体描述
* 详细文档链接（wiki或者个人站post）
* 支持和讨论链接（支持与讨论主要基于github的issue管理功能）

项目分支（Branch）
---------------
本文并非git的实践模式说明，具体git操作将在其他文章再予以详细介绍。此处讨论的分支主要用于区分code，doc，snapshot和release，
此处存在一定争议，对于git的最佳实践而言，编译后的binary文件并不适合放在github中，文档以及编译后的文件应该单独发布，当然这需要一定的额外成本，因此，此处仅鼓励针对独立开发者或者小型项目而言。

初始化情况下，会建立如下分支(branch)：

* __master__:主要代码分支，该branch上每次commit的代码最好均有issue与之对应，commit的comment满足以下格式: `#{ISSUE_ID}: issue title`, 并同时将commit id添加如对应的github issue描述中，使得github页面或者git log中均可对项目issue追踪有个清晰的掌控，每次项目版本完成时，针对版本号创建新的branch: `version-{VERSION_NUMBER}`以得到该版本的代码的一份snapshot。
* __dev__: 临时工作分支，对于针对具体issue进行开发，完成局部功能点，但尚未全部完成时，代码提交于此，commit的comment尽量需满足#下格式：`#{ISSUE_ID}: work log`，多人协作时，可通过分不同的brissue`#{ISSUE_ID}`来管理多个working 分支。
* __doc__:用于存放，截图，帮组文档以及release notes等非代码本身的文件，此部分功能可通过wiki完成，酌情选择
* __snapshot__:该branch一般会删除所有的source code，仅仅编译或打包后的文件，提供对于当前版本的下载。
* __release__:该branch与snapshot分支一样不包含source code，仅存放编译打包后的文件，提供对于不同已正式发布版本的下载。对于更加精细的release，可结合利用branch:`release-{VERSION_NUMBER}`与tag: `{VERSION_NUMBER}`,将tag打在对应release的branch上即可。而每次release新的版本最好对应不同的milestone，通过对应的milestone，便可查询出对应版本所解决的issue，根据issue对应的commit号，便可得知落实在代码上的具体修改。


版本定义
-------
对于持续交付和迭代的项目而言，版本号往往代表着产品发布的一系列功能的总体代号和里程碑。因此，设计一套明确有效的版本定义规则具有重要意义。

一般使用的版本发布规则非常简单: `N.N.N`

* 版本号最后一位，指代小规模的改进，主要是局部功能上的完善和bug的修复，每次改进自增一位，一般针对某个milestone，也可能包括紧急升级等。
* 版本号第二位，指代较大规模的功能或模块的改进，主要是功能的改进和添加较为重要的新功能，对应着多个milestone：`VERSION-N.N.N`
* 版本号的第三位，指代正式发布成熟产品时使用。

项目管理与开发
-----------
项目开发主要利用_master与_dev_两个branch，结合milestone和issue。

1. 创建__ISSUE__: 首先，制定项目总体scope，设计总体构架，细分功能点，将功能点分散，创建ISSUE.

2. 创建__MILESTONE__:创建MILESTONE,版本号命名:`VERSION-N.N.N`,对已有ISSUE进行优先级排序，将高优先级需求加入MILESTONE中。

3. 开发: 
	* 由高到低，选择ISSUE，理解ISSUE需求，
	* git clone/pull 最新代码
	* checkout至`dev` 分支(针对个人)或者创建新的branch:`#{ISSUE_ID}`进行设计，编码与测试
	* 每次commit均需加入满足规范的comment:`#{ISSUE_ID}: working log`，
	* 等整个ISSUE完成之后，进行code review，
	* 然后merge至`master`分支，并添加comments：`#{ISSUE_ID}: issue title`
4. 关闭ISSUE: ISSUE完成后，完成后关闭ISSUE，此时因为comments中使用了`#{ISSUE_ID}`，所有与该ISSUE关联的commit以及comments内容均会显示于issue详细页面。 
5. 关闭MILESTONE：当MILESTONE中的ISSUE均fix后，关闭MILESTONE
6. 版本发布: 根据milestone的版本号，进行项目版本发布:
	- 创建版本相关的branch:

			git branch release-{VERION_NUMBER}`
	
	- 切换至对应版本branch: 
	
			git checkout release-{VERSION_NUMBER}`
	
	- 提交对应branch:
		
			git push origin release-{VERSION_NUMBER}`
		
	- 创建版本相关tag:
		
			git tag {VERSION_NUMBER} -m {ISSUES_TITLE_LIST}`

	- 提交tag
		
			git push origin {VERSION_NUMBER}

__值得注意的是__: 

统一使用__`#{ISSUE_ID}`__来描述issue编号，主要有以下几处好处:

* 首先，统一ISSUE对应commit的comment规范，是得整个commentlog简单直观，很容易与对应的ISSUE关联
* 此外，github页面中，会自动为`#{NUMBER}`的文本添加对应编号的ISSUE页面的链接
* 而且，但凡以包含`#{NUMBER}`并且可关联至ISSUE NUMBER的comments，均会自动回复至github的issue页面中，如 <https://github.com/haoch/haoch.github.io/issues/2>

Git bash:

![git-log](/images/screenshot/git-log.png)

Github commit page:

[![github-commit](/images/screenshot/github-commit.png)](https://github.com/haoch/haoch.github.io/commits/master)

Github issue page:

[![github-issue](/images/screenshot/github-issue.png)](https://github.com/haoch/haoch.github.io/issues/2)

项目发布
-------
由于git原则上是不希望将编译后的binary文件添加到repository中，但是对于个人开发者和小型项目的轻量级需求而言，还是可取的，具体步骤如下:

* 创建release branch:
	
		git branch release
		git checkout release
		
* 清空除了.git文件夹内以外的所有文件
* 将编译后的打包文件拷贝其中，注意定义清晰的版本与目录或者文件的对应规则
* 添加到repository中
	
		git add {PACKAGE_FILE}
		git commit -am 'RELEASE-{VERSION_NUMBER}'
* 提交后，便可将github的raw服务作为cdn使用，又不与source code混杂一团

__值得注意的是__:以上方法，对于不同的发布内容，同样可以将github的raw服务作为特定服务使用，比如针对java而言可将其作为maven服务器使用，分发说明上便只需提供maven的repository url，groupid，artifactid以及version即可，而隐藏具体的文件下载细节，具体请阅读：[基于GITHUB搭建MAVEN仓库](http://haoch.me/articles/build-maven-repo-on-github.html)一文，当然不只是maven，对于nodejs，ruby等均可基于此定制自己的分发服务。


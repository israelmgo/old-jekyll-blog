---
layout: post
title: "Dive into Fair Scheduler"
categories:
- articles
comments: true
tags: [hadoop,mapreduce,code]
---

About Fair Scheduler
====================
Fair scheduling is a method of assigning resources to jobs such that all jobs get, on average, an equal share of resources over time. When there is a single job running, that job uses the entire cluster. When other jobs are submitted, tasks slots that free up are assigned to the new jobs, so that each job gets roughly the same amount of CPU time. Unlike the default Hadoop scheduler, which forms a queue of jobs, this lets short jobs finish in reasonable time while not starving long jobs. It is also an easy way to share a cluster between multiple of users. Fair sharing can also work with job priorities - the priorities are used as weights to determine the fraction of total compute time that each job gets.

The fair scheduler organizes jobs into pools, and divides resources fairly between these pools. By default, there is a separate pool for each user, so that each user gets an equal share of the cluster. It is also possible to set a job's pool based on the user's Unix group or any jobconf property. Within each pool, jobs can be scheduled using either fair sharing or first-in-first-out (FIFO) scheduling.

In addition to providing fair sharing, the Fair Scheduler allows assigning guaranteed minimum shares to pools, which is useful for ensuring that certain users, groups or production applications always get sufficient resources. When a pool contains jobs, it gets at least its minimum share, but when the pool does not need its full guaranteed share, the excess is split between other pools.

If a pool's minimum share is not met for some period of time, the scheduler optionally supports preemption of jobs in other pools. The pool will be allowed to kill tasks from other pools to make room to run. Preemption can be used to guarantee that "production" jobs are not starved while also allowing the Hadoop cluster to also be used for experimental and research jobs. In addition, a pool can also be allowed to preempt tasks if it is below half of its fair share for a configurable timeout (generally set larger than the minimum share preemption timeout). When choosing tasks to kill, the fair scheduler picks the most-recently-launched tasks from over-allocated jobs, to minimize wasted computation. Preemption does not cause the preempted jobs to fail, because Hadoop jobs tolerate losing tasks; it only makes them take longer to finish.

The Fair Scheduler can limit the number of concurrent running jobs per user and per pool. This can be useful when a user must submit hundreds of jobs at once, or for ensuring that intermediate data does not fill up disk space on a cluster when too many concurrent jobs are running. Setting job limits causes jobs submitted beyond the limit to wait until some of the user/pool's earlier jobs finish. Jobs to run from each user/pool are chosen in order of priority and then submit time.

Finally, the Fair Scheduler can limit the number of concurrent running tasks per pool. This can be useful when jobs have a dependency on an external service like a database or web service that could be overloaded if too many map or reduce tasks are run at once.

FIFOScheduler Policy
====================

Core code:
[org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.policies.FIFOPolicy.java](https://github.com/apache/hadoop-common/blob/trunk/hadoop-yarn-project/hadoop-yarn/hadoop-yarn-server/hadoop-yarn-server-resourcemanager/src/main/java/org/apache/hadoop/yarn/server/resourcemanager/scheduler/fair/policies/FifoPolicy.java)

{% highlight java %}
  /**
   * Compare Schedulables in order of priority and then submission time, as in
   * the default FIFO scheduler in Hadoop.
   */
  static class FifoComparator implements Comparator<Schedulable>, Serializable {
    private static final long serialVersionUID = -5905036205491177060L;

    @Override
    public int compare(Schedulable s1, Schedulable s2) {
      int res = s1.getPriority().compareTo(s2.getPriority());
      if (res == 0) {
        res = (int) Math.signum(s1.getStartTime() - s2.getStartTime());
      }
      if (res == 0) {
        // In the rare case where jobs were submitted at the exact same time,
        // compare them by name (which will be the JobID) to get a deterministic
        // ordering, so we don't alternately launch tasks from different jobs.
        res = s1.getName().compareTo(s2.getName());
      }
      return res;
    }
  }


  @Override
  public void computeShares(Collection<? extends Schedulable> schedulables,
      Resource totalResources) {
    if (schedulables.isEmpty()) {
      return;
    }

    Schedulable earliest = null;
    for (Schedulable schedulable : schedulables) {
      if (earliest == null ||
          schedulable.getStartTime() < earliest.getStartTime()) {
        earliest = schedulable;
      }
    }
    earliest.setFairShare(Resources.clone(totalResources));
  } 
{% endhighlight %}

FairScheduler Policy
=====================

FairScheduler policy core code：
[org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.policies.FairSharePolicy.java](https://github.com/apache/hadoop-common/blob/trunk/hadoop-yarn-project/hadoop-yarn/hadoop-yarn-server/hadoop-yarn-server-resourcemanager/src/main/java/org/apache/hadoop/yarn/server/resourcemanager/scheduler/fair/policies/FairSharePolicy.java#L65)

{% highlight java %}
/**
   * Compare Schedulables via weighted fair sharing. In addition, Schedulables
   * below their min share get priority over those whose min share is met.
   *
   * Schedulables below their min share are compared by how far below it they
   * are as a ratio. For example, if job A has 8 out of a min share of 10 tasks
   * and job B has 50 out of a min share of 100, then job B is scheduled next,
   * because B is at 50% of its min share and A is at 80% of its min share.
   *
   * Schedulables above their min share are compared by (runningTasks / weight).
   * If all weights are equal, slots are given to the job with the fewest tasks;
   * otherwise, jobs with more weight get proportionally more slots.
   */
  private static class FairShareComparator implements Comparator<Schedulable>,
          Serializable {
      private static final long serialVersionUID = 5564969375856699313L;

      @Override
      public int compare(Schedulable s1, Schedulable s2) {
          double minShareRatio1, minShareRatio2;
          double useToWeightRatio1, useToWeightRatio2;
          Resource minShare1 = Resources.min(RESOURCE_CALCULATOR, null,
                  s1.getMinShare(), s1.getDemand());
          Resource minShare2 = Resources.min(RESOURCE_CALCULATOR, null,
                  s2.getMinShare(), s2.getDemand());
          boolean s1Needy = Resources.lessThan(RESOURCE_CALCULATOR, null,
                  s1.getResourceUsage(), minShare1);
          boolean s2Needy = Resources.lessThan(RESOURCE_CALCULATOR, null,
                  s2.getResourceUsage(), minShare2);
          Resource one = Resources.createResource(1);
          minShareRatio1 = (double) s1.getResourceUsage().getMemory()
                  / Resources.max(RESOURCE_CALCULATOR, null, minShare1, one).getMemory();
          minShareRatio2 = (double) s2.getResourceUsage().getMemory()
                  / Resources.max(RESOURCE_CALCULATOR, null, minShare2, one).getMemory();
          useToWeightRatio1 = s1.getResourceUsage().getMemory() /
                  s1.getWeights().getWeight(ResourceType.MEMORY);
          useToWeightRatio2 = s2.getResourceUsage().getMemory() /
                  s2.getWeights().getWeight(ResourceType.MEMORY);
          int res = 0;
          if (s1Needy && !s2Needy)
              res = -1;
          else if (s2Needy && !s1Needy)
              res = 1;
          else if (s1Needy && s2Needy)
              res = (int) Math.signum(minShareRatio1 - minShareRatio2);
          else
              // Neither schedulable is needy
              res = (int) Math.signum(useToWeightRatio1 - useToWeightRatio2);
          if (res == 0) {
              // Apps are tied in fairness ratio. Break the tie by submit time and job
              // name to get a deterministic ordering, which is useful for unit tests.
              res = (int) Math.signum(s1.getStartTime() - s2.getStartTime());
              if (res == 0)
                  res = s1.getName().compareTo(s2.getName());
          }
          return res;
      }
  } 

  @Override
  public void computeShares(Collection<? extends Schedulable> schedulables,
      Resource totalResources) {
    ComputeFairShares.computeShares(schedulables, totalResources, ResourceType.MEMORY);
  } 

{% endhighlight %}

DominantResourceFairness Policy
===============================

DominantResourceFairness policy core code: 
[org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.policies.DominantResourceFairnessPolicy.java](https://github.com/apache/hadoop-common/blob/trunk/hadoop-yarn-project/hadoop-yarn/hadoop-yarn-server/hadoop-yarn-server-resourcemanager/src/main/java/org/apache/hadoop/yarn/server/resourcemanager/scheduler/fair/policies/DominantResourceFairnessPolicy.java#L87)

{% highlight java %}
public static class DominantResourceFairnessComparator implements Comparator<Schedulable> {
    private static final int NUM_RESOURCES = ResourceType.values().length;
   
    private Resource clusterCapacity;

    public void setClusterCapacity(Resource clusterCapacity) {
      this.clusterCapacity = clusterCapacity;
    }

    @Override
    public int compare(Schedulable s1, Schedulable s2) {
      ResourceWeights sharesOfCluster1 = new ResourceWeights();
      ResourceWeights sharesOfCluster2 = new ResourceWeights();
      ResourceWeights sharesOfMinShare1 = new ResourceWeights();
      ResourceWeights sharesOfMinShare2 = new ResourceWeights();
      ResourceType[] resourceOrder1 = new ResourceType[NUM_RESOURCES];
      ResourceType[] resourceOrder2 = new ResourceType[NUM_RESOURCES];
     
      // Calculate shares of the cluster for each resource both schedulables.
      calculateShares(s1.getResourceUsage(),
          clusterCapacity, sharesOfCluster1, resourceOrder1, s1.getWeights());
      calculateShares(s1.getResourceUsage(),
          s1.getMinShare(), sharesOfMinShare1, null, ResourceWeights.NEUTRAL);
      calculateShares(s2.getResourceUsage(),
          clusterCapacity, sharesOfCluster2, resourceOrder2, s2.getWeights());
      calculateShares(s2.getResourceUsage(),
          s2.getMinShare(), sharesOfMinShare2, null, ResourceWeights.NEUTRAL);
     
      // A queue is needy for its min share if its dominant resource
      // (with respect to the cluster capacity) is below its configured min share
      // for that resource
      boolean s1Needy = sharesOfMinShare1.getWeight(resourceOrder1[0]) < 1.0f;
      boolean s2Needy = sharesOfMinShare2.getWeight(resourceOrder2[0]) < 1.0f;
     
      int res = 0;
      if (!s2Needy && !s1Needy) {
        res = compareShares(sharesOfCluster1, sharesOfCluster2,
            resourceOrder1, resourceOrder2);
      } else if (s1Needy && !s2Needy) {
        res = -1;
      } else if (s2Needy && !s1Needy) {
        res = 1;
      } else { // both are needy below min share
        res = compareShares(sharesOfMinShare1, sharesOfMinShare2,
            resourceOrder1, resourceOrder2);
      }
      if (res == 0) {
        // Apps are tied in fairness ratio. Break the tie by submit time.
        res = (int)(s1.getStartTime() - s2.getStartTime());
      }
      return res;
    }
   
    /**
     * Calculates and orders a resource's share of a pool in terms of two vectors.
     * The shares vector contains, for each resource, the fraction of the pool that
     * it takes up.  The resourceOrder vector contains an ordering of resources
     * by largest share.  So if resource=<10 MB, 5 CPU>, and pool=<100 MB, 10 CPU>,
     * shares will be [.1, .5] and resourceOrder will be [CPU, MEMORY].
     */
    void calculateShares(Resource resource, Resource pool,
        ResourceWeights shares, ResourceType[] resourceOrder, ResourceWeights weights) {
      shares.setWeight(MEMORY, (float)resource.getMemory() /
          (pool.getMemory() * weights.getWeight(MEMORY)));
      shares.setWeight(CPU, (float)resource.getVirtualCores() /
          (pool.getVirtualCores() * weights.getWeight(CPU)));
      // sort order vector by resource share
      if (resourceOrder != null) {
        if (shares.getWeight(MEMORY) > shares.getWeight(CPU)) {
          resourceOrder[0] = MEMORY;
          resourceOrder[1] = CPU;
        } else  {
          resourceOrder[0] = CPU;
          resourceOrder[1] = MEMORY;
        }
      }
    }
   
    private int compareShares(ResourceWeights shares1, ResourceWeights shares2,
        ResourceType[] resourceOrder1, ResourceType[] resourceOrder2) {
      for (int i = 0; i < resourceOrder1.length; i++) {
        int ret = (int)Math.signum(shares1.getWeight(resourceOrder1[i])
            - shares2.getWeight(resourceOrder2[i]));
        if (ret != 0) {
          return ret;
        }
      }
      return 0;
    }
  } 
{% endhighlight %}

>> UNCOMPLETED
---------------

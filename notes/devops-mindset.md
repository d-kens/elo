<!-- Sample notes drafted by Claude to show the format. Rewrite them in your own words before you publish. -->

## Why this matters

Software only creates value once it is running in front of users. In many teams, developers write code and then hand it to a separate operations team to deploy and run. Each side is measured on different things: developers on shipping features, operations on keeping things stable. That split creates slow releases, risky deployments and a lot of blame.

DevOps is the response to that gap.

## Key ideas

### DevOps is a culture plus practices, not a job title

DevOps means the people who build software and the people who run it share responsibility for the whole journey, from commit to production, and automate as much of that journey as they can. A "DevOps engineer" title does not make a team DevOps; shared ownership and fast feedback do.

### CALMS

A handy checklist for whether a team is really doing DevOps:

| Letter | Stands for | In practice |
| --- | --- | --- |
| C | Culture | Shared ownership, no "throw it over the wall" |
| A | Automation | Builds, tests, deployments and infrastructure run by machines |
| L | Lean | Small batches, less waiting, less work in progress |
| M | Measurement | Decisions based on data, such as the DORA metrics |
| S | Sharing | Knowledge, tools and lessons learned flow between teams |

### The Three Ways

From *The DevOps Handbook*:

1. **Flow**: make work move quickly and smoothly from development to production. Small changes, fewer handoffs.
2. **Feedback**: find problems as early as possible, through tests, monitoring and alerts.
3. **Continuous learning**: experiment, learn from failures without blame, and keep improving.

### DORA metrics

Four measures from the DORA research programme that describe how well a team delivers software:

| Metric | Question it answers | Speed or stability |
| --- | --- | --- |
| Deployment frequency | How often do we release to production? | Speed |
| Lead time for changes | How long from commit to running in production? | Speed |
| Change failure rate | What share of deployments cause a problem? | Stability |
| Time to restore service | How fast do we recover when something breaks? | Stability |

The key finding: the best teams are fast **and** stable. Speed and stability are not a trade-off.

> DORA now calls the last one *failed deployment recovery time*. You will see both names.

### How DevOps compares

- **Agile** changed how teams *plan and build* software in short iterations. DevOps extends that thinking to *releasing and running* it.
- **SRE** (Site Reliability Engineering) is one concrete way to do DevOps, using engineering and measurable targets (SLOs) to run reliable systems.
- **Platform engineering** builds internal tools and "golden paths" so product teams can do DevOps without each one reinventing the wheel.

## Common pitfalls

- Treating DevOps as mostly about tools. The tools matter, but they only help when the team already shares ownership.

## Checkpoint

**Why does "throw it over the wall" fail?** The team that writes the code never sees it break in production, so it never learns how to make it easier to run. Operations receives changes it did not help design, so it slows releases down to stay safe. Feedback is slow, releases get bigger and riskier, and each side blames the other.

**What improves each DORA metric?**

- Deployment frequency: smaller changes and an automated pipeline.
- Lead time: fewer manual approvals and handoffs, fast automated tests.
- Change failure rate: better automated testing and gradual rollouts such as canary releases.
- Time to restore: good monitoring, quick rollbacks and practised incident response.

## Further reading

- *The Phoenix Project* and *The DevOps Handbook* by Gene Kim and others
- *Accelerate* by Nicole Forsgren, Jez Humble and Gene Kim
- The yearly DORA *State of DevOps* report

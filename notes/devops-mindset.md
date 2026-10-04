## At a glance

**DevOps is a way of working where the people who build software and the people who run it share responsibility for getting changes to users quickly and safely, and automate as much of that journey as they can.**

By the end of this module you will be able to:

1. Explain the problem DevOps solves.
2. Describe DevOps using the CALMS model.
3. Explain the Three Ways: flow, feedback and continuous learning.
4. Name the four DORA metrics and say what improves each one.
5. Tell DevOps apart from Agile, SRE and Platform Engineering.

Key terms you will meet:

| Term | Meaning in one line |
| --- | --- |
| Deployment | Putting a new version of software into an environment, such as production |
| Production | The live system real users rely on |
| Lead time | How long a change takes to go from written to running in production |
| Feedback loop | How quickly you find out whether a change worked |
| Handoff | A point where work passes from one person or team to another |

## 1. The problem DevOps solves

Picture a typical company before DevOps.

- The **development team** writes new features. They are rewarded for shipping change.
- The **operations team** runs the servers. They are rewarded for keeping things stable.

Most outages are triggered by a change, so the two teams want opposite things. Developers finish a feature and hand it over. Operations receives code they did not help design and do not fully understand, so they slow releases down to stay safe. People call this **"throwing it over the wall"**.

Here is what that looks like in practice:

1. Developers work for three months on a big release.
2. They hand it to operations with a long list of manual install steps.
3. The release happens late at night. Something breaks.
4. Operations does not know the code, and developers have gone home. Fixing it takes hours.
5. Both teams decide releases are dangerous, so they release even less often.
6. The next release is even bigger, which makes it even riskier.

This is a vicious circle: **big releases are risky, so teams release rarely, which makes releases bigger and riskier still.**

DevOps breaks the circle by doing the opposite: **release small changes often, with shared ownership and automation**, so each release is boring and easy to fix.

> The word "DevOps" took off around 2009, after Patrick Debois organised the first DevOpsDays conference in Ghent. The same year, engineers at Flickr gave a well-known talk about deploying more than ten times a day by getting development and operations to work together.

## 2. What DevOps is, and what it is not

DevOps is **culture plus practices**.

- **Culture:** developers and operations share the same goal: working software in front of users. Everyone owns the outcome, not just their part of it.
- **Practices:** version control, automated testing, continuous integration and delivery, infrastructure as code, monitoring, and blameless incident reviews. The rest of this path teaches each of them.

| DevOps is… | DevOps is not… |
| --- | --- |
| A way of working shared by the whole team | A job title or a separate "DevOps team" sitting in the middle |
| Small, frequent, automated releases | Buying a set of tools |
| Measuring results and improving | Moving fast and ignoring stability |
| Developers caring about production | Developers doing all of operations alone |

A company can hire "DevOps engineers" and buy every popular tool and still not be doing DevOps. If teams still throw work over the wall, nothing has really changed.

## 3. The CALMS model

CALMS is a simple checklist for judging whether a team really works the DevOps way. It started as CAMS (John Willis and Damon Edwards), and Jez Humble later added the L.

### C: Culture

People share responsibility and trust each other. When something fails, the question is "what in our system allowed this?" and not "whose fault is it?"

- **Healthy sign:** developers join incident calls for their own services.
- **Warning sign:** "That is an ops problem."

The DORA research uses Ron Westrum's three culture types. **Generative** cultures, where information flows freely and failures lead to learning, perform best. **Pathological** cultures, built on fear and blame, perform worst.

### A: Automation

Machines do the repetitive, error-prone work: building, testing, deploying and creating servers.

- **Healthy sign:** one command, or one merged pull request, deploys to production.
- **Warning sign:** a 40-step deployment document that only one person understands.

### L: Lean

Work flows in small batches, with as little waiting as possible. Ideas come from lean manufacturing: limit work in progress and remove waste such as waiting, handoffs and rework.

- **Healthy sign:** changes are small and reach production within a day or two.
- **Warning sign:** finished features sit waiting weeks for a release date.

### M: Measurement

Decisions are based on data, not opinion. Teams measure how they deliver (the DORA metrics, below) and how their systems behave (monitoring).

- **Healthy sign:** the team knows its deployment frequency and failure rate.
- **Warning sign:** "We think it is going fine."

### S: Sharing

Knowledge, tools and lessons move freely between people and teams: shared dashboards, written runbooks, open postmortems.

- **Healthy sign:** an incident write-up is shared so other teams can learn from it.
- **Warning sign:** knowledge lives in one person's head.

## 4. The Three Ways

The Three Ways come from Gene Kim's books *The Phoenix Project* and *The DevOps Handbook*. They describe the principles behind every DevOps practice. Learn them in order: each one builds on the one before.

### The First Way: flow

**Make work move quickly and smoothly from idea to production.**

- Work in small batches.
- Reduce handoffs and waiting.
- Make work visible, for example on a board.
- Automate the path to production.

Think of a motorway. Traffic moves fastest when there are no tollbooths and no sudden bottlenecks.

### The Second Way: feedback

**Find out about problems as early and as quickly as possible, so they are cheap to fix.**

- Automated tests run on every change.
- Monitoring and alerts show how production behaves.
- Developers see the effect of their changes in production.

A bug found by a test in two minutes costs almost nothing. The same bug found by a customer a month later costs a lot.

### The Third Way: continuous learning

**Create a culture that experiments, learns from failure and keeps improving.**

- Hold blameless reviews after incidents.
- Set aside time to improve tools and processes, not just ship features.
- Share what you learn across teams.

| Way | Question it answers | Example practice |
| --- | --- | --- |
| Flow | How fast does work move? | Continuous integration and delivery |
| Feedback | How fast do we learn something went wrong? | Automated tests and monitoring |
| Continuous learning | Do we get better over time? | Blameless postmortems |

## 5. The DORA metrics

DORA (DevOps Research and Assessment) is a research programme that has studied thousands of teams since 2014. It was founded by Nicole Forsgren, Jez Humble and Gene Kim, and is now part of Google. Its main findings are in the book *Accelerate* and the yearly *State of DevOps* reports.

DORA found that **four metrics** describe how well a team delivers software. Two measure **speed** and two measure **stability**.

### Speed

**1. Deployment frequency**: how often the team deploys to production.

- How to measure: count production deployments per day, week or month.
- What improves it: smaller changes, an automated pipeline, fewer manual approvals.

**2. Lead time for changes**: how long it takes a commit to reach production.

- How to measure: time from commit to running in production.
- What improves it: fast automated tests, quick code reviews, removing handoffs and waiting.

### Stability

**3. Change failure rate**: the percentage of deployments that cause a problem in production, such as an outage, a rollback or an urgent fix.

- How to measure: failed deployments ÷ total deployments.
- What improves it: better automated testing, smaller changes, gradual rollouts such as canary releases.

**4. Time to restore service**: how long it takes to recover when a deployment causes a failure.

- How to measure: time from the failure starting to service being back to normal.
- What improves it: good monitoring and alerts, quick rollbacks, practised incident response.

> In 2023 DORA renamed the fourth metric **failed deployment recovery time**, to make clear it measures recovery from failures caused by a deployment, not from every outage. You will see both names. Recent reports also track a fifth measure, **rework rate**, but the four above are the core.

### The key finding

**The best teams are both fast and stable.** Speed and stability are not a trade-off: they reinforce each other. Small, frequent changes are easier to test, easier to understand and easier to roll back.

| Metric | Measures | Goal |
| --- | --- | --- |
| Deployment frequency | Speed | Higher |
| Lead time for changes | Speed | Lower |
| Change failure rate | Stability | Lower |
| Time to restore service | Stability | Lower |

Use these metrics to help a team improve, never to rank individuals or punish teams. Once a metric becomes a target people are judged by, people learn to game it.

## 6. DevOps compared with Agile, SRE and Platform Engineering

These ideas overlap and are often confused. The simplest way to separate them is to ask what each one focuses on.

| Approach | Main focus | Key question |
| --- | --- | --- |
| Agile | Planning and building software in short cycles | Are we building the right thing, in small steps? |
| DevOps | Delivering and running software, end to end | Can we get changes to users quickly and safely? |
| SRE | Running reliable systems with engineering and measurable targets | How reliable must it be, and are we meeting that? |
| Platform Engineering | Building internal tools that make the DevOps way easy | Can teams self-serve what they need? |

- **Agile → DevOps:** Agile made development faster, but code still waited for slow, manual releases. DevOps extends Agile thinking all the way to production.
- **DevOps → SRE:** SRE, created at Google, is one concrete way to practise DevOps. It uses reliability targets called SLOs and error budgets to decide when to ship and when to focus on stability. Google describes it as "class SRE implements interface DevOps". Module 16 covers SRE.
- **DevOps → Platform Engineering:** as companies grow, every team rebuilding its own pipelines and infrastructure becomes wasteful. A platform team builds shared "golden paths" so product teams get DevOps capabilities without being experts in everything. Module 20 covers this.

They are not competitors. A healthy organisation often uses all four together.

## 7. Try it: map a delivery process

This exercise makes the ideas concrete. It needs only a pen and paper. Use a made-up project or a personal one, and keep it free of any real company details.

1. Write down every step a change takes, from "developer starts coding" to "users have it". Include reviews, approvals, testing, packaging and deploying.
2. For each step, estimate how long the **work** takes and how long the change **waits** before the step starts.
3. Circle every **handoff**, where work passes to another person or team.
4. Mark every **manual** step.

Now look at the result:

- Where does most of the time go: working or waiting? (Usually waiting.)
- Which handoff or manual step would you remove first?
- Which DORA metric would that improve?

This is a simple version of **value stream mapping**, a lean technique teams use to find their biggest delays.

## Common pitfalls

- **Treating DevOps as a tool purchase.** Tools help only once the team shares ownership and works in small batches.
- **Creating a separate "DevOps team" in the middle.** It often becomes a new wall between development and operations.
- **Chasing speed and ignoring stability.** The DORA research shows the best teams improve both together.
- **Using metrics to blame people.** That makes people hide problems, which slows learning.
- **Automating a bad process.** Simplify the process first, then automate it.

## Checkpoint

**1. Why does "throwing it over the wall" fail?**

The people who write the code never see it break in production, so they never learn how to make it easier to run. Operations receives changes it did not help design, so it slows releases down to stay safe. Releases grow bigger and riskier, feedback becomes slow, and the teams start blaming each other instead of fixing the system.

**2. Name the four DORA metrics and what improves each one.**

| Metric | What improves it |
| --- | --- |
| Deployment frequency | Smaller changes and an automated pipeline |
| Lead time for changes | Fast automated tests and fewer handoffs and approvals |
| Change failure rate | Better testing and gradual rollouts such as canary releases |
| Time to restore service | Good monitoring, quick rollbacks and practised incident response |

## Key takeaways

1. DevOps is **culture plus practices**, not a job title or a set of tools.
2. Its goal is to get changes to users **quickly and safely**, through shared ownership and automation.
3. **CALMS** (Culture, Automation, Lean, Measurement, Sharing) is a checklist for judging how well a team works the DevOps way.
4. The **Three Ways** (flow, feedback, continuous learning) are the principles behind every practice in this path.
5. The **four DORA metrics** measure delivery. The best teams are fast and stable at the same time.
6. Agile, DevOps, SRE and Platform Engineering work together. They focus on different parts of the same journey.

**Next:** Module 2 covers Linux, the system almost every server you deploy to will run.

## Further reading

- *The Phoenix Project* by Gene Kim, Kevin Behr and George Spafford: a novel about a failing IT team discovering DevOps. The easiest place to start.
- *The DevOps Handbook* by Gene Kim, Jez Humble, Patrick Debois, John Willis and Nicole Forsgren: the practical guide to the Three Ways.
- *Accelerate* by Nicole Forsgren, Jez Humble and Gene Kim: the research behind the DORA metrics.
- The yearly DORA *State of DevOps* report, free on the DORA website.

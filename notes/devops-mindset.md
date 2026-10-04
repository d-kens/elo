This module answers five questions, in order:

1. What is DevOps?
2. How does work move through a DevOps team?
3. Why did DevOps appear?
4. How do you do DevOps well?
5. How do you know it is working?

Then it gives you a quick checklist for any team, and three related names you will hear.

## 1. What is DevOps?

**DevOps** joins two words: **Dev** for development, the people who write software, and **Ops** for operations, the people who keep it running for users.

**DevOps is a way of working where those two groups work as one team, and automate the steps in between, so new changes reach users quickly and safely.**

It is not a tool you install or a job title. It is how a team works.

So why do job adverts ask for **DevOps engineers**? People with that title usually build the automation that lets a team work the DevOps way: the automated build, test and deploy steps, servers set up from code, and monitoring. That is what the rest of this path teaches.

## 2. How does work move? The DevOps loop

Every change to a piece of software goes through the same eight stages. DevOps draws them as an infinity loop, because the loop never ends: what you learn from running the software tells you what to build next.

<figure class="loop"><svg viewBox="-110 10 940 290" role="img" aria-label="The DevOps loop: an infinity sign. The Dev side has Plan, Code, Build and Test. The Ops side has Release, Deploy, Operate and Monitor, which leads back to Plan." style="width:100%;height:auto;font:600 19px var(--f-body);fill:var(--fg)">
<path d="M360,150 C 300,40 60,40 60,150 C 60,260 300,260 360,150 C 420,40 660,40 660,150 C 660,260 420,260 360,150" fill="none" stroke="var(--muted)" stroke-width="4" opacity=".6"/>
<path d="M-9,-8 L9,0 L-9,8 z" fill="var(--muted)" transform="translate(306 97) rotate(-150)"/><path d="M-9,-8 L9,0 L-9,8 z" fill="var(--muted)" transform="translate(306 203) rotate(-30)"/><path d="M-9,-8 L9,0 L-9,8 z" fill="var(--muted)" transform="translate(414 97) rotate(-30)"/><path d="M-9,-8 L9,0 L-9,8 z" fill="var(--muted)" transform="translate(414 203) rotate(-150)"/>
<text x="180" y="162" text-anchor="middle" style="font:800 34px var(--f-display);fill:var(--red)">Dev</text>
<text x="540" y="162" text-anchor="middle" style="font:800 34px var(--f-display)">Ops</text>
<circle cx="208" cy="68" r="7" fill="var(--red)"/><text x="218" y="46" text-anchor="middle">Plan</text><circle cx="67" cy="120" r="7" fill="var(--red)"/><text x="53" y="126" text-anchor="end">Code</text><circle cx="67" cy="180" r="7" fill="var(--red)"/><text x="53" y="186" text-anchor="end">Build</text><circle cx="208" cy="232" r="7" fill="var(--red)"/><text x="218" y="266" text-anchor="middle">Test</text><circle cx="512" cy="68" r="7" fill="var(--fg)"/><text x="502" y="46" text-anchor="middle">Release</text><circle cx="653" cy="120" r="7" fill="var(--fg)"/><text x="667" y="126" text-anchor="start">Deploy</text><circle cx="653" cy="180" r="7" fill="var(--fg)"/><text x="667" y="186" text-anchor="start">Operate</text><circle cx="512" cy="232" r="7" fill="var(--fg)"/><text x="502" y="266" text-anchor="middle">Monitor</text>
</svg></figure>

| Stage | What happens |
| --- | --- |
| **Plan** | Decide what to build or fix next |
| **Code** | Write the change, and save it in Git so everyone shares one copy |
| **Build** | Turn the code into a package that is ready to install |
| **Test** | Check automatically that the change works and breaks nothing |
| **Release** | Approve a tested version as ready to go live |
| **Deploy** | Put that version on the servers users reach |
| **Operate** | Keep the servers and the software running |
| **Monitor** | Watch how it behaves and spot problems early |

Two things make this DevOps:

- **Dev and Ops work as one team.** Developers and operations people share the whole loop instead of handing work to each other. Developers still mostly write code and operations people still mostly run systems, but both help when something breaks.
- **Computers do the repeated steps.** Building, testing and deploying happen automatically, not by hand.

## 3. Why did DevOps appear?

Before DevOps, most companies split the loop in two. Developers owned Plan to Test. Operations owned Release to Monitor. Developers worked for months, then handed everything over in one go. People call this **"throwing it over the wall"**.

It caused three problems:

1. **Slow, big releases.** Changes waited months, then went out together in one large, risky batch.
2. **Problems found late.** Operations ran code they had never seen. When it broke, users noticed first, and nobody knew which change caused it.
3. **Blame.** Each team blamed the other, so nobody fixed the real cause.

The problems fed each other. Releases kept breaking, so teams released less often, so each release got bigger and broke even more.

## 4. How do you do DevOps well? The Three Ways

The Three Ways are three principles, one for each problem above. Every DevOps practice in the rest of this path is one of them in action. They were set out by Gene Kim in *The DevOps Handbook*.

| Way | Fixes | What it means | How teams do it |
| --- | --- | --- | --- |
| **1. Flow** | Slow, big releases | Move each change round the loop quickly, in small pieces | Small changes, and automated build, test and deploy |
| **2. Feedback** | Problems found late | Find problems as early as possible, while they are cheap to fix | Automated tests at Test, and monitoring at Monitor |
| **3. Continuous learning** | Blame | After something breaks, ask "what allowed this?", not "whose fault was it?", and fix that | A short, blameless review after every problem |

Put simply: flow makes the loop fast, feedback makes it safe, and learning makes each trip round it better than the last.

## 5. How do you know it is working? The DORA metrics

The Three Ways tell you what to do. The DORA metrics tell you whether it is working.

DORA (DevOps Research and Assessment) is a research programme, now part of Google, that has studied thousands of teams. It found four numbers that show how well a team delivers software. The first two measure speed, which shows whether you have flow. The last two measure stability, which shows whether feedback is catching problems.

| Metric | What it measures | What improves it |
| --- | --- | --- |
| **Deployment frequency** | How often you deploy (more often is better) | Small changes and automated deploys |
| **Lead time for changes** | How long a change takes to reach users (shorter is better) | Fast automated tests and less waiting for approvals |
| **Change failure rate** | Out of all deploys, what share cause a problem (lower is better) | Better tests and smaller changes |
| **Time to restore service** | When a deploy causes a problem, how long until it works again (shorter is better) | Good monitoring and a quick way to undo a deploy |

DORA's key finding: **the best teams are both fast and stable.** You do not have to choose. Small, frequent changes are easier to test and easier to undo.

## 6. A quick check: CALMS

DORA measures results. CALMS checks the habits behind them. Ask these five questions about any team:

| Letter | Ask |
| --- | --- |
| **C**ulture | Does everyone share responsibility, without blame? |
| **A**utomation | Do computers do the repeated steps? |
| **L**ean | Does work move in small pieces, with little waiting? |
| **M**easurement | Do decisions use numbers, such as the DORA metrics? |
| **S**haring | Is knowledge written down and shared? |

## 7. Related names: Agile, SRE and Platform Engineering

You will often hear these three names alongside DevOps:

- **Agile** is about how a team plans and builds software in short steps. DevOps carries the same idea on through releasing and running it.
- **SRE** (Site Reliability Engineering) is Google's way of doing DevOps, focused on keeping systems reliable. Module 16 covers it.
- **Platform Engineering** builds shared tools so every team can follow the loop without building everything themselves. Module 20 covers it.

## Module summary

- **DevOps** is a way of working where Dev and Ops work as one team and automate the steps in between, so changes reach users quickly and safely.
- Every change goes round the **DevOps loop**: Plan, Code, Build, Test, Release, Deploy, Operate, Monitor, then back to Plan.
- DevOps appeared because splitting the loop between two teams, "throwing it over the wall", caused big releases, problems found late, and blame.
- The **Three Ways** fix those three problems: **flow** (small changes that move quickly), **feedback** (find problems early) and **continuous learning** (fix causes, not people).
- The four **DORA metrics** show whether it is working. Deployment frequency and lead time measure speed. Change failure rate and time to restore service measure stability. The best teams are fast and stable.
- **CALMS** (Culture, Automation, Lean, Measurement, Sharing) is a quick check on a team's habits.
- **Agile** covers planning and building in short steps. **SRE** and **Platform Engineering** are ways of putting DevOps into practice.

## Further reading

- *The Phoenix Project* by Gene Kim, Kevin Behr and George Spafford: a novel about a team discovering DevOps. No technical knowledge needed.
- [dora.dev](https://dora.dev): the DORA research and the yearly *State of DevOps* report.

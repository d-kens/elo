## At a glance

**Linux is the operating system that runs almost every server, container and cloud machine you will work with. Being comfortable on its command line is the foundation for everything else in this path.**

By the end of this module you will be able to:

1. Find your way around the Linux filesystem and know where things live.
2. Read and change file permissions, and manage users and groups.
3. Inspect processes and stop them safely with signals.
4. Install software with a package manager.
5. Run a program as a service with systemd, and read its logs with journalctl.
6. Schedule jobs with cron.
7. Answer "why is this server slow or broken?" with the right inspection tool.

Key terms you will meet:

| Term | Meaning in one line |
| --- | --- |
| Shell | The program that reads your commands, usually Bash |
| Root | The all-powerful administrator account |
| Process | A running program, identified by a number called a PID |
| Service | A program that runs in the background, usually started at boot |
| Unit | systemd's name for anything it manages, such as a service |
| Signal | A message sent to a process, for example "please stop" |

You need a Linux machine to follow along. Easy options:

- **Multipass** (Windows, macOS, Linux): `multipass launch --name lab 24.04`, then `multipass shell lab` gives you an Ubuntu VM.
- **WSL2** on Windows: install Ubuntu from the Microsoft Store. For the systemd parts, enable systemd by adding `[boot]` and `systemd=true` to `/etc/wsl.conf`, then restart WSL.
- **A small cloud VM** on any provider.

Docker containers are not a good fit for this module, because they do not normally run systemd.

## 1. Why Linux matters for DevOps

- **Servers run Linux.** Most web servers, almost all cloud workloads and nearly every container image are Linux.
- **Containers are Linux.** Docker and Kubernetes are built on Linux kernel features (Module 7 shows which ones).
- **Automation is command-line work.** CI pipelines, scripts and infrastructure tools all run shell commands on Linux machines.
- **Debugging happens here.** When production breaks at 2 a.m., you will be on a Linux shell reading logs and checking processes.

You do not need to memorise every command. You need a clear mental model and a small set of tools you trust.

## 2. Shell essentials

The shell is where you type commands. Each command has the shape `command -options arguments`, for example `ls -l /etc`.

| Task | Command | Notes |
| --- | --- | --- |
| Where am I? | `pwd` | Print working directory |
| What is here? | `ls -la` | `-l` long format, `-a` include hidden files |
| Move around | `cd /var/log`, `cd ..`, `cd ~` | `~` is your home directory |
| Read a file | `cat file`, `less file` | `less` scrolls; press `q` to quit |
| Start or end of a file | `head -n 20 file`, `tail -n 20 file` | `tail -f file` follows new lines live |
| Copy, move, delete | `cp`, `mv`, `rm` | `rm` has no recycle bin. Deleted is gone. |
| Make a directory | `mkdir -p a/b/c` | `-p` creates parents as needed |
| Find files | `find /etc -name "*.conf"` | Search by name, size, age and more |
| Search inside files | `grep -r "error" /var/log` | Module 4 covers grep in depth |
| Get help | `man ls`, `ls --help` | `man` opens the manual |
| Run as administrator | `sudo command` | Runs one command as root |

Two habits that save you:

1. **Press Tab** to auto-complete commands and paths. It is faster and prevents typos.
2. **Check before you delete.** Run `ls` on a path before you run `rm -r` on it.

## 3. The filesystem layout

Linux has a single tree of directories starting at `/`, called "root". There are no drive letters. Other disks are attached ("mounted") somewhere inside the tree.

| Path | What lives there |
| --- | --- |
| `/etc` | System-wide configuration files |
| `/var/log` | Log files |
| `/var/lib` | Data that programs keep, such as databases and Docker images |
| `/home/<user>` | Each user's personal files |
| `/root` | The root user's home directory |
| `/usr/bin` | Installed programs (on modern systems `/bin` points here too) |
| `/opt` | Optional, third-party software |
| `/tmp` | Temporary files, often cleared on reboot |
| `/proc` | Live information about processes and the kernel, generated on the fly |
| `/dev` | Devices, such as disks |

When something goes wrong on a server, three places answer most questions: **`/etc` for configuration, `/var/log` for logs, and `/var/lib` for data.**

> Linux treats almost everything as a file: configuration, devices, even running processes (in `/proc`). That is why so much troubleshooting is just reading files.

## 4. Users, groups and permissions

### Users and groups

- Every file and every process belongs to a **user**.
- Users can belong to **groups**, which give a set of people shared access.
- **Root** (user ID 0) can do anything. That is why you use it as little as possible.
- **Service accounts** are users for programs, not people. A web server runs as its own user so that if it is hacked, the attacker only gets that user's limited access.

| Task | Command |
| --- | --- |
| Who am I, and which groups am I in? | `id` |
| Add a user | `sudo useradd -m alice` |
| Add a user to a group | `sudo usermod -aG developers alice` |
| Run one command as root | `sudo command` |
| Run a command as another user | `sudo -u alice command` |

Group changes take effect the next time that user logs in.

> Be careful which groups you add people to. For example, membership of the `docker` group effectively gives root access to the machine.

### Reading permissions

Run `ls -l` and you see lines like this:

```text
-rw-r--r-- 1 alice developers 1024 Oct  4 10:00 notes.txt
drwxr-x--- 2 alice developers 4096 Oct  4 10:00 project
```

Read the first column in four parts:

| Part | Example | Meaning |
| --- | --- | --- |
| Type | `-` or `d` | `-` is a file, `d` is a directory |
| Owner | `rw-` | What the owning user (alice) can do |
| Group | `r--` | What members of the group (developers) can do |
| Others | `r--` | What everyone else can do |

The letters mean different things for files and directories:

| Letter | On a file | On a directory |
| --- | --- | --- |
| `r` read | Read the contents | List the files inside |
| `w` write | Change the contents | Create, rename or delete files inside |
| `x` execute | Run it as a program | Enter it and reach the files inside |

### Changing permissions

Permissions are often written as numbers. Add up **r = 4, w = 2, x = 1** for each of owner, group and others:

| Number | Letters | Typical use |
| --- | --- | --- |
| `755` | `rwxr-xr-x` | Programs and directories everyone can use |
| `644` | `rw-r--r--` | Normal files everyone can read |
| `700` | `rwx------` | Private directories |
| `600` | `rw-------` | Secrets, such as private SSH keys |

```bash
chmod 644 notes.txt              # set exact permissions
chmod u+x deploy.sh              # add execute for the owner only
sudo chown alice:developers file # change owner and group
```

### SSH keys: logging in to servers safely

You reach servers over SSH. Keys are safer than passwords.

```bash
ssh-keygen -t ed25519            # create a key pair in ~/.ssh
ssh-copy-id user@server          # install your public key on the server
ssh user@server                  # log in with the key
```

- The **private key** (`~/.ssh/id_ed25519`) never leaves your machine. Permissions must be `600`, or SSH refuses to use it.
- The **public key** (`id_ed25519.pub`) is safe to share. Servers keep it in `~/.ssh/authorized_keys`.
- Never commit private keys, passwords or tokens to Git. Module 3 shows how to keep them out.

## 5. Processes and signals

### Processes

Every running program is a **process** with a number, its **PID**. Each process was started by a parent process. The very first process, PID 1, is usually **systemd**.

| Task | Command |
| --- | --- |
| List all processes | `ps aux` |
| Find a process by name | `pgrep -a nginx` |
| Live view of busy processes | `top` (or `htop` if installed) |
| Process tree | `ps -ef --forest` |

Every command finishes with an **exit code**: `0` means success and anything else means failure. Check the last one with `echo $?`. Scripts and CI pipelines rely on this.

### Signals

You stop processes by sending **signals**.

| Signal | Number | Meaning | Sent by |
| --- | --- | --- | --- |
| SIGTERM | 15 | "Please shut down cleanly" | `kill PID` (the default) |
| SIGINT | 2 | "Interrupt" | Pressing Ctrl+C |
| SIGHUP | 1 | Often "reload your configuration" | `kill -HUP PID` |
| SIGKILL | 9 | "Stop immediately". It cannot be caught. | `kill -9 PID` |

**Always try SIGTERM first.** It lets the program finish requests, save data and clean up. SIGKILL is the last resort, because the program gets no chance to clean up. This is also what systemd does: `systemctl stop` sends SIGTERM, then SIGKILL if the service has not stopped after a timeout (90 seconds by default).

## 6. Installing software with package managers

A package manager installs software, its dependencies and its updates from trusted repositories. Use it instead of downloading random files from the internet.

| Distribution family | Tool | Install example |
| --- | --- | --- |
| Debian, Ubuntu | `apt` | `sudo apt update && sudo apt install nginx` |
| RHEL, Fedora, Rocky, Amazon Linux | `dnf` (older: `yum`) | `sudo dnf install nginx` |
| Alpine (common in containers) | `apk` | `apk add nginx` |

Useful apt commands:

```bash
sudo apt update           # refresh the list of available packages (do this first)
sudo apt upgrade          # upgrade installed packages
apt search htop           # look for a package
sudo apt remove htop      # uninstall
apt list --installed      # what is installed
```

Keeping packages up to date is one of the simplest security habits.

## 7. Services with systemd

### What systemd does

**systemd** starts the system at boot and then looks after background services. It starts them in the right order, restarts them if they crash, and collects their logs.

Everything systemd manages is a **unit**. Services are units ending in `.service`.

| Task | Command |
| --- | --- |
| Is it running? Why not? | `systemctl status nginx` |
| Start or stop now | `sudo systemctl start nginx`, `sudo systemctl stop nginx` |
| Restart | `sudo systemctl restart nginx` |
| Start automatically at boot | `sudo systemctl enable nginx` |
| Enable and start in one step | `sudo systemctl enable --now nginx` |
| List failed services | `systemctl --failed` |
| Reload after editing a unit file | `sudo systemctl daemon-reload` |

`systemctl status` is the first command to run when a service misbehaves. It shows whether the service is running, since when, its PID, and its last few log lines.

### A unit file

Your own services are described in a small file in `/etc/systemd/system/`:

```ini
[Unit]
Description=Hello web service
After=network.target

[Service]
User=hello
ExecStart=/usr/bin/python3 -m http.server 8080 --directory /opt/hello
Restart=on-failure
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

| Line | What it means |
| --- | --- |
| `After=network.target` | Start after networking is up |
| `User=hello` | Run as the limited `hello` user, not root |
| `ExecStart=` | The exact command to run, with a full path |
| `Restart=on-failure` | Restart automatically if it crashes |
| `Environment=PYTHONUNBUFFERED=1` | Make Python write logs immediately, so they show up in the journal straight away |
| `WantedBy=multi-user.target` | Start it at boot when you run `enable` |

### Logs with journalctl

systemd collects everything a service prints into the **journal**. Read it with `journalctl`:

| Task | Command |
| --- | --- |
| Logs for one service | `journalctl -u nginx` |
| Only the last 50 lines | `journalctl -u nginx -n 50` |
| Follow live | `journalctl -u nginx -f` |
| A time window | `journalctl -u nginx --since "10 min ago"` |
| Only errors | `journalctl -u nginx -p err` |
| Since the last boot | `journalctl -b` |

Some programs also write their own files under `/var/log`, such as `/var/log/nginx/error.log`.

## 8. Scheduling jobs with cron

**cron** runs commands on a schedule. Edit your schedule with `crontab -e` and list it with `crontab -l`.

Each line has five time fields, then the command:

```text
┌ minute (0–59)
│ ┌ hour (0–23)
│ │ ┌ day of month (1–31)
│ │ │ ┌ month (1–12)
│ │ │ │ ┌ day of week (0–6, Sunday is 0)
│ │ │ │ │
* * * * *  command
```

| Schedule | Meaning |
| --- | --- |
| `*/5 * * * *` | Every 5 minutes |
| `0 2 * * *` | Every day at 02:00 |
| `30 9 * * 1-5` | 09:30 on weekdays |
| `@reboot` | Once, when the machine starts |

```text
0 2 * * * /home/alice/bin/backup.sh >> /home/alice/backup.log 2>&1
```

Two cron gotchas:

1. **cron runs with a minimal environment.** Always use full paths to commands and files.
2. **Output goes nowhere by default.** Redirect it to a log file, as above, so you can see what happened.

systemd **timers** are a modern alternative. They log to the journal and integrate with `systemctl`. cron is still everywhere, so you need to read both.

## 9. Inspecting a server: which tool answers which question

When a server is slow or broken, start from the question and pick the tool.

| Question | Command | What to look at |
| --- | --- | --- |
| How busy is the machine overall? | `uptime` | Load average compared with the number of CPUs (`nproc`) |
| Which process uses the CPU or memory? | `top` | Press `Shift+P` to sort by CPU, `Shift+M` by memory, `q` to quit |
| Is memory running out? | `free -h` | The **available** column, not "free" |
| Is a disk full? | `df -h` | The `Use%` column |
| Which folder is using the space? | `sudo du -sh /var/* \| sort -h` | The biggest entries at the bottom |
| What is listening on which port? | `sudo ss -tlnp` | Port number and the process that owns it |
| Who is using this port or file? | `sudo lsof -i :8080` | The process ID and name |
| What is this process actually doing? | `sudo strace -p PID` | The system calls it makes, such as files it opens |

A few notes that prevent common misreadings:

- **Load average** is the average number of processes running or waiting, over the last 1, 5 and 15 minutes. A load of 4 on a 4-CPU machine is busy but fine. A load of 20 on the same machine means work is queuing.
- **"Free" memory looks low on healthy machines.** Linux uses spare memory as a disk cache and gives it back when programs need it. Check **available** instead.
- **`ss -tlnp`** means: **t**CP, **l**istening, **n**umeric ports, show **p**rocesses.
- **strace** is powerful but slows the process down. Use it briefly when other tools have not explained the problem.

## 10. Lab: run a service under systemd, break it, and fix it using only logs

This lab builds the habit that matters most in operations: **when something breaks, read the evidence before you change anything.** You will run a tiny web service, break it in three realistic ways, and fix each one using `systemctl status`, `journalctl` and the inspection tools.

Exact error messages vary a little between versions, so look for lines similar to the ones shown.

### Step 1: create the service

```bash
# a limited user for the service, with no login shell
sudo useradd --system --no-create-home --shell /usr/sbin/nologin hello

# the content it will serve
sudo mkdir -p /opt/hello
echo "Hello from systemd" | sudo tee /opt/hello/index.html

# the unit file
sudo tee /etc/systemd/system/hello.service > /dev/null <<'EOF'
[Unit]
Description=Hello web service
After=network.target

[Service]
User=hello
ExecStart=/usr/bin/python3 -m http.server 8080 --directory /opt/hello
Restart=on-failure
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

# load it, enable it at boot, and start it now
sudo systemctl daemon-reload
sudo systemctl enable --now hello
```

### Step 2: check it works

```bash
systemctl status hello        # should say "active (running)"
curl http://localhost:8080    # should print: Hello from systemd
journalctl -u hello -n 20     # should show the request you just made
```

Take a moment to read the healthy output. Knowing what normal looks like makes broken easy to spot.

### Break 1: a wrong program path

```bash
sudo sed -i 's#/usr/bin/python3#/usr/bin/python4#' /etc/systemd/system/hello.service
sudo systemctl daemon-reload
sudo systemctl restart hello
```

**Investigate:**

```bash
systemctl status hello
journalctl -u hello -n 20
```

You will see the service has **failed**, with a line similar to:

```text
hello.service: Failed to locate executable /usr/bin/python4: No such file or directory
```

**Fix:** the log tells you exactly what is wrong. Correct the path, reload and restart:

```bash
sudo sed -i 's#/usr/bin/python4#/usr/bin/python3#' /etc/systemd/system/hello.service
sudo systemctl daemon-reload
sudo systemctl restart hello
```

**Lesson:** after editing a unit file you must run `daemon-reload`, or systemd keeps using the old version.

### Break 2: a permissions problem

```bash
sudo chmod 700 /opt/hello
curl http://localhost:8080
```

This one is sneakier. `systemctl status` still says **active (running)**, but curl returns a **404** error. The service is up, but it is not working.

**Investigate:**

```bash
journalctl -u hello -n 20          # look for the 404 and its message
sudo -u hello ls /opt/hello        # try it as the service's user
namei -l /opt/hello/index.html     # show permissions on every part of the path
```

The journal shows a `404` with a message like `No permission to list directory`. Running `ls` as the `hello` user gives **Permission denied**. `namei` shows why: `/opt/hello` is now `drwx------`, owned by root, so the `hello` user cannot enter it.

**Fix:**

```bash
sudo chmod 755 /opt/hello
curl http://localhost:8080      # works again
```

**Lesson:** "running" does not mean "working". Always test the service from the outside, and test permissions as the user the service runs as.

### Break 3: the port is already taken

Stop the service, then start another program on the same port in a second terminal:

```bash
sudo systemctl stop hello
python3 -m http.server 8080      # in a second terminal; leave it running
```

Back in the first terminal:

```bash
sudo systemctl start hello
systemctl status hello
journalctl -u hello -n 30
```

The service fails and keeps restarting. The journal shows a Python error ending in:

```text
OSError: [Errno 98] Address already in use
```

After several quick failures, systemd stops trying and reports something like `Start request repeated too quickly`.

**Investigate who holds the port:**

```bash
sudo ss -tlnp | grep 8080
sudo lsof -i :8080
```

Both show the other `python3` process and its PID.

**Fix:** stop the other program (Ctrl+C in the second terminal, or `kill PID`), then:

```bash
sudo systemctl reset-failed hello   # clear the "too many restarts" state
sudo systemctl start hello
curl http://localhost:8080
```

**Lesson:** "address already in use" means another process owns the port. `ss` and `lsof` tell you which one.

### Clean up

```bash
sudo systemctl disable --now hello
sudo rm /etc/systemd/system/hello.service
sudo systemctl daemon-reload
sudo rm -r /opt/hello
sudo userdel hello
```

### Lab write-up

For each break, write three lines in your own notes:

1. **Symptom:** what you saw first.
2. **Evidence:** the exact log line or command output that explained it.
3. **Fix:** what you changed, and how you confirmed it worked.

This symptom, evidence, fix format is the same one used in real incident reports (Module 16).

## Common pitfalls

- **Forgetting `daemon-reload`** after editing a unit file, then wondering why nothing changed.
- **Using `kill -9` first.** It skips clean shutdown and can lose or corrupt data. Use SIGTERM first.
- **Running services as root** because it is easier. If the service is compromised, the attacker gets the whole machine.
- **Fixing permissions with `chmod 777`.** It makes the error go away by giving everyone full access. Find the user that needs access and grant only that.
- **Trusting "active (running)".** Test the service from the outside, for example with curl.
- **Reading "free" memory instead of "available"** and thinking the machine is out of memory.
- **Running `rm -rf` on a path built from a variable** without checking it. If the variable is empty, the path changes completely.

## Key takeaways

1. Linux is one tree starting at `/`. Configuration lives in `/etc`, logs in `/var/log`, and data in `/var/lib`.
2. Permissions are read, write and execute, for owner, group and others. Give each user and service only what it needs.
3. Every process has a PID and an owner. Stop processes with SIGTERM before you reach for SIGKILL.
4. Install software with the package manager, and keep it updated.
5. systemd runs services: `systemctl status` shows what is happening and `journalctl -u` shows why.
6. cron schedules jobs. Use full paths and log the output.
7. Pick inspection tools by question: `top`, `free -h`, `df -h`, `ss`, `lsof` and `strace`.
8. When something breaks, **read the evidence first, then change one thing at a time.**

**Next:** Module 3 covers Git, so every lab from here on can live in a repository.

## Further reading

- *The Linux Command Line* by William Shotts: a complete beginner's book, free to read at linuxcommand.org.
- *How Linux Works* by Brian Ward: explains what happens under the hood, from boot to networking.
- Linux Journey (linuxjourney.com): short, free lessons on each topic in this module.
- Brendan Gregg's Linux performance pages (brendangregg.com): the go-to reference for performance tools such as `top`, `ss` and `strace`.
- The manual pages: `man systemd.service`, `man journalctl` and `man 5 crontab`.

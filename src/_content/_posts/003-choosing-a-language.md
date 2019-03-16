# Choosing a language

*2019-03-16*

One of the first things to think about when starting a new project is deciding what language to use. There are thousands, from the latest [V-lang](https://v-lang.io) to the decades-old C. The decision is complex one.

<img src="https://upload.wikimedia.org/wikipedia/commons/3/39/C_Hello_World_Program.png" alt="coding in c image" align="right" width="50%">

Often these languages bank on a particular feature to convince other developers to use them. For example, V banks on the tiny compiler size and the fast compile time. Unfortunately, sometimes this distracts developers from the true merits or demerits of the language. Yes, compile-time is a little important, but not *that* important.

Most of us already have some understanding about the general pros and cons of any language and what not to use them for. For example, none of us would use Batch programming for building a server, and few would want to use C++ for writing a calculator. But some of do. (I'm looking at you, Microsoft.)

Most of the time, the process of choosing a development environment can be broken up into three parts.

### 1. Consider your choices
What languages are you capable of? Make a list of all the possible languages you can this in. If the project is a non-trivial one, don't bother adding languages that you don't have any experience in. If you have been programming in imperative languages<sup>[1]</sup> all your life, you probably don't want to add F# untill you can warp your brain around functional programming and can get used to coding without loops and variables (yes, without variables).

### 2. Filter out languages
Now, decide exactly what you want. Does your project need to be fast? Try Rust, Nim, Crystal, or C. Does it need to be tiny? Crystal, Nim, C, or V will give you that. Do you need rapid development, and you don't care how slow the program itself is? Ruby, PowerShell<sup>[2]</sup>, or Python will do the job. Or do you need a happy compromise between speed, rapid development, and superb documentation? Try Go, or C#. And if you want your app to be really slick and attractive, ElectronJS with HTML, CSS, and JavaScript will do the trick. For a server-side application, you are pretty much limited to ASP.NET, PHP, Python, and NodeJS. Of course, for a web app, HTML, CSS, and JavaScript are the only choices.

### 3. Research and Choose
Of couse, its impossible to mention the pros and cons of every language. I haven't even mentioned niche languages such Swift or Objective-C. The end result of this post is this: do your own research. Its possible to write a program in a terrible language and entirely get away with it.

After narrowing down the list of languages to just three or four, at most five, research each language. Read all the rants by irate bloggers who had some bad childhood experience with those languages. Most of the time, those articles won't make any sense and will be tainted by bias, but every now and then you'll find an article that carefully explains why that language isn't good for a particular task, based on real-world experience, and not just because that guy's mom made him program in that language as a punishment when he was a kid.

Once you have enough information, it is easy to make your choice.

#### Notes
- **`[1]`**: Imperative programming works with loops andvariables - the stuff most of us are familiar with. This includes C, C++, Go, Rust, C#, VB.NET, etc. Pure functional languages, such as Scala, OCaml, Clojure, Erlang, Haskell, F# and Elixir, rely on functions, and functions alone. Loops are accomplished using recursion, and variables are more of just functions returning static values. Other languages such as JavaScript are capable of both imperative and functional programming.
- **`[2]`**: Microsoft claims that PowerShell is a 'automation and configuration tool/framework'. Other people think PowerShell is just another shell, like ZSH. However, PowerShell has many features that other shells such as Bash and Fish don't have, such as classes, libraries, modules, and advanced string manipulation. In my humble opinion, PowerShell, despite the strong resemblance to a shell, is more on par with interpreted languages such as Python.

# Russian APT Ecosystem

This repository contains the website and the tools which are part of the joint research between Check Point Research and Intezer to map the connections inside the APT Ecosystem of Russia.

### The website stored in this repository can be found in https://apt-ecosystem.com

The publication can be found on our websites:
 - [Intezer](https://www.intezer.com/blog-russian-apt-ecosystem/)
 - [Check Point Research](https://research.checkpoint.com/russianaptecosystem/)

## Connection Map

This map was created to make the results of our APT Russian Ecosystem research accesible. We recommend to read the full research in order to use this map in its full context.

The russian APT map is a web-based, interactive map that shows the different families and actors that are part of the Russian APT ecosystem, as well as the connections between them. The map is basically a one stop shop for anyone who is interested to learn and understand the connections and attributions of the samples, modules, families and actors that together are building this ecosystem.

The map in intuitive and rich with information. The user can get a full overview of the ecosystem or drill down into specific connections. By clicking on nodes in the graph, a side panel will reveal, containing information about the malware family the node belongs to, as well as links to analysis reports on Intezer’s platform and external links to related articles and publications. Basically, this side-panel is a short identity-card of the entities in the map.

The map and its data are open source in this repository and we are inviting you all to add more information and improve it.


## Russian APT Detector

Having access to more than 3.5 Million pieces of code that were shared between the Russian APT samples we gathered, allowed us to understand which unique genes are popular and more likely to be shared between samples, families, and actors. We used this knowledge to write a tool that can be used by organizations, CERT teams, researchers, and individuals to scan a specific file, a folder, or a whole file system, and search for infections by Russian APTs.

The tool, which we named Russian APT Detector, is a set of Yara rules produced by Intezer’s platform. The rules contain byte-sequences of popular mutual code between one or more samples. We then wrapped it up in a binary to ease the use of the tool. The full ruleset can be found in this repository, and can be used freely using your favorite Yara scanner. Don’t hesitate to integrate this ruleset into your platform and toolset.

### Download
The tool can be downloaded as a Windows Executable from our [Releases](https://github.com/itayc0hen/apt-ecosystem/releases) page. The tool is a python script, wrapped into an executable along with the Yara ruleset and the Yara binaries.

Alternatively, you can use `detector.py` along with the ruleset which are available in this repository. 

### Usage

You can use the APT Detector tool by executing `Detector.exe` with the argument described below.

```
Russian APT Detector
---------------------

usage: Detector.exe [-h] -t TARGET [TARGET ...] [-r]
Detector.exe: error: argument -t/--target is required
```

Example: `C:\> Detector.exe -t C:\some_directory -r`



## Contributing
Pull requests are welcome. We invite you to improve the connection-map and the Pyhton or the Yara rules of the detector tool


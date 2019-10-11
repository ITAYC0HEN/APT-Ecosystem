#!/usr/bin/env python3

import os
import argparse
from time import sleep
import shlex
import subprocess
import crayons
import platform


b = crayons.blue
r = crayons.red
w = crayons.white

logo = [
b("                             .///.                               ")+r("                                                      (((((((((((((((((((((                "),
b("                          .////////.                             ")+r("                                                      (((((((((((((((((((((                "),
b("                     ,/////*  ,.  */////.                        ")+r("                                                      (((((((((((((((((((((                "),
b("                  .  *////*  ,//.  /////,  .                     ")+r("                                                      (((((((((((((((((((((                "),
b("                  *###,,  *////////,  (####.                     ")+r("                                                      (((((((((((((((((((((                "),
b("                  *##### ###*   .(### #####.                     ")+r("                                                      (((((((((((((((((((((                "),
b("                  *##### ##### ###### #####.                     ")+w("    &@@@@@@@@&      @@&&@@@@@@@@                @@@.  ")+r("((((((")+w("@@@&@@@@@@@&")+r("(((")+w("  (@@@          "),
b("                    /### ##### ###### ####/                      ")+w("  @@@/      &@      @@@@      @@@*           %@@@/    ")+r("((((((")+w("@@@@")+r("(((((((((((")+w("    (@@@*       "),
b("                  *####.  *(## ###..                             ")+w(" /@@.               @@@        @@@         &@@@,      ")+r("((((((")+w("@@@")+r("((((((((((((")+w("      *@@@&     "),
b("                  *##### ###.. ..####                            ")+w(" @@&                @@&        %@@      ,@@@&         ")+r("((((((")+w("@@@")+r("((((((((((((")+w("         @@@@,  "),
b("                  *##### ##### ######                            ")+w(" @@%                @@&        %@@     &@@@           ")+r("((((((")+w("@@@")+r("((((((((((((")+w("           @@@& "),
b("                     *## ##### ######                            ")+w(" @@@                @@@        &@@       *@@@(        ")+r("((((((")+w("@@@")+r("((((((((((((")+w("        %@@@*   "),
b("                          *### ####,                             ")+w(" .@@#               @@@        @@@         ,@@@@      ")+r("((((((")+w("@@@")+r("((((((((((((")+w("      &@@@.     "),
b("                                                                 ")+w("  ,@@@#    &@@#     @@@@&    &@@@             &@@@*   ")+r("((((((")+w("@@@")+r("((((((((((((")+w("   *@@@%        "),
w(" @,  @@     %@ %%%%%%%%% %%%%%%%  %%%%%%%%  %%%%%%%  %%%%%%      ")+w("     &@@@@@@#       @@& %@@@@@@                 *@&   ")+r("((((((")+w("@@@")+r("((((((((((((")+w("   &@           "),
w(".@/  @@@,   %@    /@.    @%            #@*  @%       #@   #@,    ")+w("                    @@&                               ")+r("(((((((((((((((((((((                "),
w(".@/  @&,@&  %@    /@.    @%,,,,      ,@%    @&,,,,   #@  #@      ")+w("                    @@&                               ")+r("(((((((((((((((((((((                "),
w(".@*  @&  &@,%@    /@.    @%****     &&      @&****   #@@@@@%     ")+w("                    @@&                               ")+r("(((((((((((((((((((((                "),
w(".@/  @&   ,@@@    /@.    @%       #@*       @%       #@   /@,    ")+w("                    @@&                               ")+r("(((((((((((((((((((((                "),
w(".%*  %%     %%    *%     %%%%%%% *%%%%%%%%  %%%%%%%. (%    .%(   ")+w("                    @@&                               ")+r("(((((((((((((((((((((                "),
"\n\n"
]
logo = '\n'.join(logo)
logo += """
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

Russian APT Detector
Read more at: https://apt-ecosystem.com

"""

def is_os_64bit():
    return platform.machine().endswith('64')

def is_windows():
    return platform.system().endswith('Windows')

def is_osx():
    return platform.system().endswith('Darwin')

def is_linux():
    return platform.system().endswith('Linux')

# Change modes if powershell for flashy logo
if is_windows():
    os.system("mode 160,50")
    os.system('powershell -command "&{$H=get-host;$W=$H.ui.rawui;$B=$W.buffersize;$B.width=160;$B.height=9001;$W.buffersize=$B;}"')

print(logo)

parser = argparse.ArgumentParser()
parser.add_argument("-t", "--target", help="Directory to scan", required=True, nargs='+')
parser.add_argument("-r", "--recursive", help="Scan files in directories recursively", action="store_true")
args = parser.parse_args()
target = ' '.join(args.target)
if target.endswith('\\') and not target.endswith('\\\\'):
    target += '\\'
target = '"' + target + '"'

if is_windows():
    if is_os_64bit():
        yara_cmd = ["yara64.exe"]
    else:
        yara_cmd = ["yara32.exe"]
elif is_linux() or is_osx():
    # Assume it is installed and on path
    print("[+] OSX / Linux detected, checking 'yara' on path...")
    # shutil contains 'which'
    import shutil
    yara_path = shutil.which('yara')
    if yara_path==None:
        print("[+] Aborting. 'yara' not detected on path.")
        print("[+] Check https://yara.readthedocs.io/en/latest/ for installation instructions.")
        print("[+] (or try 'brew install yara', 'sudo apt install yara', 'sudo pacman -S yara' etc)")
        sys.exit()
    # Succeeded with check.
    print("[+] 'yara' found. Proceeeding with '" + yara_path + "'")
    yara_cmd = ["yara"]

yara_cmd.extend(["--no-warnings", "--fast-scan", "-p", str(os.cpu_count())])
if args.recursive:
    yara_cmd.append("-r")
yara_cmd.extend(["./rules.yar", target])

print("[+] Beginning YARA scan...")
print("[+] You may ignore file-specific errors")
os.system(" ".join(yara_cmd))
print("\n[+] Done!")



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

if is_os_64bit():
    yara_cmd = ["yara64.exe"]
else:
    yara_cmd = ["yara32.exe"]

yara_cmd.extend(["--no-warnings", "--fast-scan", "-p", "24"])
if args.recursive:
    yara_cmd.append("-r")
yara_cmd.extend(["./rules.yar", target])

print("[+] Beginning YARA scan...")
print("[+] You may ignore file-specific errors")
os.system(" ".join(yara_cmd))
print("\n[+] Done!")



'use client';

import { useEffect, useState, useRef } from "react";

import Prism from "prismjs";

// Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";

// Themes
import "./darkPlusPrismTheme.css";

import TypeIt from "typeit-react";
import styles from './terminal.module.css';

const initialMessage = String.raw`BIOS:
  POST: All devices are functional
  Booting from Hard Drive...
  GRUB Loading kernel...

Linux Boot:
  Loading Linux 5.4.0-66-generic ...
  Loading initial ramdisk ...

[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
[    0.000000] Linux version 5.4.0-66-generic (buildd@lcy01-amd64-029) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #74-Ubuntu SMP

[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.4.0-66-generic root=UUID=0a3407de-e4a6-4b17-97c1-1a7dc718c3db ro quiet splash
[    0.000000] KERNEL supported cpus:
[    0.000000] MDS: Vulnerable: Clear CPU buffers attempted, no microcode
[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'

[    5.618647] systemd[1]: systemd 237 running in system mode. (+PAM +AUDIT +SELINUX +IMA +APPARMOR +SMACK +SYSVINIT +UTMP +LIBCRYPTSETUP +GCRYPT +GNUTLS +ACL +XZ +LZ4 +SECCOMP +BLKID +ELFUTILS +KMOD -IDN2 +IDN -PCRE2 default-hierarchy=hybrid)
[    5.635746] systemd[1]: Detected architecture x86-64.

[    5.65897] systemd[1]: Set hostname to <ubuntu>.
[    5.87500] systemd[1]: Listening on udev Control Socket.
[    5.88554] systemd[1]: Started Dispatch Password Requests to Console Directory Watch.

[    7.11234] systemd[1]: Starting Network Service...
[    7.31384] systemd[1]: Started Network Service.
[    8.04193] systemd[1]: Starting Network Manager...
[    8.09334] systemd[1]: Started Network Manager.

[   10.06431] systemd[1]: Reached target Graphical Interface.
[   10.08185] systemd[1]: Starting Update UTMP about System Runlevel Changes...
[   10.09978] systemd[1]: Started Update UTMP about System Runlevel Changes.
[   10.11685] systemd[1]: Startup finished in 3.842s (kernel) + 6.229s (userspace) = 10.071s.

====================================================================================================

/ $$$$$$$  /$$                                      / $$$$$$
| $$__  $$|__/                                     / $$__  $$
| $$  \ $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$       | $$  \__/  /$$$$$$  /$$$$$$  /$$    /$$ /$$$$$$ 
| $$  | $$| $$ /$$__  $$ /$$__  $$ /$$__  $$      | $$       /$$__  $$|____  $$|  $$  /$$/|____  $$
| $$  | $$| $$| $$  \ $$| $$  \ $$| $$  \ $$      | $$      | $$  \__/ /$$$$$$$ \  $$/$$/  /$$$$$$$
| $$  | $$| $$| $$  | $$| $$  | $$| $$  | $$      | $$    $$| $$      /$$__  $$  \  $$$/  /$$__  $$
| $$$$$$$/| $$|  $$$$$$/|  $$$$$$$|  $$$$$$/      |  $$$$$$/| $$     |  $$$$$$$   \  $/  |  $$$$$$$
|_______/ |__/ \______/  \____  $$ \______/        \______/ |__/      \_______/    \_/    \_______/
                         /$$  \ $$
                        |  $$$$$$/
                         \______/
                                     / $$$$$$   /$$$$$$
                                    / $$__  $$ /$$__  $$
                                    | $$  \ $$| $$  \__/
                                    | $$  | $$|  $$$$$$
                                    | $$  | $$ \____  $$
                                    | $$  | $$ /$$  \ $$
                                    |  $$$$$$/|  $$$$$$/
                                    \______/  \______/

====================================================================================================`;

const messages = initialMessage.split('\r\n');
for(let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if(message.length > 100){
        messages[i] = message.substring(0, 100);
        messages.splice(i + 1, 0, message.substring(100));
    }
}

export default function Terminal({ background = false }) {
    const tabRef = useRef();
    const [instance, setInstance] = useState();
    return (
        <div className={styles.container}>
            <div ref={tabRef} className={styles.tab}>
                <button>x</button>
            </div>
            <div className={styles.terminalContainer}>
                <TypeIt
                    className={styles.terminal}
                    as="pre"
                    options={{
                        cursorChar: "_",
                        speed: 1,
                        nextStringDelay: 0,
                        // loop: true,
                        // lifeLike: true,
                        // deleteSpeed: 100,
                        // html: true
                    }}
                    getBeforeInit={(instance) => {
                        messages.forEach((m) => {
                            instance.type(m);
                            instance.break();
                        })
                        setInstance(instance);
                        return instance;
                    }}
                />
            </div>
        </div>
    );
}


// /$$$$$$$  /$$                                      /$$$$$$                                        
// | $$__  $$|__/                                     /$$__  $$                                       
// | $$  \ $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$       | $$  \__/  /$$$$$$  /$$$$$$  /$$    /$$ /$$$$$$ 
// | $$  | $$| $$ /$$__  $$ /$$__  $$ /$$__  $$      | $$       /$$__  $$|____  $$|  $$  /$$/|____  $$
// | $$  | $$| $$| $$  \ $$| $$  \ $$| $$  \ $$      | $$      | $$  \__/ /$$$$$$$ \  $$/$$/  /$$$$$$$
// | $$  | $$| $$| $$  | $$| $$  | $$| $$  | $$      | $$    $$| $$      /$$__  $$  \  $$$/  /$$__  $$
// | $$$$$$$/| $$|  $$$$$$/|  $$$$$$$|  $$$$$$/      |  $$$$$$/| $$     |  $$$$$$$   \  $/  |  $$$$$$$
// |_______/ |__/ \______/  \____  $$ \______/        \______/ |__/      \_______/    \_/    \_______/
//                          /$$  \ $$                                                                 
//                         |  $$$$$$/                                                                 
//                          \______/                                                                  
//                                     /$$$$$$   /$$$$$$                                      
//                                     /$$__  $$ /$$__  $$                                     
//                                     | $$  \ $$| $$  \__/                                     
//                                     | $$  | $$|  $$$$$$                                      
//                                     | $$  | $$ \____  $$                                     
//                                     | $$  | $$ /$$  \ $$                                     
//                                     |  $$$$$$/|  $$$$$$/                                     
//                                     \______/  \______/                                      
                                                          




// ________  .__                       _________                             
// \______ \ |__| ____   ____   ____   \_   ___ \____________ ___  _______   
//  |    |  \|  |/  _ \ / ___\ /  _ \  /    \  \/\_  __ \__  \\  \/ /\__  \  
//  |    `   \  (  <_> ) /_/  >  <_> ) \     \____|  | \// __ \\   /  / __ \_
// /_______  /__|\____/\___  / \____/   \______  /|__|  (____  /\_/  (____  /
//          \/         /_____/                  \/            \/           \/ 
//                      ________    _________                                              
//                      \_____  \  /   _____/                                              
//                          /   |   \ \_____  \                                               
//                         /    |    \/        \                                              
//                         \_______  /_______  /                                              
//                                 \/        \/                                               

                                                                                                   

// ______   __                       _______                        
// |   _  \ |__.-----.-----.-----.   |   _   .----.---.-.--.--.---.-.
// |.  |   \|  |  _  |  _  |  _  |   |.  1___|   _|  _  |  |  |  _  |
// |.  |    |__|_____|___  |_____|   |.  |___|__| |___._|\___/|___._|
// |:  1    /        |_____|         |:  1   |                       
// |::.. . /                         |::.. . |                       
// `------'                          `-------'                       
//                       _______ _______                             
//                      |   _   |   _   |                            
//                      |.  |   |   1___|                            
//                      |.  |   |____   |                            
//                      |:  1   |:  1   |                            
//                      |::.. . |::.. . |                            
//                      `-------`-------'                            
                                                                  

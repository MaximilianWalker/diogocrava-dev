'use client';

import { useEffect, useState } from "react";

import Prism from "prismjs";

// Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";

// Themes
import "./darkPlusPrismTheme.css";

import TypeIt from "typeit-react";
import styles from './terminal.module.css';

const initialMessage = String.raw`
<pre>
BIOS:
  POST: All devices are functional
  Booting from Hard Drive...
  GRUB Loading kernel...

Linux Boot:
  Loading Linux 5.4.0-66-generic ...
  Loading initial ramdisk ...

[    0.000000] Initializing cgroup subsys cpuset
[    0.000000] Initializing cgroup subsys cpu
[    0.000000] Linux version 5.4.0-66-generic (buildd@lcy01-amd64-029) (gcc version 7.5.0 (Ubuntu 7.5.0-3ubuntu1~18.04)) #74-Ubuntu SMP

... (a lot of hardware and kernel initialization messages) ...

[    5.618647] systemd[1]: systemd 237 running in system mode. (+PAM +AUDIT +SELINUX +IMA +APPARMOR +SMACK +SYSVINIT +UTMP +LIBCRYPTSETUP +GCRYPT +GNUTLS +ACL +XZ +LZ4 +SECCOMP +BLKID +ELFUTILS +KMOD -IDN2 +IDN -PCRE2 default-hierarchy=hybrid)
[    5.635746] systemd[1]: Detected architecture x86-64.

... (systemd service startup messages) ...

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

====================================================================================================
</pre>
`;

const messages = initialMessage.split('\n');
for(let m of messages) console.log(m);

export default function Terminal({  }) {
    const [instance, setInstance] = useState();
    return (
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
                    html: true
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
                                                                  

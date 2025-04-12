import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import YAML from 'yaml';
import { execute } from './non-streamed-command';

// Promisify the readFile, writeFile, and exec functions
const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

// Define the NetplanConfig type based on the structure of your netplan YAML configuration
interface NetplanConfig {
  network: {
    ethernets: {
      [interfaceName: string]: {   // Use dynamic interface name as key
        dhcp4: boolean;
        addresses: string[];
        gateway4: string;
        nameservers: {
          addresses: string[];
        };
      };
    };
    version: number;
  };
}

export const updateNetplanIP = async (newIP: string, newMask: string, dns: string, gateway: string): Promise<void> => {
  const netplanFilePath = '/etc/netplan/00-installer-config.yaml'; // Adjust if necessary
  const netplanBackupFilePath = '/etc/netplan/00-installer-config.yaml.bak';

  // Wrap this code in an async function
  const getInterfaceName = async (): Promise<string> => {
    const interfaceNameRaw = await execute(
      "ip -o link show | awk -F': ' '{print $2}' | grep -v -E 'lo|docker|veth' | head -n 1",
      'terminal'
    );
    return interfaceNameRaw.trim();
  };

  const interfaceName = await getInterfaceName(); // Get the interface name using the async function

  // Read the existing netplan configuration
  const netplanConfig = await readFilePromise(netplanFilePath, 'utf8');
  const netplanData: NetplanConfig = YAML.parse(netplanConfig);

  const currentIP = await execute(`ip addr show ${interfaceName} | grep 'inet ' | awk '{print $2}' | cut -d/ -f1`, 'terminal');    

  // Backup the existing netplan configuration
  await writeFilePromise(netplanBackupFilePath, netplanConfig);

  // Update the IP and mask for the specified interface
  netplanData.network.ethernets[interfaceName].dhcp4 = false;
  netplanData.network.ethernets[interfaceName].addresses = [`${newIP}/${newMask}`];

  // Ensure dns is treated as an array
  if (typeof dns === 'string') {
    netplanData.network.ethernets[interfaceName].nameservers.addresses = dns.split(',').map(ip => ip.trim());
  } else {
    netplanData.network.ethernets[interfaceName].nameservers.addresses = dns;
  }

  netplanData.network.ethernets[interfaceName].gateway4 = `${gateway}`;

  // Write the modified configuration back to the file
  const updatedNetplanConfig = YAML.stringify(netplanData);
  await writeFilePromise(netplanFilePath, updatedNetplanConfig);

  console.log(newIP);
  console.log(currentIP);

  // Apply the changes
  await execute(
    `nohup bash /home/zeuor/scripts/changeEnvIP.sh "${currentIP.trim()}" "${newIP}" /var/www > /dev/null 2>&1 &`,
    'terminal'
  );
};

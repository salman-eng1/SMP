import { execute } from "@portal/services/non-streamed-command";

export const getPorts = async (systemName: string): Promise<string[]> => {
  const systemPath = `/var/www/${systemName}`;
  const envFilesString: string = await execute(
    `find ${systemPath} -type f -name '.env'`, 
    ''
  );
  const envFiles: string[] = envFilesString.split('\n').filter(Boolean); // Filter out empty strings

  const ports: string[] = await Promise.all(
    envFiles.map(async (envFile) => {
      // Check if the envFile path matches the specific condition
      if (envFile === '/var/www/QMS/ems/.env') {
        return '80';
      }
      const port: string = await execute(
        `grep -E '^APP_URL=' ${envFile} | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
        ''
      );
      return port.trim();
    })
  );

  return ports as string[];
}


  const alwaysPresentPorts = ['80', '443', '5500', '8099'];

  export const resetPortsToAlwaysPresent = async (): Promise<void> => {
    const deleteCommand = `sudo sed -i '/^Listen/d' /etc/apache2/ports.conf`;
    await execute(deleteCommand, '');
    for (const port of alwaysPresentPorts) {
      await execute(`echo "Listen ${port}" >> /etc/apache2/ports.conf`, '');
    }
  };

  export const deletePorts = async (): Promise<string> => {
    await resetPortsToAlwaysPresent();
    return 'ports reset to always-present successfully';
  }

  export const deleteProjectPorts = async (systemName: string): Promise<string> => {
    const ports: string[] = await getPorts(systemName);
    await Promise.all(
        ports.map(async (port) => {
            if (port === '80' || port === '443') return; // Skip critical ports
            const deleteCommand = `sudo sed -i '/^Listen ${port}/d' /etc/apache2/ports.conf`;
            await execute(deleteCommand, '');
        })
    );
    return 'Project-specific ports deleted successfully.';
}




export const addPorts = async (systemName: string): Promise<string[]> => {
  const ports: string[] = await getPorts(systemName);

  const filteredPorts = ports.filter(port => port !== "80" && port !== "443");

  const addedPorts: string[] = await Promise.all(
    filteredPorts.map(async (port) => {
      const addCommand = `grep -q "Listen ${port}" /etc/apache2/ports.conf || echo "Listen ${port}" >> /etc/apache2/ports.conf`;
      await execute(addCommand, '');
      return port;
    })
  );

  // Return the list of added ports
  return addedPorts;
};

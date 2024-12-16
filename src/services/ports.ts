import { execute } from "@portal/services/non-streamed-command";

// export const getPorts = async (systemName: string): Promise<string[]> => {
//   const systemPath = `/var/www/${systemName}`;
//   const envFilesString: string = await execute(
//     `find ${systemPath} -type f -name '.env'`, 
//     ''
//   );
//   const envFiles: string[] = envFilesString.split('\n').filter(Boolean); // Filter out empty strings

//   const ports: string[] = await Promise.all(
//     envFiles.map(async (envFile) => {
//       // Check if the envFile path matches the specific condition
//       if (envFile === '/var/www/QMS/ems/.env') {
//         return '80';
//       }
//       const port: string = await execute(
//         `grep -E '^APP_URL=' ${envFile} | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
//         ''
//       );
//       return port.trim();
//     })
//   );
//   return ports as string[];
// }

export const getPorts = async (systemName: string): Promise<string[]> => {
  const systemPath = `/var/www/${systemName}`;
  const envFilesString: string = await execute(
    `find ${systemPath} -type f -name '.env'`, 
    ''
  );
  const envFiles: string[] = envFilesString.split('\n').filter(Boolean); // Filter out empty strings

  const ports: string[] = await Promise.all(
    envFiles.map(async (envFile) => {
      if (envFile === '/var/www/QMS/ems/.env') {
console.log('80')
      }

      const port: string = await execute(
        `grep -E '^APP_URL=' ${envFile} | awk -F '=' '{print $2}' | sed -n 's/.*:\\([0-9]\\+\\).*/\\1/p'`, 
        ''
      );

      // Ensure only valid, numeric ports are included
      if (!port.trim().match(/^\d+$/)) {
        console.warn(`Invalid port found in ${envFile}: ${port.trim()}`);
        return ''; // Return an empty string for invalid ports
      }

      return port.trim();
    })
  );

  // Filter out invalid (empty) ports
  return ports.filter(Boolean);
};

  export const deletePorts = async (): Promise<string> => {


        const deleteCommand = `sudo sed -i '/^Listen/d' /etc/apache2/ports.conf`;
          await execute(deleteCommand, '');

    return 'ports deleted successfully';
  }

  export const deleteProjectPorts = async (systemName: string): Promise<string> => {
    const ports: string[] = await getPorts(systemName);
    for (const port of ports) {
      const deleteCommand = `sudo sed -i '/^Listen ${port}/d' /etc/apache2/ports.conf`;
      await execute(deleteCommand, '');

    }
  
    return 'ports deleted successfully';
  };
  
  export const addPorts = async (systemName: string): Promise<string[]> => {
    const ports: string[] = await getPorts(systemName);
    const addedPorts: string[] = await Promise.all(
      ports.map(async (port) => {
        const addCommand = `echo 'Listen ${port}' >> /etc/apache2/ports.conf && sed -i '/^Listen[^0-9]*$/d' /etc/apache2/ports.conf        `;
        await execute(addCommand, '');
          return port;
      })
    );
    return addedPorts;
  }
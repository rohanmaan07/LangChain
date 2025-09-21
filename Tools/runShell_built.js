import { exec } from "child_process";

async function runShellCommand() {
  const command = "ls"
  console.log(`Running command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error.message);
      return;
    }
    if (stderr) {
      console.error("Stderr:", stderr);
      return;
    }
    console.log("--- Command Output ---",stdout);
  });
}

runShellCommand();

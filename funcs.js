const cliOutput = document.getElementById('cliOutput');
const cliInput = document.getElementById('cliInput');

function cliPrint(text) {
  cliOutput.innerText += text + '\n';
  cliOutput.scrollTop = cliOutput.scrollHeight;
}

const commands = {
  help: {
    description: 'Show this help',
    usage: 'help',
    async execute() {
      cliPrint('Available commands:');
      for (const [cmd, info] of Object.entries(commands)) {
        cliPrint(`  ${cmd}${info.usage ? ' ' + info.usage : ''} - ${info.description}`);
      }
    },
  },

  signup: {
    description: 'Register a new user',
    usage: '<email> <password>',
    minArgs: 2,
    async execute(email, password) {
      if (!serverComms) {
        cliPrint('Servers are down. Cannot sign up.');
        return;
      }
      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const number = Math.floor(100000000 + Math.random() * 900000000).toString();
        currentUserNumber = number;
        await db.collection('users').doc(cred.user.uid).set({ email, number });
        cliPrint(`Sign up successful. Your number: ${number}`);
      } catch (err) {
        cliPrint(`SignUp error: ${err.message}`);
      }
    },
  },

  signin: {
    description: 'Sign in',
    usage: '<email> <password>',
    minArgs: 2,
    async execute(email, password) {
      if (!serverComms) {
        cliPrint('Servers are down. Cannot sign in.');
        return;
      }
      try {
        await auth.signInWithEmailAndPassword(email, password);
        cliPrint('Sign in successful.');
      } catch (err) {
        cliPrint(`SignIn error: ${err.message}`);
      }
    },
  },

  send: {
    description: 'Send message',
    usage: '<toNumber> <message>',
    minArgs: 2,
    async execute(to, ...messageParts) {
      if (!serverComms) {
        cliPrint('Servers are down. Cannot send message.');
        return;
      }
      if (!currentUserNumber) {
        cliPrint('Your phone number is not available.');
        return;
      }
      const message = messageParts.join(' ');
      try {
        await db.collection('messages').add({
          from: currentUserNumber,
          to,
          message,
          timestamp: Date.now(),
        });
        cliPrint(`Message sent to ${to}`);
      } catch (err) {
        cliPrint(`SendMessage error: ${err.message}`);
      }
    },
  },

  call: {
    description: 'Make a call',
    usage: '<toNumber>',
    minArgs: 1,
    async execute(to) {
      if (!serverComms) {
        cliPrint('Servers are down. Cannot make call.');
        return;
      }
      if (!currentUserNumber) {
        cliPrint('Your phone number is not available.');
        return;
      }
      try {
        await db.collection('calls').add({
          from: currentUserNumber,
          to,
          status: 'ringing',
          timestamp: Date.now(),
        });
        cliPrint(`Call initiated to ${to}`);
      } catch (err) {
        cliPrint(`MakeCall error: ${err.message}`);
      }
    },
  },

  status: {
    description: 'Show server status',
    usage: '',
    async execute() {
      cliPrint(`Server status: ${serverComms ? 'Online' : 'Offline'}`);
    },
  },

  clear: {
    description: 'Clear CLI output',
    usage: '',
    async execute() {
      cliOutput.innerText = '';
    },
  },
};

async function handleCommand(commandLine) {
  const parts = commandLine.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  if (!cmd) return;

  const command = commands[cmd];
  if (!command) {
    cliPrint(`Unknown command: ${cmd}. Type 'help' for commands.`);
    return;
  }

  if (command.minArgs && args.length < command.minArgs) {
    cliPrint(`Usage: ${cmd} ${command.usage}`);
    return;
  }

  try {
    await command.execute(...args);
  } catch (err) {
    cliPrint(`Error executing command '${cmd}': ${err.message || err}`);
  }
}

cliInput.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    const input = cliInput.value;
    cliPrint(`> ${input}`);
    cliInput.value = '';
    await handleCommand(input);
  }
});

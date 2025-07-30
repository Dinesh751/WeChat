const fs = require('fs');
const path = require('path');

// Ensure logs directory exists recursively
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const logsDir = path.join(__dirname, '../../logs');
ensureDirectoryExists(logsDir);

// Get log file paths for the current day
const getLogFilePaths = () => {
  const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  return {
    combinedLog: path.join(logsDir, `${date}-combined.log`),
    errorLog: path.join(logsDir, `${date}-error.log`),
  };
};

// Format log messages
const formatLogMessage = (type, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
  return `${timestamp} | ${type.toUpperCase()} | ${message}${metaString}\n`;
};

// Logger object with info and error methods
const logger = {
  info: (message, meta = {}) => {
    const logMessage = formatLogMessage('info', message, meta);
    const { combinedLog } = getLogFilePaths();

    // Append log message to the combined log file
    fs.appendFileSync(combinedLog, logMessage);
    console.log(logMessage.trim());
  },

  error: (message, meta = {}) => {
    const logMessage = formatLogMessage('error', message, meta);
    const { errorLog, combinedLog } = getLogFilePaths();

    // Append error message to both error log and combined log files
    fs.appendFileSync(errorLog, logMessage);
    fs.appendFileSync(combinedLog, logMessage);
    console.error(logMessage.trim());
  },

  middleware: (req, res, next) => {
    const logMessage = formatLogMessage('info', `${req.method} ${req.url}`, { ip: req.ip });
    const { combinedLog } = getLogFilePaths();

    // Append log message to the combined log file
    fs.appendFileSync(combinedLog, logMessage);
    console.log(logMessage.trim());
    next();
  },
};


module.exports = { logger };
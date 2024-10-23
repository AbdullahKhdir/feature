module.exports = {
	apps: [
		{
			script: "./dist/Server.js",
			name: "Server",
			exec_mode: "cluster",
			instances: "max",
			ignore_watch: ["dist/core/middlewares/access.log", "logs/*"], // Ignore log files
			// out_file: "/root/.pm2/logs/server-out.log",
			// error_file: "/root/.pm2/logs/server-error.log",
			log_date_format: "YYYY-MM-DD HH:mm:ss",
			watch: false
		},
		{
			script: "worker.js",
			name: "worker",
			exec_mode: "fork",
			instances: "max"
		}
	]
};

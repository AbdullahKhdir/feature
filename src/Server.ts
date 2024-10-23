"use strict";

// import https from "https";
// import http2 from "http2";
import http from "http";
import cluster from "cluster";
import OS from "os";
import { NextFunction, Request, Response } from "express";
import { ENDPOINTS } from "./core/api/apis_endpoints/endpoints";
import * as config from "./core/config";
import { Singleton } from "./core/Singleton/Singleton";
import { csrf } from "./core/utils/undefined-routes-logic";
import ApiError from "./core/error/ApiError";

/**
 * @class Server
 * @constructor
 * @extends Application
 * @description Class Server is used to initiate the whole application and open a socket to serve the application
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export class Server {
	private static server_instance: Server;
	public app;
	public constants;
	public _;
	private constructor() {
		this.app = Singleton.getExpressApp();
		this.constants = Singleton.getConstants();
		this._ = Singleton.getLodash();
		process.env["UV_THREADPOOL_SIZE"] = OS.cpus().length.toString();
	}

	static getServerInstance() {
		if (this.server_instance) {
			return this.server_instance;
		}

		return (this.server_instance = new Server());
	}

	run() {
		// if (cluster.isPrimary) {
		// 	const numCPUs = OS.cpus().length;
		// 	console.log(
		// 		`${this.constants.COLORS.FgGreen} Master ${process.pid} is running!${this.constants.COLORS.Reset}`
		// 	);

		// 	//? Fork workers (one per CPU core)
		// 	for (let i = 0; i < numCPUs; i++) {
		// 		cluster.fork();
		// 	}

		// 	//? Listen for dying workers and replace them
		// 	cluster.on("exit", (worker, code, signal) => {
		// 		console.log(
		// 			`${this.constants.COLORS.FgGreen}Worker ${worker.process.pid} died. Forking a new one...${this.constants.COLORS.Reset}`
		// 		);
		// 		cluster.fork();
		// 	});

		// 	// //? Graceful shutdown on SIGINT (Ctrl + C)
		// 	process.on("SIGINT", () => {
		// 		console.warn(
		// 			`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}SIGINT received. Closing all workers...${this.constants.COLORS.Reset}`
		// 		);
		// 		for (const id in cluster.workers) {
		// 			cluster.workers[id]?.send("shutdown");
		// 			cluster.workers[id]?.disconnect();
		// 		}

		// 		//? Allow time for workers to clean up
		// 		setTimeout(() => process.exit(0), 5000);
		// 	});

		// 	// //? Add error handling for unhandled errors
		// 	process.on("uncaughtException", (err) => {
		// 		console.error(
		// 			`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}Unhandled exception in master process:${this.constants.COLORS.Reset}`,
		// 			err
		// 		);
		// 	});

		// 	process.on("unhandledRejection", (err) => {
		// 		console.error(
		// 			`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}Unhandled promise rejection in master process:${this.constants.COLORS.Reset}`,
		// 			err
		// 		);
		// 	});
		// } else {
		// }
		//? Worker process runs the server
		(async () => {
			await this.setupWorker();
		})();
	}

	port(): number | string {
		return config.configurations().server_port || this.constants.PORTS.SERVER_PORT;
	}

	async setupWorker() {
		if (config.configurations().environment === "development") {
			/*
			!  DO NOT USE THIS IN PRODUCTION ENVIRONMENT
			* ONLY FOR DEVELOPMENT PURPOSES
			*/
			const mkcert = require("mkcert");
			// create a certificate authority
			const ca = await mkcert.createCA({
				organization: "Node",
				countryCode: "DE",
				state: "Bavaria",
				locality: "Nuremberg",
				validityDays: 1
			});

			// then create a tls certificate
			// const cert = await mkcert.createCert({
			// 	domains: ["127.0.0.1", "test"],
			// 	validityDays: 1,
			// 	caKey: ca.key,
			// 	caCert: ca.cert
			// });
			// const httpsOptions = { key: cert.key, cert: cert.cert };
			// const httpsOptions = {
			// 	key: fs.readFileSync(__dirname + "/certificates/example.cert.key"),
			// 	cert: fs.readFileSync(__dirname + "/certificates/example.cert.pem")
			// };
			let port = Server.getServerInstance().port();
			//****************************************************************************************************\\
			//* Will be triggered only on errors or next(new Error('error message')) or next({error: 'message'}) *\\
			//****************************************************************************************************\\
			this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
				if (error.code === this.constants.CSRF.errCode) {
					return res
						.status(this.constants.HTTPS_STATUS.CLIENT_ERRORS.FORBIDDEN)
						.render("undefined_routes", csrf(res));
				}

				const _status = error.statusCode || this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
				const message = error.message;
				var is_api_endpoint = false;

				if (ENDPOINTS.length > 0) {
					ENDPOINTS.forEach((endpoint: any) => {
						if (
							ENDPOINTS.includes(req.headers.referer || "") ||
							ENDPOINTS.includes(req.originalUrl || "") ||
							ENDPOINTS.includes(req.url || "")
						) {
							is_api_endpoint = true;
						}
					});
				}

				if (is_api_endpoint) {
					return res.status(_status).json({ message: message });
				} else {
					if (error) {
						if (Object.keys("statusCode")) {
							// req.origin = req.headers.origin || req.get('origin');
							error.statusCode = error.statusCode
								? error.statusCode
								: this.constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR;
							const error_handler = ApiError.errorHandler(error)[error.statusCode];

							if (ENDPOINTS.length > 0) {
								ENDPOINTS.forEach((endpoint: any) => {
									if (
										ENDPOINTS.includes(req.headers.referer || "") ||
										ENDPOINTS.includes(req.originalUrl || "") ||
										ENDPOINTS.includes(req.url || "")
									) {
										return res.status(_status).json({
											statusCode: error_handler.status_code,
											message: error_handler.status_title
										});
									}
								});
							}

							return res.status(_status).render("undefined_routes", {
								nav_title: "",
								path: "/undefined_routes/",
								isUserAuthenticated: req?.session?.isUserAuthenticated,
								error: null,
								warning: null,
								success: null,
								status_code: error_handler.status_code,
								status_title: error_handler.status_title,
								status_description: message || error_handler.status_description,
								url: error_handler.url,
								label: error_handler.label
							});
						}
					}

					if (req.isPost()) {
						return res.status(_status).render("undefined_routes", {
							nav_title: "",
							path: "/undefined_routes/",
							isUserAuthenticated: req?.session?.isUserAuthenticated,
							error: null,
							warning: null,
							success: null,
							status_code: 400,
							status_title: "Bad Request",
							status_description: `Wondering from where have you requested this url, but you can click the button below
								to go back to the homepage.`,
							url: "/",
							label: "Home"
						});
					} else if (req.isGet()) {
						return res.status(_status).render("undefined_routes", {
							nav_title: "",
							path: "/undefined_routes/",
							isUserAuthenticated: req?.session?.isUserAuthenticated,
							error: null,
							warning: null,
							success: null,
							status_code: 404,
							status_title: "UH OH! You're lost.",
							status_description: `The page you are looking for does not exist.
								How you got here is a mystery. But you can click the button below
								to go back to the homepage.`,
							url: "/",
							label: "Home"
						});
					} else if (req.isPatch()) {
						return res.status(_status).render("undefined_routes", {
							nav_title: "",
							path: "/undefined_routes/",
							isUserAuthenticated: req?.session?.isUserAuthenticated,
							error: null,
							warning: null,
							success: null,
							status_code: 400,
							status_title: "Bad Request",
							status_description: `Wondering from where have you requested this url, but you can click the button below
								to go back to the homepage.`,
							url: "/",
							label: "Home"
						});
					} else if (req.isPut()) {
						return res.status(_status).render("undefined_routes", {
							nav_title: "",
							path: "/undefined_routes/",
							isUserAuthenticated: req?.session?.isUserAuthenticated,
							error: null,
							warning: null,
							success: null,
							status_code: 400,
							status_title: "Bad Request",
							status_description: `Wondering from where have you requested this url, but you can click the button below
								to go back to the homepage.`,
							url: "/",
							label: "Home"
						});
					} else if (req.isDelete()) {
						return res.status(_status).render("undefined_routes", {
							nav_title: "",
							path: "/undefined_routes/",
							isUserAuthenticated: req?.session?.isUserAuthenticated,
							error: null,
							warning: null,
							success: null,
							status_code: 400,
							status_title: "Bad Request",
							status_description: `Wondering from where have you requested this url, but you can click the button below
								to go back to the homepage.`,
							url: "/",
							label: "Home"
						});
					}
				}
			});

			// const httpServer = https.createServer(httpsOptions, this.app);
			const httpServer = http.createServer(this.app);
			// const io = Websocket.getIoInstance(httpServer);
			// class.initializeHandlers([
			//     { path: '/chat', handler: new ChatSockets() }
			// ]);
			// todo read migrations
			// todo httpbin
			// todo nginx
			process.on("message", (msg) => {
				if (msg === "shutdown") {
					console.log(
						`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}Worker ${process.pid} shutting down gracefully...${this.constants.COLORS.Reset}`
					);
					server.close(() => {
						console.log(
							`${this.constants.COLORS.BgGreen}${this.constants.COLORS.FgBlack}Worker ${process.pid} closed.${this.constants.COLORS.Reset}`
						);
						process.exit(0);
					});
				}
			});
			process.on("uncaughtException", (err) => {
				console.error(
					`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}Unhandled exception in worker process:${this.constants.COLORS.Reset}`,
					err
				);
			});
			process.on("unhandledRejection", (err) => {
				console.error(
					`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}Unhandled promise rejection in worker process:${this.constants.COLORS.Reset}`,
					err
				);
			});
			process.on("error", (err) => {
				if (err.code === "EPIPE") {
					console.error(
						`${this.constants.COLORS.FgRed}${this.constants.COLORS.BgWhite}EPIPE error occurred in worker process${this.constants.COLORS.Reset}`
					);
				}
			});

			// @ts-ignore
			const server = httpServer.listen(port, "localhost", async () => {
				const { address, port } = server.address() as { address: string; port: number };
				if (config.configurations().executionPoint === this.constants.NPM) {
					console.log(
						`${this.constants.COLORS.FgBlue}${this.constants.COLORS.Bright}Express Server Is Running Natively On Port ${port}!${this.constants.COLORS.Reset}`
					);
				} else if (config.configurations().executionPoint === this.constants.PM2) {
					console.log(
						`${this.constants.COLORS.BgMagenta}${this.constants.COLORS.Bright}Running On Load Balancer PM2..!${this.constants.COLORS.Reset}`
					);
					console.log(
						`${this.constants.COLORS.FgBlue}${this.constants.COLORS.Bright}Express Server Is Running On Port ${port}!${this.constants.COLORS.Reset}`
					);
					(<any>process).send("ready");
				} else {
					console.log(
						`${this.constants.COLORS.FgBlue}${this.constants.COLORS.Bright} Express Server Is Running Natively On Port ${port}!${this.constants.COLORS.Reset}`
					);
				}

				console.log(
					`${this.constants.COLORS.FgYellow}${this.constants.COLORS.Bright}Worker ${process.pid} is running the server on port ${port} on the IP-Address ${address} using TypeScript!${this.constants.COLORS.Reset}`
				);
			});

			return server;
		}
	}

	static init() {
		return Server.getServerInstance().run();
	}
}

Server.init();

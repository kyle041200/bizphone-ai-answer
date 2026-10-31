# Worker source package

Follow `importer/worker/README.md` inside the worker ZIP. Run commands from its
`kghq-worker` root; the importer/engine and importer/worker layout is preserved.
Install locked engine dependencies once, build the runner, configure the private
environment file, quotas and TLS, then connect WordPress. No customer-facing
worker service is supplied by these files. Do not use the CLI per normal import.

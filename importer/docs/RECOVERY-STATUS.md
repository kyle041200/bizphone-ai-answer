# Acceptance workspace recovery

The replacement cloud environment contains a fresh checkout, not the old
workspace's unpushed development tree, Docker volumes, or acceptance evidence.
The published checkpoint `9689f4c497f3591bfdf864b8db3130b34f8c4a30` was
recovered unchanged before creating `kghq-importer-acceptance-qa`.

Earlier conversational reports of later acceptance passes cannot be used as
verifiable evidence for this recovered source. Those later local files are
unavailable. New results must be generated, dated and published separately.
The existing `phase-2` and `automation-preview` downloads remain historical.

The user-approved optional `KGHQ_ALLOWED_OWNERS` setting has been restored and
unit tested. It is disabled by default. Exact repository authorization remains
the default. This does not change any user's running worker configuration.

This is a recovery/development branch, not a production-ready release.

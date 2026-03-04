# 2026-03-04T18:10:27Z: Document validate-env usage in README

Summary

- Documented the  helper in  and added a short "Validate environment helper" section.

Why

- Developers and CI can run 
> tasklr@1.0.0 validate-env
> node scripts/validate_oauth_env.js to catch missing OAuth environment variables and incorrect redirect URIs early.

Files changed

-  - appended a short section describing 
> tasklr@1.0.0 validate-env
> node scripts/validate_oauth_env.js and what it checks.
-  - this update file.

How I tested

- Verified  already exposes  and validated the new README lines were appended.

Turns used for this update: 6/150

Next steps

- Optionally wire 
> tasklr@1.0.0 validate-env
> node scripts/validate_oauth_env.js into CI or add a dedicated CI job to run it before smoke tests.

Signed-off-by: Codex CLI

# Records import and export
<!-- architect-operation-contract
{"required_capability_ids":["record_exports.control","record_exports.create","record_exports.download","record_exports.get","record_imports.control","record_imports.create","record_imports.errors_list","record_imports.get","record_imports.list","record_imports.rows_stage","record_imports.source_upload"]}
-->

Use canonical transfer jobs with explicit object, source, mapping, selection, and revision authority. Stage and validate import rows before creating an import. Retain upload identity, mapping revision, row results, errors, source identity, created record IDs, and terminal receipts.

For exports, preserve exact filter/selection snapshots and never treat a download URL as durable completion without the canonical export job. Import/export retry, cancel, or other control actions require the exact current job and explicit server confirmation. Report partial row outcomes instead of flattening them into success.

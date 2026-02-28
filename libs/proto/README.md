# Kafka Topic and Contract Versioning

- Topic naming: `<domain>.<entity>.<event>.v<major>`
  - Example: `hrms.employee.events.v1`
- Contract file: `libs/proto/hrms/v1/employee_events.proto`
- Compatibility:
  - Non-breaking field additions: bump minor (`1.1.0`)
  - Breaking change (rename/remove/type change): new topic major (`v2`) + schema major (`2.0.0`)
- Event envelope fields required:
  - `event_id`, `occurred_at`, `schema_version`, payload

{{- define "admin-panel.fullname" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
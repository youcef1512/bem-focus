Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-MissionPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$PathValue
    )

    if ($PathValue.StartsWith("~/")) {
        $homePath = [Environment]::GetFolderPath("UserProfile")
        $relativePath = $PathValue.Substring(2).Replace("/", "\")
        return Join-Path $homePath $relativePath
    }

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return $PathValue
    }

    return Join-Path (Get-Location) $PathValue
}

function Test-Blank {
    param(
        [AllowNull()]
        [object]$Value
    )

    if ($null -eq $Value) {
        return $true
    }

    return [string]::IsNullOrWhiteSpace([string]$Value)
}

function Write-MissionLog {
    param(
        [Parameter(Mandatory = $true)]
        [string]$MissionId,
        [Parameter(Mandatory = $true)]
        [string]$Status,
        [Parameter(Mandatory = $true)]
        [string[]]$Notes
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
    $lines = @(
        "# Mission Log",
        "",
        "## Latest Run",
        "- Timestamp: $timestamp",
        "- Mission: $MissionId",
        "- Status: $Status"
    )

    foreach ($note in $Notes) {
        $lines += "- Note: $note"
    }

    Set-Content -LiteralPath "mission_log.md" -Value $lines
}

$missionPath = Join-Path (Get-Location) "mission.json"
if (-not (Test-Path -LiteralPath $missionPath)) {
    throw "mission.json not found in the current workspace."
}

$mission = Get-Content -LiteralPath $missionPath -Raw | ConvertFrom-Json
$notes = New-Object System.Collections.Generic.List[string]

if (Test-Blank $mission.mission_id) {
    throw "mission_id is required."
}

if (Test-Blank $mission.finish_line_metric) {
    throw "finish_line_metric is required."
}

if ($null -eq $mission.success_criteria -or $mission.success_criteria.Count -eq 0) {
    throw "At least one success_criteria entry is required."
}

$humanVariables = @("visual_mood", "pacing", "audience_feeling")
foreach ($name in $humanVariables) {
    $value = $mission.human_variables_confirmed.$name
    if (Test-Blank $value) {
        $notes.Add("Human gate failed: missing $name.")
    }
}

$manifestResolved = $null
if ($mission.environment -and $mission.environment.manifest_ref) {
    $manifestResolved = Resolve-MissionPath -PathValue $mission.environment.manifest_ref
    if (Test-Path -LiteralPath $manifestResolved) {
        $notes.Add("Environment manifest found at $manifestResolved.")
    }
    else {
        $notes.Add("Environment manifest not found at $manifestResolved. Continue with local context.")
    }
}

if ($notes.Exists({ param($n) $n -like "Human gate failed:*" })) {
    Write-MissionLog -MissionId $mission.mission_id -Status "Blocked" -Notes $notes
    Write-Output "Mission blocked. See mission_log.md for details."
    exit 2
}

$notes.Add("Mission is ready for implementation planning.")
$notes.Add("Finish line: $($mission.finish_line_metric)")
$notes.Add("Auto-deploy trigger: $($mission.auto_deploy.trigger)")

Write-MissionLog -MissionId $mission.mission_id -Status "Ready" -Notes $notes
Write-Output "Mission ready. Guardrails passed."

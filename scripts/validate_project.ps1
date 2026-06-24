param(
  [string]$Root = (Resolve-Path ".").Path
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$errors = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Error([string]$Message) { $script:errors.Add($Message) | Out-Null }
function Add-Warning([string]$Message) { $script:warnings.Add($Message) | Out-Null }
function Rel([string]$Path) {
  $resolved = (Resolve-Path $Path).Path
  if ($resolved.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
    return $resolved.Substring($Root.Length).TrimStart("\", "/")
  }
  return $resolved
}
function U([int[]]$Codes) { return (-join ($Codes | ForEach-Object { [char]$_ })) }

$srcFiles = Get-ChildItem (Join-Path $Root "sources/index") -Filter "SRC-*.md" -File
$evtFiles = Get-ChildItem (Join-Path $Root "notes/events") -Filter "EVT-*.md" -File
$perFiles = Get-ChildItem (Join-Path $Root "notes/people") -Filter "PER-*.md" -File
$chapterFiles = Get-ChildItem (Join-Path $Root "manuscript") -Filter "ch_*.md" -File
$appendixFiles = Get-ChildItem (Join-Path $Root "manuscript") -Filter "appendix_*.md" -File

if ($srcFiles.Count -lt 17) { Add-Error "source cards fewer than 17: $($srcFiles.Count)" }
if ($evtFiles.Count -lt 26) { Add-Error "event cards fewer than 26: $($evtFiles.Count)" }
if ($perFiles.Count -lt 26) { Add-Error "person cards fewer than 26: $($perFiles.Count)" }
if ($chapterFiles.Count -ne 21) { Add-Error "chapter count is not 21: $($chapterFiles.Count)" }
if ($appendixFiles.Count -ne 6) { Add-Error "appendix count is not 6: $($appendixFiles.Count)" }

$scanRoots = @("manuscript", "notes", "sources", "QUALITY_REPORT.md", "TRANSLATION_GUIDE.md", "UPDATE_PROTOCOL.md") |
  ForEach-Object { Join-Path $Root $_ } |
  Where-Object { Test-Path $_ }

$scanFiles = foreach ($item in $scanRoots) {
  if ((Get-Item $item).PSIsContainer) {
    Get-ChildItem $item -Recurse -File -Filter "*.md"
  } else {
    Get-Item $item
  }
}

$placeholderRegex = "SRC-XXXX|TODO|FIXME"
$placeholderTerms = @(
  (U @(0x5F85, 0x5199, 0x4F5C)),
  (U @(0x5F85, 0x8865, 0x5145))
)

foreach ($file in $scanFiles) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  if ($text -match $placeholderRegex) {
    Add-Error "placeholder remains: $(Rel $file.FullName)"
  }
  foreach ($term in $placeholderTerms) {
    if ($text.Contains($term)) {
      Add-Error "Chinese placeholder remains: $(Rel $file.FullName)"
    }
  }
}

$srcIds = @{}
foreach ($f in $srcFiles) { $srcIds[$f.BaseName] = $true }
$evtIds = @{}
foreach ($f in $evtFiles) { $evtIds[$f.BaseName] = $true }
$perIds = @{}
foreach ($f in $perFiles) { $perIds[$f.BaseName] = $true }

$orgIds = @{}
$orgPath = Join-Path $Root "notes/organizations.md"
if (Test-Path $orgPath) {
  foreach ($line in Get-Content -Encoding UTF8 $orgPath) {
    if ($line -match '^\|\s*(ORG-\d{4})\s*\|') { $orgIds[$matches[1]] = $true }
  }
}

foreach ($file in $scanFiles) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  foreach ($m in [regex]::Matches($text, "SRC-\d{4}")) {
    if (-not $srcIds.ContainsKey($m.Value)) { Add-Error "missing source ref $($m.Value): $(Rel $file.FullName)" }
  }
  foreach ($m in [regex]::Matches($text, "EVT-\d{4}")) {
    if (-not $evtIds.ContainsKey($m.Value)) { Add-Error "missing event ref $($m.Value): $(Rel $file.FullName)" }
  }
  foreach ($m in [regex]::Matches($text, "PER-\d{4}")) {
    if (-not $perIds.ContainsKey($m.Value)) { Add-Error "missing person ref $($m.Value): $(Rel $file.FullName)" }
  }
  foreach ($m in [regex]::Matches($text, "ORG-\d{4}")) {
    if (-not $orgIds.ContainsKey($m.Value)) { Add-Error "missing organization ref $($m.Value): $(Rel $file.FullName)" }
  }
}

$sectionGroups = @(
  @{ Label = "summary"; Terms = @((U @(0x672C, 0x7AE0, 0x6458, 0x8981))) },
  @{ Label = "background"; Terms = @((U @(0x5386, 0x53F2, 0x80CC, 0x666F))) },
  @{ Label = "body"; Terms = @(
      (U @(0x4E8B, 0x4EF6, 0x7ECF, 0x8FC7)),
      (U @(0x4E8B, 0x4EF6, 0x5206, 0x6790)),
      (U @(0x4EBA, 0x7269, 0x5FD7)),
      (U @(0x4E8C, 0x5341, 0x516D, 0x7FFC, 0x4F53, 0x7CFB)),
      (U @(0x4E94, 0x5927, 0x624B, 0x6307))
    ) },
  @{ Label = "key actors"; Terms = @(
      (U @(0x5173, 0x952E, 0x4EBA, 0x7269)),
      (U @(0x5173, 0x952E, 0x7EC4, 0x7EC7, 0x4E0E, 0x5730, 0x70B9)),
      (U @(0x5173, 0x952E, 0x4EBA, 0x7269, 0x4E0E, 0x7EC4, 0x7EC7))
    ) },
  @{ Label = "impact"; Terms = @((U @(0x540E, 0x679C, 0x4E0E, 0x5F71, 0x54CD))) },
  @{ Label = "uncertainty"; Terms = @((U @(0x672A, 0x786E, 0x8BA4, 0x70B9))) },
  @{ Label = "sources"; Terms = @((U @(0x4E3B, 0x8981, 0x53C2, 0x8003, 0x6765, 0x6E90))) }
)

foreach ($chapter in $chapterFiles) {
  $text = Get-Content -Raw -Encoding UTF8 $chapter.FullName
  if ($text.Length -lt 2000) { Add-Warning "chapter is short: $(Rel $chapter.FullName)" }
  if ($text -notmatch "SRC-\d{4}") { Add-Error "chapter has no SRC ref: $(Rel $chapter.FullName)" }
  if ($text -notmatch "EVT-\d{4}") { Add-Error "chapter has no EVT ref: $(Rel $chapter.FullName)" }
  foreach ($group in $sectionGroups) {
    $found = $false
    foreach ($term in $group.Terms) {
      if ($text.Contains($term)) { $found = $true; break }
    }
    if (-not $found) { Add-Warning "chapter missing section group $($group.Label): $(Rel $chapter.FullName)" }
  }
}

foreach ($src in $srcFiles) {
  $text = Get-Content -Raw -Encoding UTF8 $src.FullName
  foreach ($m in [regex]::Matches($text, "word_count:\s*(\d+)")) {
    $count = [int]$m.Groups[1].Value
    if ($count -gt 25) { Add-Error "quote word_count exceeds 25: $(Rel $src.FullName) = $count" }
  }
}

$bookPath = Join-Path $Root "manuscript/BOOK.md"
if (-not (Test-Path $bookPath)) {
  Add-Error "missing manuscript/BOOK.md"
} else {
  $book = Get-Content -Raw -Encoding UTF8 $bookPath
  $markers = [regex]::Matches($book, "<!-- source-file:").Count
  if ($markers -ne 28) { Add-Error "BOOK.md source-file marker count is not 28: $markers" }
  $bookSources = @("00_preface.md") + ($chapterFiles | Sort-Object Name | ForEach-Object Name) + ($appendixFiles | Sort-Object Name | ForEach-Object Name)
  foreach ($source in $bookSources) {
    if ($book -notmatch [regex]::Escape($source)) { Add-Error "BOOK.md missing merged file marker: $source" }
  }
}

$legacyTerms = @(
  (U @(0x5361, 0x9686)),
  (U @(0x7EF4, 0x5409, 0x5229, 0x4E4C, 0x65AF)),
  (U @(0x65C5, 0x79C0)),
  (U @(0x83AB, 0x5C14, 0x7D22))
)
$legacyScanFiles = Get-ChildItem (Join-Path $Root "manuscript") -Recurse -File -Filter "*.md" |
  Where-Object { $_.Name -notin @("appendix_f_terminology.md", "BOOK.md") }
foreach ($file in $legacyScanFiles) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  foreach ($term in $legacyTerms) {
    if ($text.Contains($term)) { Add-Error "legacy term remains in manuscript source: $(Rel $file.FullName)" }
  }
}

if ($errors.Count -eq 0) {
  Write-Output "PASS: validation completed with $($warnings.Count) warning(s)."
} else {
  Write-Output "FAIL: validation completed with $($errors.Count) error(s), $($warnings.Count) warning(s)."
}
foreach ($w in $warnings) { Write-Output "WARN: $w" }
foreach ($e in $errors) { Write-Output "ERROR: $e" }

if ($errors.Count -gt 0) { exit 1 }
